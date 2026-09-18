import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info';

export interface AppNotification {
  id: number;
  type: NotificationType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private nextId = 0;
  readonly notifications = signal<AppNotification[]>([]);

  success(message: string) {
    this.show('success', message);
  }

  error(message: string) {
    this.show('error', message);
  }

  info(message: string) {
    this.show('info', message);
  }

  dismiss(id: number) {
    this.notifications.update((items) => items.filter((item) => item.id !== id));
  }

  private show(type: NotificationType, message: string) {
    const id = ++this.nextId;
    this.notifications.update((items) => [...items, { id, type, message }].slice(-4));
    setTimeout(() => this.dismiss(id), type === 'error' ? 7000 : 4500);
  }
}