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
  tableHeader = [];
  call_done = 0;
  total_call: Number;
  total_wins: Number;
  wins = 0;
  total_revenu: Number;
  revennu = 0;
  sales_persons = [];
  funnel_data = {};
  eventData: String;
  options = ["All"];
  optionSelected: String;
  selectedItem: String;
  loading = {
    salesData: false
  };
  ngOnInit() {
    // for deafult
    this.eventData = 'last_week';
    this.optionSelected = this.options[0];
    this.selectedItem = 'top'
    this.sortSalesRepData(this.selectedItem)
    this.getDashbordData('last_week', this.optionSelected)
  }

  onOptionsSelected(event) {
    // this function for dropdown selections

    this.getDashbordData(this.eventData, event)
  }

  colorSet(item) {
    //  change the color of row in deatils table as per conditions

    if (item === 'Won') {
      return "#e6f5e6"
    } else if (item === 'Lost') {
      return "#fff2f2"
    } else {
      return "f8f9fb"
    }
  }
  setLoading(field: string) {
    this.loading[field] = true;
  }

  setLoadingComplete(field: string) {

    setTimeout(() => {
      // Start fading out and hide after delay
      this.loading[field] = false;

    }, 500);
  }
  getDashbordData(event: any, dropDown_value) {

    // on nav bar click this function will invoke(today ...)

    this.setLoading("salesData");
    this.eventData = event;
    dropDown_value = this.optionSelected;
    this.backendService
      .getData(event, dropDown_value)
      .subscribe(data => {
        this.setLoadingComplete("salesData");

        console.log("data.sales_rep",  data.funnel)
        this.sales_persons = data.sales_rep;
        
        this.funnel_data = data.funnel;
        this.tableHeader = data.rawdata;

        // as per click temporary provoding limits as fixed values
        if (event == 'today') {
          this.total_call = 20;
          this.total_wins = 5;
          this.total_revenu = 100;
          this.call_done = data.noOfCalls;
          this.wins = data.noOfWon
          this.revennu = Math.round((data.totalRevenue) / 10000)
        } else if (event == 'last_week') {
          this.total_call = 75;
          this.total_wins = 10;
          this.total_revenu = 150;
          this.call_done = data.noOfCalls;
          this.wins = data.noOfWon
          this.revennu = Math.round((data.totalRevenue) / 10000)
        }
        else if (event == 'last_month') {
          this.total_call = 205;
          this.total_wins = 15;
          this.total_revenu = 250;
          this.call_done = data.noOfCalls;
          this.wins = data.noOfWon
          this.revennu = Math.round((data.totalRevenue) / 10000)
        }
        else if (event == 'last_quarter') {
          this.total_call = 350;
          this.total_wins = 25;
          this.total_revenu = 400;
          this.call_done = data.noOfCalls;
          this.wins = data.noOfWon
          this.revennu = Math.round((data.totalRevenue) / 10000)
        }
        else if (event == 'last_year') {
          this.total_call = 500;
          this.total_wins = 30;
          this.total_revenu = 500;
          this.call_done = data.noOfCalls;
          this.wins = data.noOfWon
          this.revennu = Math.round((data.totalRevenue) / 10000)
        }

        // loop to create dropdown data of vertival coloumn
        data.rawdata.forEach(e => {
         
          if (this.options.indexOf(e.verticle.S) == -1) {
            this.options.push(e.verticle.S);
          }

        })

        // to sort salesperson cards as per nav click
        this.sortSalesRepData(this.selectedItem)

      }
      );
  }


  sortSalesRepData(action) {

    // as per top or bottom sales[] is sorting


    if (action == 'top') {
      this.selectedItem = 'top';
      this.sales_persons.sort((a, b) => 0 - (a.rev > b.rev ? 1 : -1));
    } else {
      this.selectedItem = 'bottom'
      this.sales_persons.sort((a, b) => 0 - (a.rev > b.rev ? -1 : 1));
    }

  }
}
