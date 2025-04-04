import { Component } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environment/environment';
import { RideSocketService } from '../../services/ride-socket/ride-socket.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    standalone: false
})
export class HomeComponent {

   language: any;

   constructor(private translate: TranslateService,) {}

   ngOnInit(): void {
    this.language = localStorage.getItem('language') || 'en';    
   }

   selectLanguage(lang: any){
    this.translate.use(lang);
    localStorage.setItem('language', lang);
    this.language = localStorage.getItem('language');    
   }
}
