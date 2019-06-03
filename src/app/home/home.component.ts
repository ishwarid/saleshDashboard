import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public backendService: BackendService) { }
  tableHeader= {};
  ngOnInit() {
  }

  getDashbordData(event: any){
    console.log("a tag clicked", event)
    this.backendService
      .getData(event)
      .subscribe(  data => {
        console.log("data",data)
        this.tableHeader = data
         
          // data.rawdata.forEach(e => {
          //   console.log
          //   this.tableHeader.push(e)
          // })
          // console.log("", this.tableHeader)
      }
    );
  }

}
