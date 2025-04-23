import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { RideSocketService } from '../../services/ride-socket/ride-socket.service';

@Component({
  selector: 'app-ride-chat',
  standalone: false,
  templateUrl: './ride-chat.component.html',
  styleUrl: './ride-chat.component.css'
})
export class RideChatComponent {

  constructor(
    private rideSocketService: RideSocketService
  ) {}

  @Input() userType: any;
  @Input() rideId: any; 
  @Input() rideDetail: any; 
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;
  message = '';
  messages: { sender: string, message: string, timeStamp: string }[] = [];
  userMessageNotification: any;
  captainMessageNotification: any;
  showPopup = false;
  isMessageSeen = false;
  isTyping = false;
  typingTimeout: any;
  userStatus = 'Offline';
  notificationSound: HTMLAudioElement | undefined;

  ngOnInit(): void {
    this.joinChat();
    this.receiveMessage();
    this.isTypingStatus();
    this.isOnlineStatus();
    
    const storedMessages = sessionStorage.getItem('ride-chat');
    this.messages = storedMessages ? JSON.parse(storedMessages) : [];

    if(this.showPopup == true){
      this.isOnline(true);
    }

    this.notificationSound = new Audio('../../../assets/sounds/notification.wav');
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }
  
  ngOnDestroy(): void {
   if(this.rideDetail.status == 'completed' || this.rideDetail.status == 'cancelled'){
    sessionStorage.removeItem('ride-chat');
   }
    
  }

  joinChat(){
    this.rideSocketService.joinChat(this.rideId);
  }

  sendMessage(){
    this.rideSocketService.sendMessage(this.rideId, this.userType, this.message);
    this.message = '';
    setTimeout(() => this.scrollToBottom(), 100);
  }

  receiveMessage(){
    this.rideSocketService.receiveMessage().subscribe((data) => {
      this.messages.push(data);
      sessionStorage.setItem('ride-chat', JSON.stringify(this.messages));
      setTimeout(() => this.scrollToBottom(), 100);
      if(data.sender != this.userType){
        this.playSound();
      }

      // console.log("Recivied message data", data);
      if(data.sender == 'user'){
        this.userMessageNotification = (this.userMessageNotification || 0) + 1;
      } else{
        this.captainMessageNotification = (this.captainMessageNotification || 0) + 1;
      }
    });
  }
  
  togglePopup(): void {
    this.showPopup = !this.showPopup;
    if (this.showPopup) {
      this.isMessageSeen = true;
      this.userMessageNotification = '';
      this.captainMessageNotification = '';
      this.isOnline(true);
      setTimeout(() => this.scrollToBottom(), 100);
    } else{
      this.isMessageSeen = false;
      this.userMessageNotification = '';
      this.captainMessageNotification = '';
      this.isOnline(false);
    }
  }

  scrollToBottom(): void {
    try {
      const element = this.chatMessagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    } catch (err) {
      console.error('Auto-scroll failed:', err);
    }
  }

  isTypingFun(){
    this.rideSocketService.isTyping(this.rideId, this.userType, true);
  }

  isTypingStatus(){
    this.rideSocketService.typingStatus().subscribe((status) => {
      setTimeout(() => this.scrollToBottom(), 50);
      // console.log(status);
      this.isTyping = status.isTyping;

    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    this.typingTimeout = setTimeout(() => {
      this.isTyping = false;
    }, 1400);
    });
  }

  isOnline(onlineStatus: any){
    this.rideSocketService.isOnline(this.rideId, this.userType, onlineStatus);
  }

  isOnlineStatus(){
    this.rideSocketService.onlineStatus().subscribe((status) => {
      console.log(status);
      this.userStatus = status.isOnline ? 'Online' : 'Offline';    
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  playSound() {
    if (this.notificationSound) {
      this.notificationSound.play().catch(err => console.log('Sound error:', err));
    }
  }
}
