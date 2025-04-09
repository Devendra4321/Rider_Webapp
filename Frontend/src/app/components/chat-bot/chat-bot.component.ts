import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-bot',
  standalone: false,
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.css'
})
export class ChatBotComponent {
  chatVisible = false;
  userInput = '';
  messages: { sender: string; text: string }[] = [];
  isTyping: boolean = false;
  botData: any[] = [];
  quickReplies: string[] = [];
  showQuickReplies = true;
  newQuestion: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('assets/bot/bot-replies.json').subscribe((data) => {
      this.botData = data;
      // console.log('Bot data loaded:', this.botData);  
      this.initQuickReplies();
      // console.log('Quick replies initialized:', this.quickReplies);
      this.messages = [];
    });
  }

  initQuickReplies(): void {
    this.quickReplies = this.botData.map(entry => {
      return `${entry.keywords[0]}/${entry.keywords[1]}`;
    });
  }

  toggleChat() {
    this.chatVisible = !this.chatVisible;

    if (this.chatVisible && this.messages.length === 0) {
      this.messages.push({ sender: 'Bot', text: 'Welcome to Rider! 👋 How can I assist you today?' });
    }
  }

  handleUserInput(): void {
    if (this.userInput.trim()) {
      this.messages.push({ sender: 'You', text: this.userInput });
      const input = this.userInput;
      this.userInput = '';
      setTimeout(() => this.sendBotResponse(input), 200);
    }
  }

  handleQuickReply(reply: string) {
    this.userInput = reply;
    this.handleUserInput();
    this.showQuickReplies = false; 
    this.quickReplies = this.quickReplies.filter(r => r !== reply);
  }

  getBotResponse(input: string): string {
    const message = input.toLowerCase();

    for (const entry of this.botData) {
      if (entry.keywords.some((kw: string) => message.includes(kw))) {
        console.log('Matching entry:', entry);
        console.log('Response:', entry.response);
        
        return entry.response;
      }
    }
    return 'Sorry, I didn’t understand that. Please try asking about our services, contact, or availability.'; 
  }

  sendBotResponse(input: string): void {
    this.isTyping = true;
    this.showQuickReplies = false;
    setTimeout(() => {
      const response = this.getBotResponse(input);
      this.messages.push({ sender: 'Bot', text: response });
      this.isTyping = false;
      this.newQuestion = true;
    }, 1000);
  } 

  handleNewQuestionReply(type: any) {
    if(type === 'Yes') {
      this.newQuestion = false;
      this.showQuickReplies = true;
    } else {
      this.newQuestion = false;
      this.showQuickReplies = false;
      this.messages.push({ sender: 'Bot', text: 'Thank you! Have a nice day 😊' });
    }
  }

  clearChat(): void {
    this.messages = [];
    this.userInput = '';
    this.messages = [{ sender: 'Bot', text: 'Welcome to Rider! 👋 How can I assist you today?' }];
    this.showQuickReplies = true;
    this.newQuestion = false;
    this.initQuickReplies();
  }
}
