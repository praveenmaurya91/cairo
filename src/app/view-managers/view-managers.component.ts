import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service/api-service.service'

@Component({
  selector: 'app-view-managers',
  templateUrl: './view-managers.component.html',
  styleUrls: ['./view-managers.component.css']
})
export class ViewManagersComponent implements OnInit {

  constructor(public apiService : ApiService) { 
    }

  ngOnInit() {
    this.loadManagers();
  }


  public managers = []
  
  loadManagers() {
    this.apiService.getTextFile('managersList').subscribe(res => {
      console.log(res)
      this.managers = res.data;
      console.log(this.managers)
    })
  }

  // editManager(manager) {
  //   console.log(manager)
  // }
}

