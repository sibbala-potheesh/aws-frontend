import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, SidebarComponent, ChatComponent],
  template: `
    <div class="h-screen flex bg-gray-100">
      <!-- Sidebar -->
      <div class="w-80 flex-shrink-0 animate-slide-in">
        <app-sidebar></app-sidebar>
      </div>
      
      <!-- Main Content -->
      <div class="flex-1 animate-fade-in">
        <app-chat></app-chat>
      </div>
    </div>
  `
})
export class MainLayoutComponent {}