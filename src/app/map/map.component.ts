import { Component, OnInit } from '@angular/core';
import {MapService} from '../service/map/map.service';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  lat: number = 51.6754966;
  lng: number = 39.2088823;
  lat_mark: number;
  lng_mark: number;
  markers: Array<any>;
  mark_info: boolean = false;
  marker: any = {};
  formGroup: FormGroup;

  constructor(private  mapService: MapService,
              private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder) {}

  ngOnInit() {
      console.log(event);
      this.mapService.getAll().subscribe(data => {
          this.markers = data;
      });
      //this.initForm();
  }

  /*initForm() {
        this.formGroup = this.fb.group({
            name: [],
            lat:
        });
    }*/

  click(event) {
    this.lat_mark = event.coords.lat;
    this.lng_mark = event.coords.lng;
    this.mark_info = true;
    console.log(event);
      this.formGroup = this.fb.group({
          placeName: [],
          lat: this.lat_mark,
          lng: this.lng_mark
      });
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }

    save(form: NgForm) {
        this.mapService.save(form).subscribe(result => {
            this.gotoList();
        }, error => console.error(error));
    }

    gotoList() {
    window.location.reload();
    }
    /*markerDragEnd(m: any, $event: MouseEvent) {
        console.log('dragEnd', m, $event);
    }*/

}
