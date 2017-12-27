import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service/api-service.service'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component'


@Component({
  selector: 'app-excel',
  templateUrl: './excel.component.html',
  styleUrls: ['./excel.component.css']
})
export class ExcelComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public apiService : ApiService) { }
    public selectThisManager;
    public selectThisCycle;

    public room;
    public rooms = [];
    public facilityId;
    public roomId;
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
      }
    }

    ngOnInit() {
      let sub = this.route.params.subscribe(params => {this.facilityId = params['facilityId'],this.room = params['roomId'];});
      console.log('init excel Facility, Room',this.facilityId,this.room);    
      this.loadFacilities();
      
    }

    WriteTodaysExcelFile(Facility,Room){

    console.log("Facility Room",Facility,Room);


  }





  loadFacilities() {
    let these = this;
    setTimeout(function () {
    these.apiService.getTextFile('facilityList').subscribe(res => {
      these.facilities = res.data;
    //  console.log(these.facilities)
    })
  }, 20);
  }

  loadRooms() {
    let that = this;
    setTimeout(function () {
      //console.log('Loading rooms for facility ' + that.facilityId)
      that.apiService.getRooms(that.facilityId).subscribe(res => {
        that.rooms = res.data;
        //console.log(that.rooms)
      })
    }, 20);
  }

  loadAllRooms() {
    let that = this;
    setTimeout(function () {
//      console.log('Loading All rooms for ' + that.facilityId)
      that.apiService.getAllRooms(that.facilityId).subscribe(res => {
        that.rooms = res.data;
  //      console.log(that.rooms)
      })
    }, 20);
  }

}
