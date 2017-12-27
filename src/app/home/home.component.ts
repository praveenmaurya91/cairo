// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.css']
// })
// export class HomeComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }

import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component'
import { ApiService } from '../api-service/api-service.service'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public apiService: ApiService){}


    public localhostServer = 'http://127.0.0.1';
    public remoteAWSServer = 'http://54.79.126.24';

    public imConnectedtoIP='';

  ngOnInit() {
    this.checkLocalHostisconnecting();
    this.checkAWSHostisconnecting();
    //console.log('Home Page is reading this IP address \n',this.imConnectedtoIP);
  }


  checkAWSHostisconnecting() {
    let these = this;
    setTimeout(function () {
      these.apiService.checkAWSHost().subscribe(res => {
        if (this.imConnectedtoIP != these.localhostServer){
          this.imConnectedtoIP = these.remoteAWSServer;
          console.log('Home TS: response from this IP address ',this.imConnectedtoIP);
        }
        
        console.log('Home TS: imConnectedtoIP',      this.imConnectedtoIP      )
    })
  }, 20);
  }
   
   
  
  checkLocalHostisconnecting() {
    let these = this;
    setTimeout(function () {
      these.apiService.checkLocalHost().subscribe(res => {
      //console.log(res)
      this.imConnectedtoIP = these.localhostServer;

      // let dataArr = new ArrayBuffer(res.length * 2);
      // let dataView = new Uint8Array(dataArr);

      // for (var i = 0; i < res.length; i++) {
      //   dataView[i] = res.charCodeAt(i);
      // }

      // console.log('dataView',dataView[0],dataView[1],dataView[2],dataView[3]);
      console.log('Local host Home Page is running ',this.imConnectedtoIP);
      
    })
  }, 20);
  }
 







}

