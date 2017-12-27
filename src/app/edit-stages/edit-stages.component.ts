import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service/api-service.service'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
//import { EditRoomStagesComponent } from '../edit-room-stages/edit-room-stages.component';
//import { AdjustRoomCycleComponent } from '../adjust-room-cycle/adjust-room-cycle.component';
import { NavbarComponent } from '../navbar/navbar.component'

@Component({
  selector: 'edit-stages',
  templateUrl: './edit-stages.component.html',
  styleUrls: ['./edit-stages.component.css']
})
export class EditStagesComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public apiService: ApiService){}

    ngOnInit() {
      let sub = this.route.params.subscribe(params => { this.command = params['command']; this.facilityId = params['facilityid']; this.roomId = params['roomid']; this.cycleId = params['cycleid'];this.stageId = params['stageid'];});
  
      console.log('init edit-stages: command =',this.command)
      console.log('init edit-stages: facilityId =',this.facilityId)
      console.log('init edit-stages: roomId =',this.roomId)
      console.log('init edit-stages: stageId =',this.stageId)
      console.log('init edit-stages: cycleId =',this.cycleId)
      
      this.clearForm();
      this.loadFacilities();
      this.loadManagers();
      //this.loadAllCycles();
      this.loadAllCycles(this.cycleId,this.stageId);
      //console.log('this.roomStages ',this.roomStages) // not loaded yet  
    }

  public allCycles  = [];  // table of allCycles   of db type roomCycle    
  public stageId;
  public facilityId;
  public managerId;
  public cycleId;
  public roomId;
  public command;
  public facilityName;
  public roomName;
  
  public rooms      = [];
  public managers   = [];
  public facilities = [];  // table of facilities of db type facility 
  public roomStages = [];  // table of stages      of db type roomStage
    //public roomStages = new Array(this.roomStage);

  
    public roomCycle  = {
      sFacility: '',
      sRoom:'',
      currentStage: '',
      processName: '',
      numberStages: '',
      startTime: '',
      minEndTime: '',
      maxEndTime: '',
      cycleManager: '',
      cycleManagerPhone: '',
      cycleId: '',
      cc: '',
      stages : []
    }
    public roomStage = {   // db table declaration
      stage:   '',
      reqVoc:  '',
      reqCo2:  '',
      reqTemp: '',
      reqHumidity: '', 
      minTime: '',
      maxTime: '',
      id:''
    }  
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
    rooms:''
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
    
    this.roomStage = {
      stage:   '',
      reqVoc:  '',
      reqCo2:  '',
      reqTemp: '',
      reqHumidity: '', 
      minTime: '',
      maxTime: '',
      id:''  
    }

    this.roomCycle = {
    sFacility: '',
    sRoom:'',
    currentStage: '',
    processName: '',
    numberStages: '',
    startTime: '',
    minEndTime: '',
    maxEndTime: '',
    cycleManager: '',
    cycleManagerPhone: '',
    cycleId: '',
    cc: '',
    stages : []
  }
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
      rooms:''
    }
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
  clearCycleListForm() {
    this.roomCycle = {
      sFacility: '',
      sRoom:'',
      currentStage: '',
      processName: '',
      numberStages: '',
      startTime: '',
      minEndTime: '',
      maxEndTime: '',
      cycleManager: '',
      cycleManagerPhone: '',
      cycleId: '',
      cc: '',
      stages : []
    }

    this.roomStage = {
      stage:   '',
      reqVoc:  '',
      reqCo2:  '',
      reqTemp: '',
      reqHumidity: '', 
      minTime: '',
      maxTime: '',
      id:''  
    }

  }  
  
  clearFacilitiesForm() {
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
      rooms:''
    }
  }

  saveStage() {
    console.log('saveStage: ',this.roomStages)
    this.apiService.get('/sS/'+ this.facilityId + '/'+ this.roomId + '/'+ [this.cycleId-100] + '/' + [this.stageId-100] + '/' 
    + this.roomStages[this.stageId -100].reqTemp+ '/' + this.roomStages[this.stageId -100].reqHumidity+ '/' 
    + this.roomStages[this.stageId -100].reqVoc + '/' + this.roomStages[this.stageId -100].reqCo2+ '/' 
    + this.roomStages[this.stageId -100].minTime + '/' + this.roomStages[this.stageId -100].maxTime).subscribe(res => {        
      //console.log(res)
    })
  }

  loadFacilities() {
    this.clearFacilitiesForm();
    let these = this;
    setTimeout(function () {
    these.apiService.getTextFile('facilityList').subscribe(res => {
      //console.log(res)
      these.facilities = res.data;
      console.log('these.facilities',these.facilities)
      console.log('these.facilityID' ,these.facilityId)
      
      these.facilityName = these.facilities[these.facilityId-1].name;
      console.log(these.facilityName)
      
    })
  }, 20);
  }

  loadManagers() {
    this.apiService.getTextFile('managersList').subscribe(res => {
      //console.log(res)
      this.managers = res.data;
      console.log('managers.length ',this.managers.length)
      console.log(this.managers)
      //this.loadManager(); 
    })
  }

  loadAllCycles(cycleID,stageID) {
    this.clearCycleListForm();      
    let these = this;
    let roomStages = new Array(these.roomStage);
    
    setTimeout(function () {
      these.apiService.getTextFile('cyclesList').subscribe(res => {
      // console.log(res)
      // these.allCycles = res.data;
      // console.log('these.allCycles ',these.allCycles)
      these.allCycles = res.data;                             //for display I think
      this.allCycles = res.data;
      console.log('this.allCycles length ',this.allCycles.length)
      console.log('this.allCycles ',this.allCycles)
        
      for (let i = 0; i < this.allCycles.length; i++) {
        // console.log(cycleID)
        // console.log(these.allCycles[i].cycleID)
        if (this.allCycles[i].cycleID == cycleID) {
          these.roomCycle = this.allCycles[i];
          break;
        }
      }
      these.roomName = 'Room ' + [these.roomCycle.sRoom];
      console.log('these.roomName',these.roomName);
      console.log('these.roomCycle',these.roomCycle);
      console.log('roomCycle number of stages ',these.roomCycle.numberStages);
      console.log('these.roomCycle stages length ',these.roomCycle.stages.length)
      console.log('these.roomCycle stages ',these.roomCycle.stages)
      
      these.roomStage = these.roomCycle.stages[0];
      console.log('this.roomStage ',these.roomStage)
      

// we have to load stages[];
 
//      let roomStages = new Array(these.roomStage);

      for (let i = 0; i < these.roomCycle.stages.length; i++) {
        roomStages[i] = these.roomCycle.stages[i];
      }

      these.roomStages = roomStages;
    //  console.log('roomStages ',roomStages)
      console.log('these.roomStages ',these.roomStages)

    })
  
  }, 20)
}



}
