import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ApiService } from '../api-service/api-service.service'
import * as THREE from 'THREE';

@Component({
  selector: 'app-test-three',
  templateUrl: './test-three.component.html',
  styleUrls: ['./test-three.component.css']
})
export class TestThreeComponent implements OnInit {

  constructor(
    public apiService : ApiService
  ) { }
  
  @ViewChild('topContainer') topContainer: ElementRef;
  @ViewChild('buttonCanvas') buttonCanvas: ElementRef;
  
  
  public loadData(data) {
      this.topContainer.nativeElement.innerHTML = data;
  }

  public camera;
  public scene;
  public renderer;
  public geometry;
  public material;
  public mesh;

  ngOnInit() {  // see line 4100 in server.cpp
    // this.apiService.get('/Three_data').subscribe(data => {
    //   // let time = data.time;
    //   this.loadData(data)
    // });;
    this.load3d();
  }
  load3d() {
    console.log("load3d is executed");
    var camera, scene, renderer;
    var geometry, material, mesh;

    camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 0);
    camera.position.z = window.innerWidth;

    scene = new THREE.Scene();

    geometry = new THREE.BoxGeometry(180, 80, 20);
    material = new THREE.MeshBasicMaterial({
      color: 0x000007f,
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    //this.buttonCanvas.nativeElement.appendChild(renderer.domElement);
    document.body.appendChild(renderer.domElement);

    function animate() {
      requestAnimationFrame(animate);
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.02;
      renderer.render(scene, camera);  

      if(mesh.rotation.x >2){
        scene.remove(scene.children[0]);
        console.log('it removed');
         //cancelAnimationFrame(this.id);// Stop the animation    // cant seem to get this to do anything
        // this.renderer.domElement.addEventListener('dblclick', null, false); //remove listener to render
        // this.scene = null;
        // this.projector = null;
        // this.camera = null;
        // this.controls = null;
        // this.empty(this.modelContainer);

      }
    }
    animate();
  }

  unload3d(){};
  empty(elem) {
    while (elem.lastChild) elem.removeChild(elem.lastChild);
}
}
