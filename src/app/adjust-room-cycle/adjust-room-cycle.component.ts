import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service/api-service.service'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component'

@Component({
  selector: 'app-adjust-room-cycle',
  templateUrl: './adjust-room-cycle.component.html',
  styleUrls: ['./adjust-room-cycle.component.css']
})
export class AdjustRoomCycleComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public apiService : ApiService) { }
    public selectThisManager;
    public selectThisCycle;

  ngOnInit() {
    let sub = this.route.params.subscribe(params => {this.selectThisCycle = params['cycleId'],this.selectThisManager = params['managerId'];});
    console.log('init adjust-room-cycle selectCycle, selectManager',this.selectThisCycle,this.selectThisManager);    
    this.managerTableLoaded = false;
    this.cycleTableLoaded = false;
    this.loadFacilities();
    this.loadManagers();
    this.loadAllCycles();
  }
  
  public allCycles = [];  // table of allCycles of db type roomCycle
  //public stages    = [];  // table of stages    of db type roomStage

  public roomCycle = {
    sFacility: '',
    sRoom:'',
    currentStage: '',
    processName: '',
    numberStages: '',
    startTime: '',
    minEndTime: '',
    maxEndTime: '',
    cycleManager: '',
    cycleManagerId: '',
    cycleManagerPhone: '',
    cycleId: '',
    cc: '',
    stages : []
  }

  public roomStage = {
    reqVoc: '',
    reqCo2: '',
    reqTemp: '',
    reqHumidity: '', 
    minTime: '',
    maxTime: '',
    id:''  
  }
  
  public editCycle(cycleID,numberStages,sFacility,cycleManagerID,process){
    console.log('adjust-room-cycle: editCycle:- cycleID,numberStages,sFacility,cycleManagerID,process',cycleID,numberStages,sFacility,cycleManagerID,process);
  };

  clearForm() {
    this.roomStage = {
      reqVoc: '',
      reqCo2: '',
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
      cycleManagerId: '',
      cycleManagerPhone: '',
      cycleId: '',
      cc: '',
      stages : []
    }
  }
  
  public facilities = [];
  public rooms = [];
  
  public facilityId;
  public roomId;
  public stageId;


  public managerId;
  public cycleId;
  public roomNumStages;
  
  public managers   = [];
//  public roomStages = [];  // table of stages      of db type roomStage
  
    public facilityName;
    public roomName;
    public managerName;
    public managerPhone;
    public managerID;

  public currentStage;
  public numberStages;
  public stageMinTime;
  public stageMaxTime;
  public managerTableLoaded;
  public cycleTableLoaded;

  loadManagers() {
    this.apiService.getTextFile('managersList').subscribe(res => {
      //console.log(res)
      this.managers = res.data;
      console.log('managers.length ',this.managers.length    )
      console.log('managers',this.managers)
      // if(this.selectThisManager){
      //   console.log('select this manager',this.selectThisManager)
      //   console.log('manager.name',this.managers[this.selectThisManager -1].name)
      //   this.managerTableLoaded = true;
      //   if(this.cycleTableLoaded){
      //     console.log('cycleTable is already loaded')
      //     console.log('manager.name',this.managers[this.selectThisManager -1].name)
      //     this.allCycles[this.selectThisCycle-100].cycleManagerId = [this.selectThisManager - 1];
      //     this.allCycles[this.selectThisCycle-100].cycleManager = this.managers[this.selectThisManager-1].name;
      //     this.allCycles[this.selectThisCycle-100].cycleManagerPhone = this.managers[this.selectThisManager-1].phone;
      //     console.log('cycleManagerId',[this.selectThisManager -1],this.allCycles[this.selectThisCycle-100].cycleManagerId)
      //   }else{
      //     console.log('cycleTable is not loaded')   
      //     //console.log('cycleManagerId',[this.selectThisManager -1],this.allCycles[this.selectThisCycle-100].cycleManagerId)
          
      //   }
      // }
    })
  }
  loadAllCycles() {
    let these = this;
    setTimeout(function () {
        these.apiService.getTextFile('cyclesList').subscribe(res => {
          //console.log(res)
      these.allCycles = res.data;
      console.log('allCycles ',these.allCycles)
      console.log('managers ',these.managers)
      
    //   //console.log('these.managers[this.selectThisManager].name;',these.managers[0].name;)
    //   if(this.selectThisManager){      
    //     these.cycleTableLoaded = true;
    //     if(these.managerTableLoaded){
    //       console.log('managerTable is already loaded')
    //       console.log('manager.name',this.managers[this.selectThisManager -1].name)
    //       this.allCycles[this.selectThisCycle-100].cycleManagerId = [this.selectThisManager - 1];
    //       this.allCycles[this.selectThisCycle-100].cycleManager = this.managers[this.selectThisManager-1].name;
    //       this.allCycles[this.selectThisCycle-100].cycleManagerPhone = this.managers[this.selectThisManager-1].phone;
    //       console.log('cycleManagerId',[this.selectThisManager -1],this.allCycles[this.selectThisCycle-100].cycleManagerId)
    //     }else{
    //       console.log('managerTable is not loaded')   
    //       //console.log('cycleManagerId',[this.selectThisManager -1],this.allCycles[this.selectThisCycle-100].cycleManagerId)
          
    //     }
    // }
    })
  }, 20);
  }


  waitLoadRoomCycle(){
    console.log('wait load room cycle');    
    this.loadRoom_n_ShowAllCycles();
    // this.loadFacilities();
  };


  // request room to upload its cycle ( this can take 10 seconds)
  // and display the current cycle table. ( shows the current tables, not the new one which could be 10 seconds away)
  loadRoom_n_ShowAllCycles(){
    console.log('\n\nRequest Load Room and show current Cycles');
    let that = this;
    setTimeout(function () {
    that.apiService.get('/loadRoom_n_ShowAllCycles/' + that.facilityId + '/' + that.roomId).subscribe(res => {// editing server.cpp line 1194  if (uri == "loadRoom_n_ShowAllCycles")
    that.loadAllCycles();
    // console.log('res ',res);
    // let str = res.text();
    // console.log('str ',str);
    // let json = JSON.parse(str);
    // that.allCycles = json.data;

    // console.log('json ',json);
    // console.log('json.data ',json.data);
    // console.log('allCycles ',that.allCycles);
  })
  }, 20);
  }



  loadFacilities() {
    let these = this;
    setTimeout(function () {
    these.apiService.getTextFile('facilityList').subscribe(res => {
      //console.log(res)
      these.facilities = res.data;
      console.log(these.facilities)
    })
  }, 20);
  }

  loadRooms() {
    let that = this;
    setTimeout(function () {
      console.log('Loading rooms for facility ' + that.facilityId)
      that.apiService.getRooms(that.facilityId).subscribe(res => {
        //console.log(res)
        that.rooms = res.data;
        console.log(that.rooms)
      })
    }, 20);
  }
  // editFacility(facility) {
  //   console.log(facility)
  // }
 }
  
  