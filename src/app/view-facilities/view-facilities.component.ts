import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service/api-service.service'

@Component({
  selector: 'app-view-facilities',
  templateUrl: './view-facilities.component.html',
  styleUrls: ['./view-facilities.component.css']
})
export class ViewFacilitiesComponent implements OnInit {
  constructor(public apiService : ApiService) { 
  }

ngOnInit() {
  this.loadFacilities();
}


public facilities = [];

loadFacilities() {
  this.apiService.getTextFile('facilityList').subscribe(res => {
    console.log(res)
    this.facilities = res.data;
    console.log(this.facilities)
  })
}

}

