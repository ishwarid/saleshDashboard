import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../environments/environment";
import { catchError } from "rxjs/internal/operators/catchError";
import { Url } from "url";



@Injectable()
export class BackendService {
 

  constructor(private httpClient: HttpClient) { }

    
  getData(interval: string, salesFilter: string): any {
    if(salesFilter !== 'All'){
      return this.httpClient.get("https://nzhd55ek4c.execute-api.ap-south-1.amazonaws.com/prod/?timeframe=" + interval +"&forverticle="+salesFilter);
    }else{    
    return this.httpClient.get("https://nzhd55ek4c.execute-api.ap-south-1.amazonaws.com/prod/?timeframe=" + interval);
    }
  }
 
}
