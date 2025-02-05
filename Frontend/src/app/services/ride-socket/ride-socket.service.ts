import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RideSocketService {
  constructor(private socket: Socket) {}

  joinRoom(userId: string, userType: string) {
    this.socket.emit('join', { userId, userType });
  }

  offlineCaptain() {
    this.socket.emit('disconnect-captain');
  }

  setCaptainCurrentLocation(userId: any, location: any) {
    this.socket.emit('update-location-captain', { userId, location });
  }

  newRide() {
    return this.socket.fromEvent<any>('new-ride').pipe(map((ride) => ride));
  }

  confirmedRide() {
    return this.socket
      .fromEvent<any>('ride-confirmed')
      .pipe(map((ride) => ride));
  }

  startRide() {
    return this.socket.fromEvent<any>('ride-started').pipe(map((ride) => ride));
  }
}
