import { Component } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environment/environment';
import { RideSocketService } from '../../services/ride-socket/ride-socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
