import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service/api-service.service'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
//import { EditRoomStagesComponent } from '../edit-room-stages/edit-room-stages.component';
//import { AdjustRoomCycleComponent } from '../adjust-room-cycle/adjust-room-cycle.component';
import { NavbarComponent } from '../navbar/navbar.component'

@Component({
  selector: 'app-edit-room-stages',
  templateUrl: './edit-room-stages.component.html',
  styleUrls: ['./edit-room-stages.component.css']
})
export class EditRoomStagesComponent implements OnInit {
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public apiService : ApiService) { }
  

    public allCycles  = [];  // table of allCycles   of db type roomCycle
    //public lastAllCycles  = [];  // table of allCycles   of db type roomCycle
    //public stages    = [];  // table of stages    of db type roomStage
    
  public stageId;
  public facilityId;
  public roomId;
  public managerId;
  public cycleId;
  public roomNumStages;
  public cycleManagerId;
  public firstTimeStamp;
  public lastTimeStamp;
  public displayTimeStamp;
  public today;
  public todaysTime;
  public todaysShortTime;  

  public rooms      = [];
  public managers   = [];
  public facilities = [];  // table of facilities of db type facility 
  public roomStages = [];  // table of stages      of db type roomStage
    //public roomStages = new Array(this.roomStage);

  public facilityName;
  public roomName;
  public managerName;
  public managerPhone;
  public managerID;
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
    process: '',
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
    process: '',
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

  public stageNumber;
  public process;

  ngOnInit() {
    let sub = this.route.params.subscribe(params => {this.cycleId = params['id'],this.roomNumStages = params['numberStages'],this.facilityId = params['facilityid'],this.managerID = params['managerID'],this.process = params['process'];});

    console.log('init edit-room-stages: cycleId =',this.cycleId)
    console.log('init edit-room-stages: roomNumStages =',this.roomNumStages)
    console.log('init edit-room-stages: managerID =',this.managerID)
    console.log('init edit-room-stages: this.roomCycle.processName =',this.roomCycle.processName)
    console.log('init edit-room-stages: process =',this.process)
    
    this.loadFacilities();
    this.loadManagers();
    //this.loadAllCycles();
    this.loadAllCycles(this.cycleId);

  }

  // saveStage() {
  //   console.log(this.roomStages)
  //   this.apiService.get('/sS/'+ this.facilityId + '/'+ this.roomId + '/'+ [this.cycleId-100] + '/' + [this.stageId-100] + '/' + this.roomStages[this.stageId -100].reqTemp+ '/' + this.roomStages[this.stageId -100].reqCo2 + '/' + this.roomStages[this.stageId -100].reqVoc+ '/' + this.roomStages[this.stageId -100].reqHumidity+ '/' + this.roomStages[this.stageId -100].minTime + '/' + this.roomStages[this.stageId -100].maxTime).subscribe(res => {        
  //     console.log(res)
  //   })
  // }
  public insertRoomStage(cycleID,numberStages,sFacility,insertHere){

    console.log('insertRoomStage workn to insert stages ',insertHere );
    console.log('Room ',this.roomCycle.sRoom);
    console.log('cycleID  numberStages sFacility ',cycleID,numberStages,sFacility);

    this.apiService.get('/iS/'+ sFacility + '/'+ this.roomCycle.sRoom + '/'+ [cycleID-99] + '/'+ [insertHere-99]).subscribe(res => {        
    })
  
  
  };
 
  public deleteRoomStage(cycleID,numberStages,sFacility,deleteHere){
    //console.log('deleteRoomStage workn to delete stage ',stageNumber);
    console.log('Room ',this.roomCycle.sRoom);
    console.log('cycleID  numberStages sFacility ',cycleID,numberStages,sFacility);

    this.apiService.get('/dS/'+ sFacility + '/'+ this.roomCycle.sRoom + '/'+ [cycleID-99] + '/'+ [deleteHere-99]).subscribe(res => {        
    })
  
  };
 
  //"saveProcessName(roomCycle.sFacility,roomCycle.sRoom,roomCycle.cycleID,roomCycle.process)"

  public saveStartTime(roomCycle){
    console.log('Saving the start time');
    console.log('Facility,Room,cycleID,startTime',roomCycle.sFacility,roomCycle.sRoom,roomCycle.cycleID,roomCycle.processName,roomCycle.startTime);
    this.apiService.get('/saveStartTime/'  + roomCycle.sFacility + '/' + roomCycle.sRoom + '/'+ roomCycle.cycleID +  '/'+ roomCycle.startTime ).subscribe(res => {        
    })
  }
  public saveProcessName(Facility,Room,cycleID,process){
    console.log('Saving the process name');
    console.log('Facility,Room,cycleID,process',Facility,Room,cycleID,process);
    this.apiService.get('/saveProcessName/'  + Facility + '/' + Room + '/'+ cycleID +  '/'+ process ).subscribe(res => {        
    })
  }
    
public saveCycleManager(managerID){
  console.log('Room ',this.roomCycle.sRoom);
  console.log('this.cycleId ',this.cycleId);
  console.log('managerID ',managerID);
  console.log('this.facilityId ',this.facilityId);
//    console.log(this.managers)
  console.log(this.managers[managerID-1].name)
//    console.log(this.roomCycle)
  this.roomCycle.cycleManager = this.managers[managerID-1].name;
  this.roomCycle.cycleManagerPhone = this.managers[managerID-1].phone;
  this.apiService.get('/saveCycleManager/'  + this.facilityId + '/' + this.roomCycle.sRoom + '/'+ [this.cycleId - 99] +  '/'+ managerID ).subscribe(res => {        
  })
}


  loadManagers() {
    this.apiService.getTextFile('managersList').subscribe(res => {
      //console.log(res)
      this.managers = res.data;
      console.log('managers.length ',this.managers.length    )
      console.log(this.managers)
      //this.loadManager(); 
    })
  }
  
  loadManager() {
    for (let i = 0; i < this.managers.length; i++) {
      console.log(this.managers[i].id)
      console.log(this.managerId)
      if (this.managers[i].id == this.managerId) {
        this.manager = this.managers[i];
        break;
      }
    }
    console.log(this.manager)
  }

  public editCycle(cycleID,numberStages,sFacility,cycleManagerID,process){
    console.log('edit-room-stages: editCyle:- cycleID,numberStages,sFacility,cycleManagerID,process',cycleID,numberStages,sFacility,cycleManagerID,process);
  };

  DisplayTime(displayTime){
    
    
    //let today = '';
    //let todaysTime = '';
    
  
    //console.log('Display Time', this.displayTimeStamp );

      let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      let monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      var daysOfMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];


      let FirstTime = '';
      var timeStampRemainingTime = displayTime;

      //console.log('timeStampRemainingTime',timeStampRemainingTime);

      var YearsSince2010 = Math.floor(timeStampRemainingTime / (365.25 * 24 * 60 * 60)); //each year needs a quarter day to match the earths spin speed.
      //console.log('YearsSince2010',YearsSince2010);
      
      // accouning for all the leaps years since 2010
      var leapYearsSince2010 = Math.floor((YearsSince2010 + 2) / 4); //2008 = zeroth leap year relative to year 2010 // leaps every 4 years except not in the year 3000. // I dont think this code will be runnning then...
      let thisIsaLeapYear = false;
      //console.log('leapYearsSince2010',leapYearsSince2010);
      
      var Year = YearsSince2010 + 2010;
      timeStampRemainingTime -= YearsSince2010 * (365 * 24 * 60 * 60);

      if (Math.floor (Year % 4) > 0) thisIsaLeapYear = false;
      else {
        thisIsaLeapYear = true;
      
        // check here if the date is < march    // before march the leap day did not occur yet
    
        if ( timeStampRemainingTime < ( 31+29)*24*60*60)    // Jan 31, Feb 29, March 1st
          leapYearsSince2010 -= 1;   

      }
      //console.log('Year',Year);
      //console.log('leapYearsSince2010',leapYearsSince2010);
      //console.log('timeStampRemainingTime',timeStampRemainingTime);
      

      //console.log('YearsSince2010, thisIsaLeapYear, leapYearsSince2010',YearsSince2010, thisIsaLeapYear , leapYearsSince2010);

      // before 29th Feb on a leap year deduct the extra day for this leap year, since it hasn't happened yet, but we already added it above
      timeStampRemainingTime -= leapYearsSince2010 * 24 * 60 * 60; // leap days are 24hours long.
      //console.log('timeStampRemainingTime',timeStampRemainingTime);
      
      var Doy = Math.floor(timeStampRemainingTime / (24 * 60 * 60));
      
      timeStampRemainingTime -= Doy * (24 * 60 * 60);
      //console.log('timeStampRemainingTime Doy',timeStampRemainingTime,Doy);
      
      //if (timeStampRemainingTime > (1 * 24 * 60 * 60))
      //console.log( "Remaining Time is greater than one day of seconds\n\r" + timeStampRemainingTime);

      var Hour = Math.floor(timeStampRemainingTime / (60 * 60));
      timeStampRemainingTime -= Hour * (60 * 60);
      //console.log('timeStampRemainingTime Hour',timeStampRemainingTime,Hour);
      
      var Minute = Math.floor(timeStampRemainingTime / 60);
      timeStampRemainingTime -= Minute * 60;
      //console.log('timeStampRemainingTime Minute',timeStampRemainingTime,Minute);
      
      var Seconds = Math.floor(timeStampRemainingTime);
      //console.log('Hour Minute Second',Hour,Minute,Seconds);
      
      //deduct months of days
      var timeStampRemainingDays = Doy;
      var Month;
      var DayOfMonth;
      for (var i = 0; i < 12; i++) {
        if (timeStampRemainingDays > daysOfMonths[i])   // more days than this month of days
        {
          timeStampRemainingDays -= daysOfMonths[i];
          if ((i == 1) && thisIsaLeapYear)            // february       //&& (UTC_Year == (UTC_Year / 4) * 4))    // leap year detection
            timeStampRemainingDays -=  1;
        }
        else  // exit we have the date within the month.
        {
          Month = i + 1;      // zeroth element is January, the first month
          i = 12; //terminate loop
        }
      }

      DayOfMonth = timeStampRemainingDays;
      //console.log('timeStampRemainingTime DayOfMonth',timeStampRemainingTime,DayOfMonth);
      
      var DaysSince2010 = displayTime / 60 / 60 / 24;
      //console.log('timeStampRemainingTime DaysSince2010',timeStampRemainingTime,DaysSince2010);
      
      var DayOfWeek = Math.floor(DaysSince2010 + 5 - 1 ) % 7;   // 1st Jan 2010 was on a Friday :) =>  DOW = 6 ; sunday being 7th day of the week = 0th element, friday 1st Jan 2010 is the 5th day of week
      //let todaysTime = '';
      //console.log('timeStampRemainingTime DayOfWeek',timeStampRemainingTime,DayOfWeek);
      
      var timeStringLength = 0;
      
      var displayHour = Hour;
      //console.log('Day of Week, DaysSince2010, this.displayTimeStamp, timeStampRemainingDays, displayHour',DayOfWeek,DaysSince2010, this.displayTimeStamp, timeStampRemainingDays,displayHour);
      //console.log('Day of Week, Day of Month, Month, Year, displayHour',DayOfWeek,DayOfMonth, Month, Year,displayHour);
      
      if (displayHour > 12) displayHour -= 12;
      if (displayHour == 0) displayHour = 12;

      let string1=':';
      let string2=':';
      let string3='am ';
      
      if (Hour > 11)
      string3='pm ';
      
      if (Minute <10)
      string1=':0';
      
      if (Seconds < 10)
      string2=':0';
      
      this.todaysShortTime = displayHour + string1 + Minute;
      this.todaysTime = displayHour + string1 + Minute + string2 + Seconds + string3;
      this.today = daysOfWeek[DayOfWeek] + ' ' + DayOfMonth;
      
      // console.log("shortTime",this.todaysShortTime);
      // console.log("todaysTime",this.todaysTime);
      // console.log("today",this.today);
      // console.log("DayOfWeek",DayOfWeek);
      // console.log("daysOfWeek[DayOfWeek]",daysOfWeek[DayOfWeek]);
      // console.log("DayOfMonth",DayOfMonth);
      




        //timeStringLength += sprintf(todaysTime + timeStringLength, " %s ", daysOfWeek[UTC_DayOfWeek].data());
      if ((DayOfMonth == 1) || (DayOfMonth == 21) || (DayOfMonth == 31))
      this.today += "st ";
      else
          if ((DayOfMonth == 2) || (DayOfMonth == 22))
          this.today += "nd ";
          else
              if ((DayOfMonth == 3) || (DayOfMonth == 23))
              this.today += "rd ";
              else
              this.today += "th ";
      
              this.today += monthsOfYear[Month-1] + ' ' + Year;
                    
      //console.log('Time Stamped:', this.todaysTime + this.today);
     // console.log('Day of Week, Day of Month, Month, Year, displayHour',DayOfWeek,DayOfMonth, Month, Year,displayHour);

  }

  postRoomCycle(){// sending a binary buffer to the server
    console.log('\n\nPost Room Cycles',this.roomCycle); 

    var data = new ArrayBuffer(512);
    var uint8View = new Uint8Array(data);
    
    // this doesn't seem to do anything as Uint8Array only contains 8 bit values , so all values are already in range 0-255
    for (var i=0; i< uint8View.length; i++) {
      uint8View[i] = i % 255;
    }
    // see line 1060 in server.cpp if (uri == "/postRoomCycle/") { // receiving a binary buffer
    
    // calc current time
    var TimeStamp = 0x0e000001;
    this.DisplayTime(TimeStamp)

     console.log('Time Stamped:', this.todaysTime + this.today);
//     console.log('Day of Week, Day of Month, Month, Year, displayHour',DayOfWeek,DayOfMonth, Month, Year,displayHour);

    
    //var data = []; 
    var position = 0;
    uint8View[position++] = Number(this.roomCycle.sFacility);
    uint8View[position++] = Number(this.roomCycle.sRoom);
    uint8View[position++] = Number(this.roomCycle.cycleId);
    var adjustNumberStagesPosition = position;
    uint8View[position++] = Number(this.roomCycle.numberStages);
    uint8View[position++] = Number(this.managerId);

    for(var i =0;i<this.roomCycle.processName.length;i++){
      uint8View[position++] = Number(this.roomCycle.processName.charCodeAt(i));
    } uint8View[position++] = 0; // null terminator


    for(var i =0;i<this.roomCycle.startTime.length;i++){
      uint8View[position++] = Number(this.roomCycle.startTime.charCodeAt(i));
    } uint8View[position++] = 0; // null terminator


    for(var i =0;i<this.roomCycle.cycleManager.length;i++){
      uint8View[position++] = Number(this.roomCycle.cycleManager.charCodeAt(i));
    } uint8View[position++] = 0; // null terminator


    for(var i =0;i<this.roomCycle.cycleManagerPhone.length;i++){
      uint8View[position++] = Number(this.roomCycle.cycleManagerPhone.charCodeAt(i));
    } uint8View[position++] = 0; // null terminator

    var deductNumberStages = 0;
    for(var j =0;j<Number(this.roomCycle.numberStages);j++){

      if(this.roomCycle.stages[j].reqTemp + this.roomCycle.stages[j].reqHumidity+ this.roomCycle.stages[j].reqVoc + this.roomCycle.stages[j].reqCo2 + this.roomCycle.stages[j].minTime +this.roomCycle.stages[j].maxTime)
      {

          var ReqTemp = this.roomCycle.stages[j].reqTemp *100;
          uint8View[position++] = ReqTemp/256;
          uint8View[position++] = ReqTemp%256;

          var ReqHumidity = this.roomCycle.stages[j].reqHumidity *100;
          uint8View[position++] = ReqHumidity/256;
          uint8View[position++] = ReqHumidity%256;

          var ReqVoc = this.roomCycle.stages[j].reqVoc *100;
          uint8View[position++] = ReqVoc/256;
          uint8View[position++] = ReqVoc%256;

          var ReqCo2 = this.roomCycle.stages[j].reqCo2 *100;
          uint8View[position++] = ReqCo2/256;
          uint8View[position++] = ReqCo2%256;

          var MinTime = this.roomCycle.stages[j].minTime /1;
          uint8View[position++] = MinTime/256;
          uint8View[position++] = MinTime%256;
          
          var MaxTime = this.roomCycle.stages[j].maxTime /1;
          uint8View[position++] = MaxTime/256;
          uint8View[position++] = MaxTime%256;
      }else deductNumberStages ++;
 
    }

    uint8View[adjustNumberStagesPosition]=Number(this.roomCycle.numberStages)-deductNumberStages;

console.log('data',data);
// server.cpp postRoomCycle line 643 
    this.apiService.postbinary('/postRoomCycle/' , data).subscribe(res => {// editing server.cpp line 1194  if (uri == "loadRoom_n_ShowAllCycles")

    //that.loadAllCycles(); 
    // console.log('res ',res);
    // let str = res.text();
    // console.log('str ',str);
    // let json = JSON.parse(str);
    // that.allCycles = json.data;

    // console.log('json ',json);
    // console.log('json.data ',json.data);
    // console.log('allCycles ',that.allCycles);
  })
 
  }





  public saveRoomCycle(myRoomCycle){
    console.log('edit-room-stages: saving Room Cycle Now - but actually does nothing..\n :( ToDo');  
    // here we should check if the manager has been changed.. or just send it up

    console.log('this.roomCycle ',this.roomCycle);
    console.log('myRoomCycle ',myRoomCycle);


    //post myRoomCycle.
    this.postRoomCycle();
    
    //console.log('this.lastAllCycles',this.lastAllCycles)
    
    
    //postBinaryFile
/*
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

  loadManagers() {
    this.apiService.getTextFile('managersList').subscribe(res => {
      //console.log(res)
      this.managers = res.data;
      console.log('managers.length ',this.managers.length    )
      console.log(this.managers)
      //this.loadManager(); 
    })
  }

  post(url, data) {
    return this.http.post(this.baseURL + url, data);
  }
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
    process: '',
    cc: '',
    stages : []
  }
  
  */ 


    //console.log('cycleID  numberStages sFacility ',cycleID,numberStages,sFacility);
      
          // this.apiService.get('/ss/'+ sFacility + '/'+ this.roomCycle.sRoom + '/'+ [cycleID-99] ).subscribe(res => {        
          // })
  }

  
  loadAllCycles(cycleID) {
    let these = this;
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
      these.managerName = 'Manager: ' , these.roomCycle.cycleManager;
      these.managerPhone = 'Phone:  ' , these.roomCycle.cycleManagerPhone;
      
      console.log('these.roomName',these.roomName);
      console.log('these.roomCycle',these.roomCycle);
      console.log('roomCycle number of stages ',these.roomCycle.numberStages);
      console.log('these.roomCycle stages length ',these.roomCycle.stages.length)
      console.log('these.roomCycle stages ',these.roomCycle.stages)
      
      
      these.roomStage = these.roomCycle.stages[0];
      console.log('this.roomStage ',these.roomStage)
      


      let roomStages = new Array(these.roomStage);

      for (let i = 0; i < these.roomCycle.stages.length; i++) {
        roomStages[i] = these.roomCycle.stages[i];
      }

      these.roomStages = roomStages;
    //  console.log('roomStages ',roomStages)
      console.log('this.roomStages ',these.roomStages)
//      these.lastAllCycles = these.allCycles;
      //console.log('this.roomStages ',this.roomStages) // not loaded yet  
  
  //    console.log('this.lastAllCycles',this.lastAllCycles);
    //  console.log('these.lastAllCycles',these.lastAllCycles);
      
    })
  
  }, 20)
}


  loadFacilities() {
    let these = this;
    setTimeout(function () {
    these.apiService.getTextFile('facilityList').subscribe(res => {
      //console.log(res)
      these.facilities = res.data;
      console.log('these.facilities',these.facilities)
      console.log('facilityId',these.facilityId)
      
      these.facilityName = these.facilities[these.facilityId-1].name;
      console.log(these.facilityName)

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
}
