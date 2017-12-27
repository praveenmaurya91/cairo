import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ApiService } from '../api-service/api-service.service'
import { BaseChartDirective } from 'ng2-charts';
import * as THREE from 'THREE';
import 'rxjs/add/operator/map';

@Component({
  selector: 'view-facility',
  templateUrl: './view-facility.component.html',
  styleUrls: ['./view-facility.component.css']
})
export class ViewFacilityComponent implements OnInit {

  constructor(
    public apiService: ApiService
  ) { }

  @ViewChild('graphCanvas') canvasRef: ElementRef;
  @ViewChild('buttonCanvas') buttonCanvas: ElementRef;
  @ViewChild(BaseChartDirective) private _chart;
  // @ViewChild('baseChart') _chart;


  public O2Color             = 'rgba(187,187,187,1)'; //Dark grey
  public dimO2Color          = 'rgba(100,100,100,1)';
  public CO2Color            = 'rgba(0,255,255,1)';   //Cyan
  public dimCO2Color         = 'rgba(0,128,128,1)';
  public humidityColor       = 'rgba(0,255,0,1)';   // Green
  public dimhumidityColor    = 'rgba(0,128,0,1)';
  public temperatureColor    = 'rgba(255,255,0,1)'; // yellow
  public dimtemperatureColor = 'rgba(128,128,0,1)';
  public VOCColor            = 'rgba(255,255,255,1)';   // white
  public dimVOCColor         = 'rgba(128,128,128,1)';  // half white
  public RedColor            = 'rgba(255,0,0,1)';     // Red
  public transparent         = 'rgba(0,0,0,0)';
  public gridLineColor       = 'rgb(90,90,0)';

  public camera;
  public scene;
  public renderer;
  public geometry;
  public material;
  public mesh;

  public totalMax = 0;
  public maxOfArrays = [];
  public stepSize;
  public axisMaxs = [];
  public data = {};
  public width = 800;

  public lineChartOptions: any = {}

  public facilities = []
  public rooms = [];
  public facilityId;
  public roomId;
  public firstTimeStamp;
  public lastTimeStamp;
  public displayTimeStamp;

  public today;
  public todaysTime;
  public todaysShortTime;
  
  public buttonCount = 1;
  
  ngOnInit() {
    this.loadFacilities();
    //this.load3d();
    this.getMaxY();
    this.getStepSize();
    this.lineChartOptions = {
      responsive: true,
      animation: false,
      events: ['click', 'hover', 'mousemove', 'mouseout'],
      onClick: function (e) {
        console.log('CLICKED')
      },
      tooltip: {
        custom: function (e) {
          console.log('lineChartOptions tooltip')
        }
      },
      legend: {
        onHover: function (e) {
          console.log('lineChartOptions HOVERED over Legend')
        },
        
        labels: {
          fontColor: 'white',
          generateLabels: function (chart) {
            var data = chart.data;
            return data.datasets.length ? data.datasets.map(function (dataset, i) {
              return {
                text: dataset.label,
                fillStyle: dataset.backgroundFillColor,
                hidden: !chart.isDatasetVisible(i),
                lineCap: dataset.borderCapStyle,
                lineDash: dataset.borderDash,
                lineDashOffset: dataset.borderDashOffset,
                lineJoin: dataset.borderJoinStyle,
                lineWidth: '2',
                strokeStyle: dataset.borderColor,
                // Below is extra data used for toggling the datasets //                fillStyle: dataset.backgroundColor,

                datasetIndex: i
              };
            }, this) : [];
          }
        }
      },
      scales: {
        yAxes: [

          {
            gridLines: {
              display: true,
              drawBorder: false,
            },
            id: 'o2-y-axis',
            type: 'linear',
            position: 'left',
            ticks: {
              stepSize: this.getAxisStepSize('o2-y-axis'),
              beginAtZero: true,
              max: this.getAxisMax('o2-y-axis'),
              fontColor: this.O2Color,
              min: this.getAxisMin('o2-y-axis'),
            }
          },
          {
            gridLines: {
              display: true,
              drawBorder: false,
            },
            id: 'voc-y-axis',
            type: 'linear',
            position: 'left',
            ticks: {
              stepSize: this.getAxisStepSize('voc-y-axis'),
              max: this.getAxisMax('voc-y-axis'),
              min: this.getAxisMin('voc-y-axis'),
              fontColor: this.VOCColor,
              beginAtZero: true
            }
          },
          {
            gridLines: {
              display: true,
              drawBorder: false,
              offsetGridLines: true,
            },
            id: 'co2-y-axis',
            type: 'linear',
            position: 'left',
            ticks: {
              stepSize: this.getAxisStepSize('co2-y-axis'),
              beginAtZero: true,
              max: this.getAxisMax('co2-y-axis'),
              min: this.getAxisMin('co2-y-axis'),
              fontColor: this.CO2Color,
            }
          },
          {
            gridLines: {
              display: true,
              drawBorder: false,
              color: this.gridLineColor,
            },
            id: 'temperature-y-axis',
            type: 'linear',
            position: 'right',
            ticks: {
              stepSize: this.getAxisStepSize('temperature-y-axis'),
              max: this.getAxisMax('temperature-y-axis'),
              min: this.getAxisMin('temperature-y-axis'),
              fontColor: this.temperatureColor,
              beginAtZero: true
            }
          },
          {
            gridLines: {
              display: true,
              drawBorder: false,
            },
            id: 'humidity-y-axis',
            type: 'linear',
            position: 'right',
            ticks: {
              stepSize: this.getAxisStepSize('humidity-y-axis'),
              max: this.getAxisMax('humidity-y-axis'),
              min: this.getAxisMin('humidity-y-axis'),
              fontColor: this.humidityColor,
              beginAtZero: true
            }
          },
        ]
      },
      ticks: {
        max: this.totalMax
      },
      scaleStepWidth: 50
    }

    this.readBinFile();

  }
  
  loadFacilities() {
    this.apiService.getTextFile('facilityList').subscribe(res => {
      console.log(res)
      this.facilities = res.data;
      console.log(this.facilities)
    })
  }

  loadRooms() {
    let that = this;
    setTimeout(function () {
      console.log('Loading Online rooms for ' + that.facilityId)
      that.apiService.getRooms(that.facilityId).subscribe(res => {
        console.log(res)
        that.rooms = res.data;
        console.log(that.rooms)
      })
    }, 20);
  }  
  loadAllRooms() {
    let that = this;
    setTimeout(function () {
      console.log('Loading All rooms for ' + that.facilityId)
      that.apiService.getAllRooms(that.facilityId).subscribe(res => {
        console.log(res)
        that.rooms = res.data;
        console.log(that.rooms)
      })
    }, 20);
  }


  DisplayTime(){
    
    var displayTimeStamp;
    //let today = '';
    //let todaysTime = '';
    
  
    //console.log('Display Time', this.displayTimeStamp );

      let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      let monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      var daysOfMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];


      let FirstTime = '';
      var timeStampRemainingTime = this.displayTimeStamp;

      var YearsSince2010 = Math.floor(timeStampRemainingTime / (365.25 * 24 * 60 * 60)); //each year needs a quarter day to match the earths spin speed.

      // accouning for all the leaps years since 2010
      var leapYearsSince2010 = Math.floor((YearsSince2010 + 2) / 4); //2008 = zeroth leap year relative to year 2010 // leaps every 4 years except not in the year 3000. // I dont think this code will be runnning then...
      let thisIsaLeapYear = false;

      var Year = YearsSince2010 + 2010;
      timeStampRemainingTime -= YearsSince2010 * (365 * 24 * 60 * 60);

      if (Math.floor (Year % 4) > 0) thisIsaLeapYear = false;
      else {
        thisIsaLeapYear = true;
      
        // check here if the date is < march    // before march the leap day did not occur yet
    
        if ( timeStampRemainingTime < ( 31+29)*24*60*60)    // Jan 31, Feb 29, March 1st
          leapYearsSince2010 -= 1;   

      }


      //console.log('YearsSince2010, thisIsaLeapYear, leapYearsSince2010',YearsSince2010, thisIsaLeapYear , leapYearsSince2010);

      // before 29th Feb on a leap year deduct the extra day for this leap year, since it hasn't happened yet, but we already added it above
      timeStampRemainingTime -= leapYearsSince2010 * 24 * 60 * 60; // leap days are 24hours long.
      
      var Doy = Math.floor(timeStampRemainingTime / (24 * 60 * 60));
      
      timeStampRemainingTime -= Doy * (24 * 60 * 60);

      //if (timeStampRemainingTime > (1 * 24 * 60 * 60))
      //console.log( "Remaining Time is greater than one day of seconds\n\r" + timeStampRemainingTime);

      var Hour = Math.floor(timeStampRemainingTime / (60 * 60));
      timeStampRemainingTime -= Hour * (60 * 60);

      var Minute = Math.floor(timeStampRemainingTime / 60);
      timeStampRemainingTime -= Minute * 60;

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
      
      var DaysSince2010 = this.displayTimeStamp / 60 / 60 / 24;
      
      var DayOfWeek = Math.floor(DaysSince2010 + 5 - 1 ) % 7;   // 1st Jan 2010 was on a Friday :) =>  DOW = 6 ; sunday being 7th day of the week = 0th element, friday 1st Jan 2010 is the 5th day of week
      //let todaysTime = '';
      var timeStringLength = 0;
      
      var displayHour = Hour;
     // console.log('Day of Week, Day of Month, Month, Year, displayHour',DayOfWeek,DayOfMonth, Month, Year,displayHour);
      
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

  }

  showNextDay() {
    this.buttonCount--;
    if(this.buttonCount < 0)  this.buttonCount = 0;
    console.log('Button 4 Pressed ',this.buttonCount);
    
    this.apiService.get('/pd/' + this.facilityId + '/' + [this.roomId] + '/' +  this.buttonCount  ).subscribe(res => {
      var data = res.text();

      let dataArr = new ArrayBuffer(data.length * 2);
      let dataView = new Uint8Array(dataArr);
      let datasets = [];
      
      console.log('data.length ', data.length);
      for (var i = 0; i < data.length; i++) {
        dataView[i] = data.charCodeAt(i);
      }
      var textPos = 0;     
      var firstTimeStamp = data.charCodeAt(0) + data.charCodeAt(1) * 128 + data.charCodeAt(2) * 128 * 128 + data.charCodeAt(3) * 128 * 128 * 128 + data.charCodeAt(4) * 128 * 128 * 128 * 128;
      var lastTimeStamp = data.charCodeAt(5) + data.charCodeAt(6) * 128 + data.charCodeAt(7) * 128 * 128 + data.charCodeAt(8) * 128 * 128 * 128 + data.charCodeAt(9) * 128 * 128 * 128 * 128;

      textPos += 10;  // move pointer past the time stamps
      
      let FirstTimeStamp = firstTimeStamp.toString(16); // base 16  
      let LastTimeStamp = lastTimeStamp.toString(16);
      
      console.log('FirstTimeStamp', FirstTimeStamp);
      console.log('LastTimeStamp', LastTimeStamp);
      
      this.displayTimeStamp = firstTimeStamp;
      this.DisplayTime();
      console.log('TimeStamp: ',this.todaysTime,this.today);
      
      // now set the first axis time label from  Point 1
      this.lineChartLabels[0] = this.todaysShortTime;



      this.displayTimeStamp = (lastTimeStamp - firstTimeStamp)/2 + firstTimeStamp;
      this.DisplayTime();

      console.log('TimeStamp: ',this.todaysTime,this.today);

      var stepTime = (lastTimeStamp - firstTimeStamp )/1024;
      for(var i = 0;i<1024;i++){
        this.displayTimeStamp = firstTimeStamp + stepTime * i;
        this.DisplayTime();
        this.lineChartLabels[i] =  this.todaysTime;
      }

      
      this.displayTimeStamp = lastTimeStamp;
      this.DisplayTime();
      this.lineChartLabels[1023] = this.todaysShortTime;    

      //console.log('readSingle:');
      //console.log(data, dataView)
      //Get name of column/dataset
      let readSingle = function () {
        let dataSet = {
          name: '',
          maxY: 0,
          minY: 0,
          length: 0,
          label: '',
          data: []
        }
        //console.log('Read single ')
        let colHeader: string = '';
        for (var i = textPos; i < dataView.length; i++) {
          if (dataView[i]) {
            var thisStr = String.fromCharCode(dataView[i])
            colHeader += thisStr;
          } else {
            textPos = i + 1;
            break;
          }
        }

        //Set properties of column/dataset
        dataSet.label = colHeader;
        let maxY = dataView[textPos++] + dataView[textPos++] * 128;
        // console.log('maxY ',maxY)


        dataSet.maxY = maxY / 100;
        if (maxY > 8192) maxY -= 16384;

        let minY = dataView[textPos++] + dataView[textPos++] * 128;
        if (minY > 8192) minY -= 16384;
        dataSet.minY = minY / 100;

        let length = dataView[textPos++] + dataView[textPos++] * 128;
        dataSet.length = length;
        dataSet.name = dataSet.label.toLowerCase() + '-y-axis';
        console.log('maxY minY length:',maxY,minY,length);

        let dataPoints = [];
        for (var i = 0; i < length; i++) {
          var t = (dataView[textPos] + dataView[textPos + 1] * 128) / 100;
          textPos += 2;
          dataPoints.push(t)
        }
        dataSet.data = dataPoints;
        //console.log('dataset ',dataSet)
        datasets.push(dataSet)
        //console.log('show next few bytes ',dataView[textPos-5],dataView[textPos-4],dataView[textPos-3],dataView[textPos-2],dataView[textPos-1],dataView[textPos],dataView[textPos+1],dataView[textPos+2],dataView[textPos+3],dataView[textPos+4],dataView[textPos+5]) 

        var EndOfRecordKey = (dataView[textPos] + dataView[textPos + 1] * 128);   // end of record key
        //console.log('EndOfRecordKey should be 16383 = ',EndOfRecordKey)   // only works for data below 0x80 ??    7bit transfer only  

        if (dataView[textPos + 2]) {  // checking next panel of data , looking for T from Temp
          textPos += 2;               // get past the end of record marker
          readSingle()
        }
      }
      readSingle();

      //console.log(datasets)


      this.updateGraphData(datasets);
    })



  }

  showPreviousDay() {
    console.log('Button 1 Pressed ',this.buttonCount);
    this.buttonCount++;
    this.apiService.get('/pd/' + this.facilityId + '/' + [this.roomId] + '/' +  this.buttonCount  ).subscribe(res => {
      var data = res.text();

      let dataArr = new ArrayBuffer(data.length * 2);
      let dataView = new Uint8Array(dataArr);
      let datasets = [];
      
      console.log('data.length ', data.length);
      for (var i = 0; i < data.length; i++) {
        dataView[i] = data.charCodeAt(i);
      }
      var textPos = 0;     
      var firstTimeStamp = data.charCodeAt(0) + data.charCodeAt(1) * 128 + data.charCodeAt(2) * 128 * 128 + data.charCodeAt(3) * 128 * 128 * 128 + data.charCodeAt(4) * 128 * 128 * 128 * 128;
      var lastTimeStamp = data.charCodeAt(5) + data.charCodeAt(6) * 128 + data.charCodeAt(7) * 128 * 128 + data.charCodeAt(8) * 128 * 128 * 128 + data.charCodeAt(9) * 128 * 128 * 128 * 128;

      textPos += 10;  // move pointer past the time stamps
      
      let FirstTimeStamp = firstTimeStamp.toString(16); // base 16  
      let LastTimeStamp = lastTimeStamp.toString(16);
      
      console.log('FirstTimeStamp', FirstTimeStamp); 
      console.log('LastTimeStamp', LastTimeStamp);
      
      this.displayTimeStamp = firstTimeStamp;
      this.DisplayTime();
      console.log('TimeStamp: ',this.todaysTime,this.today);
      
      // now set the first axis time label from  Point 1
      this.lineChartLabels[0] = this.todaysShortTime;



      this.displayTimeStamp = (lastTimeStamp - firstTimeStamp)/2 + firstTimeStamp;
      this.DisplayTime();

      console.log('TimeStamp: ',this.todaysTime,this.today);

      var stepTime = (lastTimeStamp - firstTimeStamp )/1024;
      for(var i = 0;i<1024;i++){
        this.displayTimeStamp = firstTimeStamp + stepTime * i;
        this.DisplayTime();
        this.lineChartLabels[i] =  this.todaysTime;
      }

      
      this.displayTimeStamp = lastTimeStamp;
      this.DisplayTime();
      this.lineChartLabels[1023] = this.todaysShortTime;    

      //console.log('readSingle:');
      //console.log(data, dataView)
      //Get name of column/dataset
      let readSingle = function () {
        let dataSet = {
          name: '',
          maxY: 0,
          minY: 0,
          length: 0,
          label: '',
          data: []
        }
        //console.log('Read single ')
        let colHeader: string = '';
        for (var i = textPos; i < dataView.length; i++) {
          if (dataView[i]) {
            var thisStr = String.fromCharCode(dataView[i])
            colHeader += thisStr;
          } else {
            textPos = i + 1;
            break;
          }
        }

        //Set properties of column/dataset
        dataSet.label = colHeader;
        let maxY = dataView[textPos++] + dataView[textPos++] * 128;
        // console.log('maxY ',maxY)


        dataSet.maxY = maxY / 100;
        if (maxY > 8192) maxY -= 16384;

        let minY = dataView[textPos++] + dataView[textPos++] * 128;
        if (minY > 8192) minY -= 16384;
        dataSet.minY = minY / 100;

        let length = dataView[textPos++] + dataView[textPos++] * 128;
        dataSet.length = length;
        dataSet.name = dataSet.label.toLowerCase() + '-y-axis';
        console.log('maxY minY length:',maxY,minY,length);

        let dataPoints = [];
        for (var i = 0; i < length; i++) {
          var t = (dataView[textPos] + dataView[textPos + 1] * 128) / 100;
          textPos += 2;
          dataPoints.push(t)
        }
        dataSet.data = dataPoints;
        //console.log('dataset ',dataSet)
        datasets.push(dataSet)
        //console.log('show next few bytes ',dataView[textPos-5],dataView[textPos-4],dataView[textPos-3],dataView[textPos-2],dataView[textPos-1],dataView[textPos],dataView[textPos+1],dataView[textPos+2],dataView[textPos+3],dataView[textPos+4],dataView[textPos+5]) 

        var EndOfRecordKey = (dataView[textPos] + dataView[textPos + 1] * 128);   // end of record key
        //console.log('EndOfRecordKey should be 16383 = ',EndOfRecordKey)   // only works for data below 0x80 ??    7bit transfer only  

        if (dataView[textPos + 2]) {  // checking next panel of data , looking for T from Temp
          textPos += 2;               // get past the enod of record marker
          readSingle()
        }
      }
      readSingle();

      //console.log(datasets)


      this.updateGraphData(datasets);
    })



  }

  search() {
    this.apiService.get('/searchRoom/' + this.facilityId + '/' + [this.roomId-1]).subscribe(res => {
      //this.readBinFile();
      // this.readBinFile();

      var data = res.text();
      let dataArr = new ArrayBuffer(data.length * 2)
      let dataView = new Uint8Array(dataArr)
      let datasets = [];

      console.log('\n\ndata.length ', data.length);
      for (var i = 0; i < data.length; i++) {
        dataView[i] = data.charCodeAt(i);
      }
      var textPos = 0;
      var firstTimeStamp = dataView[textPos++] + dataView[textPos++] * 128 + dataView[textPos++] * 128 * 128 + dataView[textPos++] * 128 * 128 * 128 + dataView[textPos++] * 128 * 128 * 128 * 128;
      var lastTimeStamp = dataView[textPos++] + dataView[textPos++] * 128 + dataView[textPos++] * 128 * 128 + dataView[textPos++] * 128 * 128 * 128 + dataView[textPos++] * 128 * 128 * 128 * 128;


      let today = '';
      let todaysTime = '';

      // this.displayTimeStamp = firstTimeStamp;
      // this.DisplayTime();
      // console.log('Today is ',this.today);
      // console.log('todaysTime is ',this.todaysTime);
      
      // // now set the first axis time label from  Point 1
      // //      this.lineChartLabels[0] = this.today;
      // this.lineChartLabels[0] = this.todaysTime;

      // this.displayTimeStamp = lastTimeStamp;
      // this.DisplayTime();
      
      // // now set the first axis time label from  Point 1
      // //      this.lineChartLabels[0] = this.today;
      // this.lineChartLabels[1023] = this.todaysTime;

      
      // console.log('Today is ',this.today);
      // console.log('todaysTime is ',this.todaysTime);
      


      this.displayTimeStamp = firstTimeStamp;
      this.DisplayTime();
      console.log('TimeStamp: ',this.todaysTime,this.today);
      
      // now set the first axis time label from  Point 1
      this.lineChartLabels[0] = this.todaysShortTime;



      this.displayTimeStamp = (lastTimeStamp - firstTimeStamp)/2 + firstTimeStamp;
      this.DisplayTime();

      console.log('TimeStamp: ',this.todaysTime,this.today);

      var stepTime = (lastTimeStamp - firstTimeStamp )/1024;
      for(var i = 0;i<1024;i++){
        this.displayTimeStamp = firstTimeStamp + stepTime * i;
        this.DisplayTime();
        this.lineChartLabels[i] =  this.todaysTime;
      }

      
      this.displayTimeStamp = lastTimeStamp;
      this.DisplayTime();
      this.lineChartLabels[1023] = this.todaysShortTime;    



      //Get name of column/dataset
      let readSingle = function () {
        let dataSet = {
          name: '',
          maxY: 0,
          minY: 0,
          length: 0,
          label: '',
          data: []
        }
        //console.log('Read single Next Byte ->',dataView[textPos],)
        let colHeader: string = '';
        for (var i = textPos; i < dataView.length; i++) {
          if (dataView[i]) {
            var thisStr = String.fromCharCode(dataView[i])
            colHeader += thisStr;
          } else {
            textPos = i + 1;
            break;
          }
        }

        //Set properties of column/dataset
        dataSet.label = colHeader;
        let maxY = dataView[textPos++] + dataView[textPos++] * 128;


        dataSet.maxY = maxY / 100;
        if (maxY > 8192) maxY -= 16384;
        let minY = dataView[textPos++] + dataView[textPos++] * 128;
        if (minY > 8192) minY -= 16384;
        dataSet.minY = minY / 100;
        let length = dataView[textPos++] + dataView[textPos++] * 128;
        dataSet.length = length;
        dataSet.name = dataSet.label.toLowerCase() + '-y-axis';
        //console.log('maxY minY length:',maxY,minY,length);

        let dataPoints = [];
        for (var i = 0; i < length; i++) {
          var t = (dataView[textPos] + dataView[textPos + 1] * 128) / 100;
          textPos += 2;
          dataPoints.push(t)
        }
        dataSet.data = dataPoints;
        //console.log('dataset ',dataSet)
        datasets.push(dataSet)

        var EndOfRecordKey = (dataView[textPos] + dataView[textPos + 1] * 128);   // these two bytes should be 0xAA55 = 55 * 256 + AA = 21930 decimal
        // these two bytes should be 0xAA55 = 55 * 128 + 2A =  10992 decimal
        //console.log('EndOfRecordKey should be 16383 = ',EndOfRecordKey)   // only works for data below 0x80 ??           
        if (dataView[textPos + 2]) {  // checking next panel of data , looking for T from Temp
          textPos += 2;               // get passed 0xAA55  , but I cant see it ??
          readSingle()
        }
      }
      readSingle();

      //console.log(datasets)
      this.updateGraphData(datasets);
    })
  }
  


  readBinFile() {

    this.apiService.get('/requestedGraphData.bin').subscribe(res => {

      var data = res.text();
      let dataArr = new ArrayBuffer(data.length * 2)
      let dataView = new Uint8Array(dataArr)
      let datasets = [];


      // let dataValue = new Int16Array(data.length/2)
      // let dataInt = new Uint16Array(dataValue)
      // for (var i = 0; i < data.length/2; i++) {
      //   dataInt[i] = data[i];
      // }
      // let myHex = 0xAA;

      console.log('data.length ', data.length);
      for (var i = 0; i < data.length; i++) {
        dataView[i] = data.charCodeAt(i);
      }
      var textPos = 0;
      var firstTimeStamp = dataView[textPos++] + dataView[textPos++] * 128 + dataView[textPos++] * 128 * 128 + dataView[textPos++] * 128 * 128 * 128 + dataView[textPos++] * 128 * 128 * 128 * 128;
      var lastTimeStamp  = dataView[textPos++] + dataView[textPos++] * 128 + dataView[textPos++] * 128 * 128 + dataView[textPos++] * 128 * 128 * 128 + dataView[textPos++] * 128 * 128 * 128 * 128;

      console.log('firstTimeStamp :');
      for (i = 0; i < 5; i++)
        console.log(dataView[i]); // show first timestamp bytes
      console.log('\nlastTimeStamp: ');
      for (i = 0; i < 5; i++)
        console.log(dataView[i + 4]); // show last timestamp bytes 
      console.log('\n');

      //console.log(data, dataView)

      //Get name of column/dataset
      let readSingle = function () {
        let dataSet = {
          name: '',
          maxY: 0,
          minY: 0,
          length: 0,
          label: '',
          data: []
        }
        //console.log('Read single')
        let colHeader: string = '';
        for (var i = textPos; i < dataView.length; i++) {
          if (dataView[i]) {
            var thisStr = String.fromCharCode(dataView[i])
            colHeader += thisStr;
          } else {
            textPos = i + 1;
            break;
          }
        }

        //Set properties of column/dataset
        dataSet.label = colHeader;
        //let a = dataView[textPos];
        //let b = dataView[textPos+1];
        //console.log('a b',a, b)
        let maxY = dataView[textPos++] + dataView[textPos++] * 128;
        //console.log('maxY a',maxY)
        // maxY = nValue[wordPosition];
        // console.log('maxY q',maxY)


        dataSet.maxY = maxY / 100;
        // console.log('maxY b',maxY)
        if (maxY > 8192) maxY -= 16384;
        //console.log('maxY c',maxY)
        //console.log('minY minY',dataView[textPos],dataView[textPos+1])
        let minY = dataView[textPos++] + dataView[textPos++] * 128;
        if (minY > 8192) minY -= 16384;
        dataSet.minY = minY / 100;
        let length = dataView[textPos++] + dataView[textPos++] * 128;
        dataSet.length = length;
        dataSet.name = dataSet.label.toLowerCase() + '-y-axis';
        //console.log('maxY minY length:',maxY,minY,length);

        let dataPoints = [];
        for (var i = 0; i < length; i++) {
          var t = (dataView[textPos] + dataView[textPos + 1] * 128) / 100;
          textPos += 2;
          dataPoints.push(t)
        }
        dataSet.data = dataPoints;
        //console.log('dataset ',dataSet)
        datasets.push(dataSet)
        //console.log('show next few bytes ',dataView[textPos-5],dataView[textPos-4],dataView[textPos-3],dataView[textPos-2],dataView[textPos-1],dataView[textPos],dataView[textPos+1],dataView[textPos+2],dataView[textPos+3],dataView[textPos+4],dataView[textPos+5]) 

        var EndOfRecordKey = (dataView[textPos] + dataView[textPos + 1] * 128);   // these two bytes should be 0xAA55 = 55 * 256 + AA = 21930 decimal
        // these two bytes should be 0xAA55 = 55 * 128 + 2A =  10992 decimal
        //console.log('EndOfRecordKey should be 16383 = ',EndOfRecordKey)   // only works for data below 0x80 ??           
        if (dataView[textPos + 2]) {  // checking next panel of data , looking for T from Temp
          textPos += 2;               // get passed 0xAA55  , but I cant see it ??
          readSingle()
        }
      }
      readSingle();

      //console.log(datasets)


      this.updateGraphData(datasets);
    });;
  }

  updateGraphData(datasets) {
    //Update the actual plot points
    let _lineChartData: Array<any> = new Array(this.lineChartData.length);
    let _lineChartOptions = Object.assign(this.lineChartOptions);

    for (let a = 0; a < datasets.length; a++) {
      //console.log('New dataset',this.lineChartData.length)      //5 arrays
      // console.log('New dataset', datasets[a])
      let data = datasets[a]
      for (let i = 0; i < this.lineChartData.length; i++) {   // 5
        //console.log(this.lineChartData[i].label, data.label)  //co2 vs temperature
        if (this.lineChartData[i].label === data.label) {
          _lineChartData[i] = {
            data: data.data,
            label: data.label,
            //length: data.length,      // added by nick
            yAxisID: data.label.toLowerCase() + '-y-axis'
          };
          this.lineChartData[i].data.length = data.length;   // added by nick
          // console.log('lineChartData.data.length ',this.lineChartData[i].data.length)    // only 10 here // only the first time
          // console.log('data.length ',data.length)                         //     1024 here
          for (let j = 0; j < this.lineChartData[i].data.length; j++) {
            _lineChartData[i].data[j] = data.data[j];
          }
          _lineChartOptions.scales.yAxes[i] = {
            ticks: {
              max: 200,
              min: 100,
              stepSize: this.getAxisStepSize(data.label.toLowerCase() + '-y-axis'),
              beginAtZero: true,
              //fontColor: this.RedColor  //this.CO2Color,  not shown anywhere ??
            },
            gridLines: {
              display: true,
              drawBorder: false,
              offsetGridLines: true,
            },
            id: 'co2-y-axis',
            type: 'linear',
            position: 'left',
          }
        } else {
          _lineChartData[i] = this.lineChartData[i];
          //console.log('else _lineChartData ', _lineChartData);
        }
      }
      this.lineChartData = _lineChartData;
      this.lineChartOptions = Object.assign(_lineChartOptions);
      this.lineChartLabels.length = 1024;                   //added by nick

      let id = data.label.toLowerCase() + '-y-axis';
      let yAxes = this._chart.chart.config.options.scales.yAxes;
      for (var j = 0; j < yAxes.length; j++) {
        if (yAxes[j].id === id) {
          console.log(data)

          yAxes[j].ticks.max = data.maxY;
          yAxes[j].ticks.min = data.minY;
          yAxes[j].ticks.stepSize = this.getStepSizeOfLine(yAxes[j].ticks.max, yAxes[j].ticks.min);
        }
      }
      //console.log('_lineChartData', _lineChartData)
    }
    setTimeout(() => {
      this._chart.updateChartData(_lineChartData);
    }, 10);
  }

  load3d() {
    console.log("load3d is executed");
    var camera, scene, renderer;
    var geometry, material, mesh;

    camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 0);
    camera.position.z = window.innerWidth;

    scene = new THREE.Scene();

    geometry = new THREE.BoxGeometry(1000, 80, 20);
    material = new THREE.MeshBasicMaterial({
      color: 0x000007f,
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // this.buttonCanvas.nativeElement.appendChild(renderer.domElement);
    document.body.appendChild(renderer.domElement);

    function animate() {
      requestAnimationFrame(animate);
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.02;

      renderer.render(scene, camera);
    }
    animate();
  }

  writeLegendValues(e) {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    // ctx.fillStyle = 'rgb(221, 0, 49)';
    //ctx.fillStyle = 'rgb(221, 223, 255)';
  }

  public lineChartData: Array<any> = [
    { data: [0], label: 'CO2', yAxisID: 'co2-y-axis' },
    { data: [0], label: 'VOC', yAxisID: 'voc-y-axis' },
    { data: [0], label: 'O2', yAxisID: 'o2-y-axis' },
    { data: [0], label: 'Temperature', yAxisID: 'temperature-y-axis' },
    { data: [0], label: 'Humidity', yAxisID: 'humidity-y-axis' },
  ];

  getStepSize() {
    function gcd2(x, y) {
      while (y) {
        var t = y;
        y = x % y;
        x = t;
      }
      return x;
    }

    function gcmore(arr) {
      var a, b;
      a = arr[0];
      for (var i = 1; i < arr.length; i++) {
        b = arr[i];
        a = gcd2(a, b);
      }
      return a;
    }
    this.stepSize = gcmore(this.maxOfArrays)
  }

  getAxisMax(id) {
    for (var i = 0; i < this.axisMaxs.length; i++) {
      if (this.axisMaxs[i].name === id) {
        return this.axisMaxs[i].max;
      }
    }
  }

  getAxisMin(id) {
    for (var i = 0; i < this.axisMaxs.length; i++) {
      if (this.axisMaxs[i].name === id) {
        return this.axisMaxs[i].min;
      }
    }
  }

  getAxisStepSize(id) {
    for (var i = 0; i < this.axisMaxs.length; i++) {
      if (this.axisMaxs[i].name === id) {
        return (this.axisMaxs[i].max - this.axisMaxs[i].min) / 5;
      }
    }
  }

  //Currently used to load intiial values
  getMaxY() {
    for (var i = 0; i < this.lineChartData.length; i++) {
      let max = Math.max(...this.lineChartData[i].data)
      if (max % 5) {
        max = max - (max % 5) + 5;
      }

      let min = Math.min(...this.lineChartData[i].data)
      if (min % 5) {
        min = min - (min % 5) - 5;
      }
      this.axisMaxs.push({ name: this.lineChartData[i].yAxisID, max: max, min: min })
      this.maxOfArrays.push(Math.max(...this.lineChartData[i].data));
    }
    this.totalMax = Math.max(...this.maxOfArrays)
  }

  //These 2 are to update a line's values when data is loaded
  getMaxOfLine(data) {
    let max = Math.max(...data)
    if (max % 5) {
      max = max - (max % 5) + 5;
    }
    return max;
  }

  getMinOfLine(data) {
    let min = Math.min(...data)
    if (min % 5) {
      min = min - (min % 5) - 5;
    }
    return min;
  }

  getStepSizeOfLine(max, min) {
    return Math.ceil((max - min) / 5);
  }

  public lineChartLabels: Array<any> = ['Start'];
  //public lineChartLabels:Array<any> = [];
  public lineChartColors: Array<any> = [
    // #define O2colour          (color_t)(rgba(187,187,187,1))   // Gray
    // #define CO2colour         (color_t)(rgba(0,255,255,1))     // BrightCyan
    // #define Humiditycolour    (color_t)(rgba(0,255,0,1))       // BrightGreen
    // #define Temperaturecolour (color_t)(rgba(255,255,0,1))     // BrightYellow
    // #define VOCcolour         (color_t)(rgba(255,255,255,1))   // White
    // #define VOCadj            (color_t)(rgba(255,0,0,1))       // BrightRed		// deep red is not bright
    // #define PWRcolour         (color_t)(rgba(255,145,145,1))   // like Orange	// looks white on small font.
    // #define Currentcolour     (color_t)(rgba(255,0,0,1))       // BrightRed 
    // #define Sparecolour       (color_t)(rgba(255,0,255,1))     // Purple 

    //BrightCyan
    {
      backgroundFillColor: this.dimCO2Color,
      backgroundColor: this.transparent,
      borderColor: this.CO2Color,
      pointBackgroundColor: this.transparent,
      pointBorderColor: this.transparent,
      pointHoverBackgroundColor: this.CO2Color,
      pointHoverBorderColor: this.CO2Color,
      borderWidth: '2px'
    },
    //White
    {
      backgroundFillColor: this.dimVOCColor,
      backgroundColor: this.transparent,
      borderColor: this.VOCColor,
      pointBackgroundColor: this.transparent,
      pointBorderColor: this.transparent,
      pointHoverBackgroundColor: this.VOCColor,
      pointHoverBorderColor: this.VOCColor,
      borderWidth: '2px'
    },
    //Gray
    {
      backgroundFillColor: this.dimO2Color,
      backgroundColor: this.transparent,
      borderColor: this.O2Color,
      pointBackgroundColor: this.transparent,
      pointBorderColor: this.transparent,
      pointHoverBackgroundColor: this.O2Color,
      pointHoverBorderColor: this.O2Color,
      borderWidth: '2px'
    },
    //BrightYellow
    {
      backgroundFillColor: this.dimtemperatureColor,
      backgroundColor: this.transparent,
      borderColor: this.temperatureColor,
      pointBackgroundColor: this.transparent,
      pointBorderColor: this.transparent,
      pointHoverBackgroundColor: this.temperatureColor,
      pointHoverBorderColor: this.temperatureColor,
      borderWidth: '2px'
    },
    //BrightGreen
    {
      backgroundFillColor: this.dimhumidityColor,
      backgroundColor: this.transparent,
      borderColor: this.humidityColor,
      pointBackgroundColor: this.transparent,
      pointBorderColor: this.transparent,
      pointHoverBackgroundColor: this.humidityColor,
      pointHoverBorderColor: this.humidityColor,
      borderWidth: '2px'
    },
  ];
  public lineChartLegend: boolean = true;      // this is the top CO2 VOC.. legend
  public lineChartType: string = 'line';

  // events
  public chartClicked(e: any): void {

    console.log('View Facility Chart click event occurred');   //never seen
    
  }

  public chartHovered(e: any): void {
    console.log('view facility HOVERED over Chart');   //never seen
    this.writeLegendValues(e);
  }

  public testThree() {
    console.log("running Test-three");

  }


  private newFunction(animate: () => void) {
    animate();
  }
}






