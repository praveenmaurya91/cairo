import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api-service/api-service.service'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'enrol-manager',
  templateUrl: './enrol-manager.component.html',
  styleUrls: ['./enrol-manager.component.css']
})
export class EnrolManagerComponent implements OnInit {

  constructor(
  private route: ActivatedRoute,
  private router: Router,
  public  apiService : ApiService
  ) { }

//  public managerId:string;
  public managerId;
  
  public months:Array<string> = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  public managers = [];
  public facilities = [];
  
  loadFacilities() {
    this.apiService.getTextFile('facilityList').subscribe(res => {
      console.log(res) 
      this.facilities = res.data;
      console.log('facility',this.facilities)
    })
  }
  
  loadManagers() {
    this.apiService.getTextFile('managersList').subscribe(res => {
      console.log(res)
      this.managers = res.data;
      console.log('managers.length ',this.managers.length    )
      console.log(this.managers)
      this.loadManager();
    })
  }
  
  loadManager() {
    for (let i = 0; i < this.managers.length; i++) {
      console.log(this.managers[i].id, this.managerId)
      if (this.managers[i].id == this.managerId) {
        this.manager = this.managers[i];
        break;
      }
    }
    console.log(this.manager)
  }
  
  public manager = {
    name: '',
    number:'',
    phone: '',
    username: '',
    address: '',
    birthMonth: '',
    IP4a: '',
    IP4b: '',
    IP4c: '',
    IP4d: '',
    facility1: '',
    facility2: '',
    facility3: '',
    facility4: ''
  }
    
  clearForm() {
    this.manager = {
      name: '',
      number: '',
      phone: '', 
      username: '', 
      address: '',
      birthMonth: '',
      IP4a: '',
      IP4b: '',
      IP4c: '',
      IP4d: '',
      facility1: '',
      facility2: '',
      facility3: '',
      facility4: ''   
    };
  }
  
  submitForm() {
    console.log(this.manager)
    this.apiService.get('/enrolManager/'+ this.manager.name + '/' + this.manager.address + '/' + this.manager.phone  + '/' + this.manager.username  + '/' + this.manager.IP4a  + '/' + this.manager.IP4b  + '/' + this.manager.IP4c  + '/' + this.manager.IP4d  + '/' + this.manager.facility1  + '/' + this.manager.facility2  + '/' + this.manager.facility3  + '/' + this.manager.facility4  + '/' + this.manager.birthMonth  + '/' + this.managerId).subscribe(res => {        
      console.log(res)
    })
  }

  ngOnInit() {
    let sub = this.route.params.subscribe(params => {this.managerId = params['id'];});
    this.loadFacilities();
    this.loadManagers();
  }


}
