import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule,NoopAnimationsModule} from '@angular/platform-browser/animations';

import { AppMaterialModule } from './app-material/app-material.module';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule, Routes } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import * as THREE from 'three';
import { Http, HttpModule, Response } from '@angular/http';
import { HttpClientModule } from '@angular/common/http'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdjustRoomCycleComponent } from './adjust-room-cycle/adjust-room-cycle.component';
import { Button1Component } from './button1/button1.component';
import { EditRoomStagesComponent } from './edit-room-stages/edit-room-stages.component';
import { EditStagesComponent } from './edit-stages/edit-stages.component';
import { EnrolFacilityComponent } from './enrol-facility/enrol-facility.component';
import { EnrolManagerComponent } from './enrol-manager/enrol-manager.component';
import { ExcelComponent } from './excel/excel.component';
import { HomeComponent } from './home/home.component';
import { TestThreeComponent } from './test-three/test-three.component';
import { ViewFacilitiesComponent } from './view-facilities/view-facilities.component';
import { ViewFacilityComponent } from './view-facility/view-facility.component';
import { ViewManagersComponent } from './view-managers/view-managers.component';
import { NavigationComponent } from './navigation/navigation.component';

import { ApiService } from './api-service/api-service.service';




const appRoutes: Routes = [
  { path: 'excel', component: ExcelComponent },
  { path: 'edit-stage/:command/:facilityid/:roomid/:cycleid/:stageid', component: EditStagesComponent },
  { path: 'edit-stage', component: EditStagesComponent },
  { path: 'editRoom', component: EditRoomStagesComponent },
  { path: 'insertRoomStage', component: EditRoomStagesComponent }, 
  { path: 'deleteRoomStage', component: EditRoomStagesComponent }, 
  { path: 'editCycle/:id/:numberStages/:facilityid/:managerID/:process', component: EditRoomStagesComponent },
  { path: 'edit-room-stages/:id/:numberStages/:facilityid/:managerID', component: EditRoomStagesComponent },
  { path: 'edit-room-stages/:id/:numberStages/:facilityid', component: EditRoomStagesComponent },
  { path: 'edit-room-stages', component: EditRoomStagesComponent },
  { path: 'enrol-manager/:id', component: EnrolManagerComponent },
  { path: 'enrol-manager', component: EnrolManagerComponent },
  { path: 'enrol-facility/:id', component: EnrolFacilityComponent },
  { path: 'enrol-facility', component: EnrolFacilityComponent },
  { path: 'view-facility', component: ViewFacilityComponent },
  { path: 'adjust-room-cycle/:cycleId/:managerId', component: AdjustRoomCycleComponent },
  { path: 'adjust-room-cycle', component: AdjustRoomCycleComponent },
  { path: 'navigation', component: NavigationComponent },
  { path: 'view-managers', component: ViewManagersComponent },
  { path: 'view-facilities', component: ViewFacilitiesComponent },
  { path: 'test-three', component: TestThreeComponent},
  //{ path: 'home', component: HomeComponent},
  //{ path: 'home', component: HomeComponent},
  { path: '', component: HomeComponent}
]


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AdjustRoomCycleComponent,
    Button1Component,
    EditRoomStagesComponent,
    EditStagesComponent,
    EnrolFacilityComponent,
    EnrolManagerComponent,
    ExcelComponent,
    HomeComponent,
    TestThreeComponent,
    ViewFacilitiesComponent,
    ViewFacilityComponent,
    ViewManagersComponent,
    NavigationComponent
  ],
  exports: [
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    ChartsModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    RouterModule.forRoot(
      appRoutes
    ),
    ChartsModule
  ],
  providers: [
    ApiService 
  ],
  bootstrap: [AppComponent]
})


export class AppModule { }
