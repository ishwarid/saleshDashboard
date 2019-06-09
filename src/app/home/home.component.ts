import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
declare var $;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public backendService: BackendService) { }
  tableHeader= [];
  call_done = 0;
  total_call:Number;
  total_wins:Number;
  wins = 0;
  total_revenu:Number;
  revennu = 0;
  sales_persons = [];
  funnel_data ={};
  eventData:String;
  options =["All"];
  optionSelected :String;
  selectedItem:String;
  loading = {
    salesData: false
  };
  ngOnInit() {
    
    this.eventData = 'last_week';
    this.optionSelected = this.options[0];
    this.selectedItem = 'top'
    this. sortSalesRepData(this.selectedItem)
    this.getDashbordData('last_week', this.optionSelected)
  }

onOptionsSelected(event){
  console.log("============",event); //option value will be sent as event
  
  this.getDashbordData(this.eventData,event)
 }

 colorSet(item){
   console.log("item", item)
   if (item === 'Won'){
     return "#e6f5e6"
   }else if(item === 'Lost'){
     return "#fff2f2"
   }else{
     return "f8f9fb"
   }
 }
 setLoading(field: string) {
  this.loading[field] = true;
}

setLoadingComplete(field: string) {
  // $("#" + field + "-overlay").fadeOut(500);
  setTimeout(() => {
    // Start fading out and hide after delay
    this.loading[field] = false;
    console.log("Changed to false");
  }, 500);
}
  getDashbordData(event: any, dropDown_value){
    this.setLoading("salesData");
    this.eventData = event;
    dropDown_value = this.optionSelected;
    this.backendService
      .getData(event, dropDown_value)
      .subscribe(data => {
        this.setLoadingComplete("salesData");
        this.sales_persons = data.sales_rep;
        this.funnel_data = data.funnel;
        
        
        console.log("data",data.rawdata)
        this.tableHeader = data.rawdata;
        if(event == 'today'){
        this.total_call = 20;
        this.total_wins = 5;
        this.total_revenu = 100;      
        this.wins = data.noOfWon
        this.revennu = Math.round((data.totalRevenue)/1000)
        }else if(event == 'last_week'){
          this.total_call = 75;
          this.total_wins = 10;
          this.total_revenu = 150; 
          this.call_done = data.noOfWon;
          this.wins = data.noOfWon
          this.revennu = Math.round((data.totalRevenue)/1000)
        }
        else if(event == 'last_month'){
          this.total_call = 205;
          this.total_wins = 15;
          this.total_revenu = 250; 
          this.call_done = data.noOfWon;
          this.wins = data.noOfWon
          this.revennu = Math.round((data.totalRevenue)/1000)
        }
        else if(event == 'last_quarter'){
          this.total_call = 350;
          this.total_wins = 25;
          this.total_revenu =400; 
          this.call_done = data.noOfWon;
          this.wins = data.noOfWon
          this.revennu = Math.round((data.totalRevenue)/1000)
        }
        else if(event == 'last_year'){
          this.total_call = 500;
          this.total_wins = 30;
          this.total_revenu =500; 
          this.call_done = data.noOfWon;
          this.wins = data.noOfWon
          this.revennu = Math.round((data.totalRevenue)/1000)
        }
         

          data.rawdata.forEach(e => {
            console.log("---------",e.verticle.S)
            if (this.options.indexOf(e.verticle.S) == -1) {
              this.options.push(e.verticle.S);
          }
         
          })
       
      }
    );
  }


  sortSalesRepData(action){
    if(action == 'top'){
      this.selectedItem = 'top';
      this.sales_persons.sort((a,b) => 0 - (a.rev > b.rev ? 1 : -1));
    }else{
      this.selectedItem = 'bottom'
      this.sales_persons.sort((a,b) => 0 - (a.rev > b.rev ? -1 : 1));
    }

  }
}
