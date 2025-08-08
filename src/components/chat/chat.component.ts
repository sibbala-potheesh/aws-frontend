import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { Message } from '../../models/chat.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full flex flex-col bg-white">
      <!-- Chat Header -->
      <div class="border-b border-gray-200 p-4 bg-white">
        <div class="flex items-center space-x-4">
          <div class="relative">
            <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              JD
            </div>
            <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900">John Doe</h3>
            <p class="text-sm text-green-600">Online</p>
          </div>
          <div class="flex space-x-2">
            <button class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
            </button>
            <button class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Messages Area -->
      <div #messagesContainer class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scrollbar-hide">
        <div *ngFor="let message of messages" 
             [class]="getMessageClass(message)"
             class="animate-fade-in">
          <div [class]="message.senderId === currentUser?.id ? 'message-bubble message-sent' : 'message-bubble message-received'">
            <p class="text-sm">{{ message.content }}</p>
            <p [class]="message.senderId === currentUser?.id ? 'text-xs text-blue-200 mt-1' : 'text-xs text-gray-500 mt-1'">
              {{ formatTime(message.timestamp) }}
            </p>
          </div>
        </div>

        <!-- Typing indicator -->
        <div *ngIf="isTyping" class="flex space-x-1 justify-start animate-fade-in">
          <div class="message-bubble message-received">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Message Input -->
      <div class="border-t border-gray-200 p-4 bg-white">
        <form (ngSubmit)="sendMessage()" class="flex space-x-4">
          <input
            type="text"
            [(ngModel)]="newMessage"
            name="message"
            placeholder="Type a message..."
            class="flex-1 input-field rounded-full py-3 px-6 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            [disabled]="isSending"
          />
          <button
            type="submit"
            [disabled]="!newMessage.trim() || isSending"
            class="btn-primary rounded-full px-6 py-3 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg *ngIf="!isSending" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
            <svg *ngIf="isSending" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </button>
        </form>
      </div>
    </div>
  `
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  messages: Message[] = [];
  newMessage = '';
  currentUser: User | null = null;
  isSending = false;
  isTyping = false;

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.chatService.messages$.subscribe(messages => {
      this.messages = messages;
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || this.isSending) return;

    this.isSending = true;
    this.chatService.sendMessage(this.newMessage.trim());
    this.newMessage = '';
    
    // Show typing indicator for reply
    setTimeout(() => {
      this.isTyping = true;
      this.isSending = false;
    }, 500);

    setTimeout(() => {
      this.isTyping = false;
    }, 2500);
  }

  getMessageClass(message: Message): string {
    return message.senderId === this.currentUser?.id ? 'flex justify-end' : 'flex justify-start';
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }
}