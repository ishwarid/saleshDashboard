var AWS = require('aws-sdk');
AWS.config.update({region: 'ap-south-1'});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

exports.handler = async (e,ctx,callback) => {
    console.log("Get data called with values ", JSON.stringify(e));
    var timeframe = e.queryStringParameters.timeframe || "last_week";
    var forverticle = e.queryStringParameters.forverticle || "na";
    var dt = new Date();    dt.setHours(0);    dt.setMinutes(0);    dt.setSeconds(0);    dt.setMilliseconds(0);
    if(timeframe == "today"){
        //date is already of today, thus do nothing
    } else if(timeframe == "last_week"){
        dt.setDate(dt.getDate() - 7);
    } else if(timeframe == "last_month"){
        dt.setMonth(dt.getMonth() - 1);
    } else if(timeframe == "last_quarter"){ 
        dt.setMonth(dt.getMonth() - 3);
    } else if(timeframe == "last_year"){
        dt.setFullYear(dt.getFullYear() - 1);
    }
    
    var json = {count:0, rawdata: [], funnel : {}, noOfCalls:0, noOfWon:0, totalRevenue:0 };    //global data json which will be returned to FE
    var sales_rp_map = {};  //will save all sales rep data in this and later convert to array and return to FE
    
    //return a prom so that lambda does not stop execution
    return new Promise((resolve, reject) => {
                
        
        var FilterExpression = "#yr >= :start_yr";
        var ExpressionAttributeNames = {                "#yr": "date"            };
        var ExpressionAttributeValues = {                 ":start_yr": {S: dt.toISOString()}            };
        if(forverticle && forverticle != "na"){
            FilterExpression = FilterExpression+" and #verticle = :forverticle";
            ExpressionAttributeNames["#verticle"] = "verticle";
            ExpressionAttributeValues[":forverticle"] = { S: forverticle};
        }
        var params = {
            TableName: "salesDashboard",
            FilterExpression: FilterExpression,
            ExpressionAttributeNames: ExpressionAttributeNames,
            ExpressionAttributeValues: ExpressionAttributeValues
        };
        
        console.log("Scanning Sales table.");
        ddb.scan(params, onScan);
        
        function onScan(err, data) {
            if (err) {
                console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
                return callback(err);
            } else {
                // print all the sales
                console.log("Scan succeeded.");
                
                //for each data row, update the return json.
                data.Items.forEach(function(onesale) {
                    json.count++;
                    json.rawdata.push(onesale);
                    if(!sales_rp_map[onesale.sales_rp.S]) sales_rp_map[onesale.sales_rp.S] = {rev: 0, logos:0, calls: 0};
                    if(onesale.meeting_location.S == "Call") {
                        sales_rp_map[onesale.sales_rp.S].calls++;
                        json.noOfCalls++;
                    }
                    if(onesale.revenue && onesale.revenue.N) {
                        sales_rp_map[onesale.sales_rp.S].rev += Number(onesale.revenue.N);
                        json.totalRevenue += Number(onesale.revenue.N);
                        sales_rp_map[onesale.sales_rp.S].logos++;
                        json.noOfWon++;
                    }
                    onesale.status.L.map((item)=>{
                        var temp = item.S;
                        temp = temp.replace(" ", "_");
                        if(!json.funnel[temp]) json.funnel[temp] = 0;
                        json.funnel[temp]++;
                    });
                });
        
                // continue scanning if we have more sales, because
                // scan can retrieve a maximum of 1MB of data
                if (typeof data.LastEvaluatedKey != "undefined") {
                    console.log("+++++++++++++++++Scanning for more...");
                    params.ExclusiveStartKey = data.LastEvaluatedKey;
                    ddb.scan(params, onScan);
                }else{
                    //All records are scanned 
                    
                    //sales_rp_map is a {} but we need an array
                    var srp_arr = Object.keys(sales_rp_map).map((name)=>{
                        var temp = sales_rp_map[name];
                        temp.name = name;
                        return temp;
                    });
                    //we need to sort srp_arr based on rev
                    srp_arr = srp_arr.sort(function(a, b){
                      if (a.rev > b.rev) return 1;
                      if (b.rev < a.rev) return -1;
                      return 0;
                    });
                    json.sales_rep = srp_arr;   //add the sales rep data to global json to be returned
                    console.log("+++++++++++++++++ALL DONE ", json.count);//, srp_arr);
                    callback(null, {
                        headers: {
                           "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
                           "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
                         },
                        "statusCode": 200,
                        "body": JSON.stringify(json),
                        "isBase64Encoded": false
                    });
                    ctx.succeed();
                }
            }
        }
    });
}

exports.handlerGenerateData = async (e,ctx,callback) => {
    // return "hello"
    console.log("Starting data generation");
    var random = function(min, max){
        return Math.floor(Math.random() * (+max - +min)) + +min; 
    };
    //console.log("random", random(4, 15));
    var sales_rp = ["John Doe", "Dore mon", "Shin chan", "Ninja Hatori", "Poke mon", "Kitret su"];
    var primary_contact_person = ["Suresh", "Ramesh", "Lokesh", "Hitesh", "Nainesh", "Preetesh"];
    var title = ["C Level", "VP Level", "Sr Manager", "Junior Level", "Director Level"];
    var verticle = ["Sales", "Marketing", "Tech", "Sr Management", "Accounts"];
    var client = ["Microsoft", "Google", "Amazon", "Facebook", "Uber", "Apple"];
    var meeting_location = ["Goto", "Face to Face", "Call", "Email", "Video", "Text"];
    var purpose = ["Negotiation", "Demo", "Requirement Gathering", "Intro", "Final negotiation"];
    var outcome = ["approved", "denied", "finalised", "scheduled next week", "completed"];
    var status = ["Lead_In", "Contact_Made", "Needs_Defined", "Proposal_Made", "Negotiation_Started", "Won"];
    
    var create10 = function(datestr){
        var items = [];
        for(var i=0; i< 10; i++){
            var item = {
                id: {N: random(5,20000).toString() + "" +random(50,20000).toString() + ""+random(500,20000).toString() + ""+random(5000,20000).toString()},
                'sales_rp' : {S: sales_rp[random(0,sales_rp.length)] },
                'date' : {S: datestr},
                'primary_contact_person': {S: primary_contact_person[random(0,primary_contact_person.length)] },
                'client': {S: client[random(0,client.length)] },
                'title': {S: title[random(0,title.length)] },
                'verticle': {S: verticle[random(0,verticle.length)] },
                'meeting_location': {S: meeting_location[random(0,meeting_location.length)] },
                'purpose': {S: purpose[random(0,purpose.length)] },
                'outcome': {S: outcome[random(0,outcome.length)] },
                'status': { L : []}
            };
            for(var j=0; j<i+1 && j<status.length; j++){
                item.status.L.push({ S : status[j] });
                if(status[j] == "Won"){
                    item.revenue = {N: random(500,20000).toString() };
                }
            }
            // console.log("------" + JSON.stringify(item))
            items.push(
                new Promise((resolve, reject) => {
                    ddb.putItem({ Item:item, TableName: "salesDashboard" }, function(err, data) {
                      if (err) {
                        console.log("Error", err);
                      } else {
                        console.log("Success", data);
                      }
                      return resolve();
                    });
                })
            );
            // items.push( { Item:item, TableName: "salesDashboard" });
        }
        // return;
        return Promise.all(items);
    };
    
    var tempdt = new Date();
    await create10(tempdt.toISOString());
    tempdt.setDate(tempdt.getDate() - 5);       //reduce 5 days for last week data
    await create10(tempdt.toISOString());
    tempdt.setDate(tempdt.getDate() - 20);       //reduce 20 more days for last month data
    await create10(tempdt.toISOString());
    tempdt.setDate(tempdt.getDate() - 50);       //reduce 50 more days for last quarter data
    await create10(tempdt.toISOString());
    tempdt.setDate(tempdt.getDate() - 150);       //reduce 150 more days for last year data
    await create10(tempdt.toISOString());
};
