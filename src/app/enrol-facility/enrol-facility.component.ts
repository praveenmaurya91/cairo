import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service/api-service.service'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'enrol-facility',
  templateUrl: './enrol-facility.component.html',
  styleUrls: ['./enrol-facility.component.css']
})
export class EnrolFacilityComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public apiService : ApiService) { }

    public facilityId;
    public managerId;
    public managerID;
    public managers   = [];
  




  public timezones:Array<string> = [
    'Melbourne', 'Sydney', 'Brisbane', 'Perth', 'Adelaide', 'Darwin', 'Hobart'
  ]




  public facility = {   // db table declaration
    name: '',
    phone: '',
    IP4a: '',
    IP4b: '',
    IP4c: '',
    IP4d: '',
    address: '',
    primaryManager: '',
    startingMonthYear: '',
    rooms:'',
    timezone:'',
    siteManager: ''
  }

  public facilities = [];  // table of facilities of db type facility
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
    this.facility = {
      name: '',
      phone: '',
      IP4a: '',
      IP4b: '',
      IP4c: '',
      IP4d: '',
      address: '',
      primaryManager: '',
      startingMonthYear: '',
      rooms:'',
      timezone:'',
      siteManager: ''
    },
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

  ngOnInit() {
    //this.options = { tooltips: { enabled: false } }
    let sub = this.route.params.subscribe(params => {this.facilityId = params['id'];});

    this.loadFacilities();
    this.loadManagers();
    //this.managerId = this.facility.siteManager;
  }

  submitForm(managerID) {
//    this.facility.siteManager = this.manager.number;
    console.log('submitform: this.facility' , this.facility)
    //console.log('managerId',managerId)
    console.log('this.managerID',this.managerID)
    console.log('this.managerId',this.managerId)
    console.log('this.manager.number',this.manager.number)
    this.apiService.get('/enrolFacility/'+ this.facility.name + '/' + this.facility.address + '/' + this.facility.phone + '/' + this.facility.IP4a + '/' + this.facility.IP4b + '/' + this.facility.IP4c + '/' + this.facility.IP4d  + '/' + this.facility.primaryManager + '/' + this.facility.startingMonthYear + '/' + this.facility.rooms + '/' + this.facility.timezone + '/' + this.managerId  ).subscribe(res => {
    console.log('facility.siteManager',this.facility.siteManager)
    })
  }
  
    loadFacilities() {
      this.apiService.getTextFile('facilityList').subscribe(res => {
        //console.log(res)
        this.facilities = res.data;
        //console.log(this.facilities)
        this.loadFacility();
        //this.managerId  = this.facility.siteManager;
        console.log('this.managerId',this.managerId)
        console.log('this.facility',this.facility)
        
      })
    }

    loadFacility() {
      //console.log(this.facilities)
      console.log('length',this.facilities.length)
      
      for (let i = 0; i < this.facilities.length; i++) {
        console.log('this.facilities[i].id, this.facilityId',this.facilities[i].id, this.facilityId)
        if (this.facilities[i].id == this.facilityId) {
          this.facility = this.facilities[i];
          console.log('this.facility.siteManager',this.facility.siteManager)
          //this.managerId  = this.facility.siteManager;
          break;
        }
      }
      console.log(this.facility)
    }


  loadManagers() {
    this.apiService.getTextFile('managersList').subscribe(res => {
     // console.log(res)
      this.managers = res.data;
      console.log('managers.length ',this.managers.length    )
      console.log('managers',this.managers)
      console.log('this.managerId',this.managerId)
      console.log('this.facility',this.facility)
      //this.managerId  = this.facility.siteManager;
    })
  }

}
