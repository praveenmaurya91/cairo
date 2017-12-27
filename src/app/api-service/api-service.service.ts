import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
// import { ConstantsService } from './app-constants';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {

  //public baseURL = 'http://54.79.126.24';
  public baseURL = 'http://127.0.0.1';

  public localhostServer = 'http://127.0.0.1';
  public remoteAWSServer = 'http://54.79.126.24';
  public myBaseIP;
  constructor(
    private http: Http
  ) { }

  checkAWSHost() {
    this.myBaseIP = 0;
    return this.http.get(this.remoteAWSServer + '/IP').map((res: Response) => {
      console.log('API Service: have response to /IP from checkAWSHost');
      if (this.myBaseIP != this.localhostServer) {
        this.myBaseIP = this.remoteAWSServer;
        this.baseURL = this.remoteAWSServer;
        console.log('API Service:Home Page is reading this IP address ', this.myBaseIP);
      }

      console.log(' API Service: this.myBaseIP', this.myBaseIP)

      return res.text();
    });
  }
  checkLocalHost() {
    this.myBaseIP = 0;
    return this.http.get(this.localhostServer + '/IP').map((res: Response) => {
      console.log('API Service: have response to /IP from checkLocalHost');

      // var IPaddress = res.text();

      //       let dataArr = new ArrayBuffer(IPaddress.length * 2); 
      //       let dataView = new Uint8Array(dataArr);

      //       for (var i = 0; i < IPaddress.length; i++) {
      //         dataView[i] = IPaddress.charCodeAt(i);
      //       }
      //       console.log('IPaddress',IPaddress);
      //       console.log('dataView',dataView[0],dataView[1],dataView[2],dataView[3]);
      this.myBaseIP = this.localhostServer;
      this.baseURL = this.localhostServer;

      return res.text();
    });
  }





  getData() {
    return this.http.get(this.baseURL + '/requestedGraphData.bin', )
  }
  testThree() {
    return this.http.get(this.baseURL + '/js/build/three.js')
  }

  getTextFile(name) {
    return this.http.get(this.baseURL + '/' + name + '.txt').map((res: Response) => {
      let str = res.text();
      let json = JSON.parse(str)
      return json
    });
  }


  postbinary(url, data) {

    console.log('post binary buffer myArray ', data)


    var myArray = new ArrayBuffer(512);
    var uint8View = new Uint8Array(myArray);

    // this doesn't seem to do anything as Uint8Array only contains 8 bit values , so all values are already in range 0-255
    for (var i = 0; i < uint8View.length; i++) {
      uint8View[i] = i % 255;
    }

    //this.http.post. headers: {'Content-Type': 'image/jpg'}
    this.headers = { 'Content-Type': 'application/octet-stream' };
    return this.http.post(this.baseURL + url, data, { headers: this.headers });

  }
  public headers;
  post(url, data) {
    console.log('ArrayBuffer[data]', data)


    var myArray = new ArrayBuffer(512);
    var uint8View = new Uint8Array(myArray);

    // this doesn't seem to do anything as Uint8Array only contains 8 bit values , so all values are already in range 0-255
    for (var i = 0; i < uint8View.length; i++) {
      uint8View[i] = i % 255;
    }

    //this.http.post. headers: {'Content-Type': 'image/jpg'}
    this.headers = { 'Content-Type': 'application/octet-stream' };
    return this.http.post(this.baseURL + url, myArray, { headers: this.headers });
  }

  get(query) {
    return this.http.get(this.baseURL + query)
  }


  getBinary(query) {

    this.http.get(this.baseURL + query, {
      // headers: {'Content-Type': 'image/jpg'},
      // responseType: ResponseContentType.Blob
    })
      .map(res => {
        return new Blob([res.arrayBuffer], { type: res.headers.get("Content-Type") });
      })
      .map(blob => {
        var urlCreator = window.URL;
        return this.getData // .sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(blob));
      })




    return this.http.get(this.baseURL + query).map((res: Response) => {

      console.log(res.arrayBuffer);
      var blob = new Blob([new Uint8Array(res.arrayBuffer())], {
        type: res.headers.get("Content-Type")
      });
      console.log(blob);
      var neww = blob[0];

      console.log('neww', neww);


      var maxY = res.arrayBuffer();
      let newMaxY = maxY[0];

      console.log(res.arrayBuffer())
      console.log('maxY', newMaxY)

      return res.arrayBuffer()
    });
  }
  getRooms(id) {
    return this.http.get(this.baseURL + '/roomsList/' + id).map((res: Response) => {
      let str = res.text();
      let json = JSON.parse(str)
      return json
    });
  }
  getAllRooms(id) {
    return this.http.get(this.baseURL + '/allRoomsList/' + id).map((res: Response) => {
      let str = res.text();
      let json = JSON.parse(str)
      return json
    });
  }

}
