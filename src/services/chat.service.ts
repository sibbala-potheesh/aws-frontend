import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message, Chat } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  private chatsSubject = new BehaviorSubject<Chat[]>([]);
  public chats$ = this.chatsSubject.asObservable();

  private activeChatSubject = new BehaviorSubject<string | null>(null);
  public activeChat$ = this.activeChatSubject.asObservable();

  private dummyMessages: Message[] = [
    {
      id: '1',
      senderId: 'other',
      senderName: 'John Doe',
      content: 'Hello! How are you doing today?',
      timestamp: new Date(Date.now() - 60000),
      isRead: true
    },
    {
      id: '2',
      senderId: '1',
      senderName: 'You',
      content: 'Hi John! I\'m doing great, thanks for asking. How about you?',
      timestamp: new Date(Date.now() - 30000),
      isRead: true
    },
    {
      id: '3',
      senderId: 'other',
      senderName: 'John Doe',
      content: 'I\'m doing well too! Are we still on for the meeting tomorrow?',
      timestamp: new Date(Date.now() - 15000),
      isRead: true
    }
  ];

  private dummyChats: Chat[] = [
    {
      id: 'chat1',
      participants: ['1', 'john'],
      lastMessage: {
        id: '3',
        senderId: 'other',
        senderName: 'John Doe',
        content: 'I\'m doing well too! Are we still on for the meeting tomorrow?',
        timestamp: new Date(Date.now() - 15000),
        isRead: true
      },
      unreadCount: 0
    },
    {
      id: 'chat2',
      participants: ['1', 'sarah'],
      lastMessage: {
        id: '4',
        senderId: 'sarah',
        senderName: 'Sarah Wilson',
        content: 'Thanks for the documents!',
        timestamp: new Date(Date.now() - 120000),
        isRead: false
      },
      unreadCount: 2
    },
    {
      id: 'chat3',
      participants: ['1', 'team'],
      lastMessage: {
        id: '5',
        senderId: 'mike',
        senderName: 'Mike Johnson',
        content: 'Great work on the project everyone!',
        timestamp: new Date(Date.now() - 300000),
        isRead: true
      },
      unreadCount: 0
    }
  ];

  constructor() {
    this.messagesSubject.next(this.dummyMessages);
    this.chatsSubject.next(this.dummyChats);
  }

  sendMessage(content: string): void {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: '1',
      senderName: 'You',
      content,
      timestamp: new Date(),
      isRead: true
    };

    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, newMessage]);

    // Simulate a reply after 2 seconds
    setTimeout(() => {
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        senderId: 'other',
        senderName: 'John Doe',
        content: this.getRandomReply(),
        timestamp: new Date(),
        isRead: false
      };

      const messages = this.messagesSubject.value;
      this.messagesSubject.next([...messages, replyMessage]);
    }, 2000);
  }

  setActiveChat(chatId: string): void {
    this.activeChatSubject.next(chatId);
  }

  private getRandomReply(): string {
    const replies = [
      'That sounds great!',
      'I agree with you.',
      'Thanks for letting me know.',
      'Interesting point!',
      'Let me think about that.',
      'Sure, I can help with that.',
      'That makes sense.'
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }
}