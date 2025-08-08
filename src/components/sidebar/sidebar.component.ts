import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';
import { User } from '../../models/user.model';
import { Chat } from '../../models/chat.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full bg-white border-r border-gray-200 flex flex-col">
      <!-- Header -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center space-x-3">
          <div class="relative">
            <img 
              [src]="currentUser?.avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150'"
              alt="Profile"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 truncate">{{ currentUser?.username }}</h3>
            <p class="text-sm text-green-600">Online</p>
          </div>
          <button
            (click)="logout()"
            class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            title="Logout"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Navigation -->
      <div class="p-4">
        <div class="space-y-2">
          <button
            (click)="setActiveSection('chats')"
            [class]="getSectionClass('chats')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            <span>Chats</span>
          </button>
          
          <button
            (click)="setActiveSection('contacts')"
            [class]="getSectionClass('contacts')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </svg>
            <span>Contacts</span>
          </button>
          
          <button
            (click)="setActiveSection('settings')"
            [class]="getSectionClass('settings')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span>Settings</span>
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="flex-1 overflow-hidden">
        <!-- Chats List -->
        <div *ngIf="activeSection === 'chats'" class="h-full">
          <div class="px-4 pb-2">
            <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Recent Chats</h4>
          </div>
          <div class="overflow-y-auto h-full scrollbar-hide">
            <div *ngFor="let chat of chats" 
                 class="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
                 (click)="selectChat(chat)">
              <div class="flex items-center space-x-3">
                <div class="relative">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {{ getInitials(chat.lastMessage?.senderName || 'U') }}
                  </div>
                  <div *ngIf="chat.unreadCount > 0" 
                       class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {{ chat.unreadCount }}
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start">
                    <p class="font-medium text-gray-900 truncate">{{ chat.lastMessage?.senderName || 'Unknown' }}</p>
                    <span class="text-xs text-gray-500">{{ formatTime(chat.lastMessage?.timestamp) }}</span>
                  </div>
                  <p class="text-sm text-gray-600 truncate">{{ chat.lastMessage?.content || 'No messages' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contacts List -->
        <div *ngIf="activeSection === 'contacts'" class="p-4">
          <div class="text-center text-gray-500 mt-8">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <p class="text-lg font-medium">No Contacts</p>
            <p class="text-sm">Add contacts to start chatting</p>
          </div>
        </div>

        <!-- Settings -->
        <div *ngIf="activeSection === 'settings'" class="p-4">
          <div class="space-y-4">
            <div class="space-y-2">
              <label class="flex items-center space-x-3">
                <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                <span class="text-sm text-gray-700">Notifications</span>
              </label>
              <label class="flex items-center space-x-3">
                <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked>
                <span class="text-sm text-gray-700">Dark Mode</span>
              </label>
              <label class="flex items-center space-x-3">
                <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                <span class="text-sm text-gray-700">Sound Effects</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SidebarComponent implements OnInit {
  currentUser: User | null = null;
  chats: Chat[] = [];
  activeSection = 'chats';

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.chatService.chats$.subscribe(chats => {
      this.chats = chats;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  getSectionClass(section: string): string {
    const baseClass = 'sidebar-item w-full justify-start';
    return this.activeSection === section ? `${baseClass} active` : baseClass;
  }

  selectChat(chat: Chat): void {
    this.chatService.setActiveChat(chat.id);
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  formatTime(date: Date | undefined): string {
    if (!date) return '';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'now';
  }
}