import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map, Observable, tap, timestamp } from 'rxjs';

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
    return this.socket
      .fromEvent<any, any>('new-ride')
      .pipe(map((ride) => ride));
  }

  confirmedRide() {
    return this.socket
      .fromEvent<any, any>('ride-confirmed')
      .pipe(map((ride) => ride));
  }

  startRide() {
    return this.socket
      .fromEvent<any, any>('ride-started')
      .pipe(map((ride) => ride));
  }

  endRide() {
    return this.socket
      .fromEvent<any, any>('ride-ended')
      .pipe(map((ride) => ride));
  }

  cancelUserRide() {
    return this.socket
      .fromEvent<any, any>('ride-user-cancelled')
      .pipe(map((ride) => ride));
  }

  joinChat(rideId: string) {
    return this.socket.emit("joinChat", { roomId: rideId});
  }

  sendMessage(rideId: string, userType: string, message: string) {    
    return this.socket.emit("sendMessage", { roomId: rideId, sender: userType, message: message, timeStamp: Date.now() });
  }

  receiveMessage() {  
    return this.socket
      .fromEvent<any, any>('receiveMessage')
      .pipe(map((message) => message));
  }

  isTyping(rideId: string, userType: string, isTyping: boolean) {    
    return this.socket.emit("isTyping", { roomId: rideId, userType: userType, isTyping: isTyping,});
  }

  typingStatus() {  
    return this.socket
      .fromEvent<any, any>('typingStatus')
      .pipe(map((status) => status));
  }

  isOnline(rideId: string, userType: string, isOnline: boolean) {    
    return this.socket.emit("isOnline", { roomId: rideId, userType: userType, isOnline: isOnline });
  }

  onlineStatus() {  
    return this.socket
      .fromEvent<any, any>('onlineStatus')
      .pipe(map((status) => status));
  }
}
