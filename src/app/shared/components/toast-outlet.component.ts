import { Component, inject } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-toast-outlet',
  standalone: true,
  template: `
    <div class="pointer-events-none fixed inset-x-4 top-4 z-[100] flex flex-col items-end gap-3 sm:left-auto sm:right-6 sm:w-[min(28rem,calc(100vw-3rem))]">
      @for (notification of notifications(); track notification.id) {
        <div class="pointer-events-auto flex w-full items-start gap-3 rounded-2xl border bg-white p-4 shadow-xl shadow-slate-900/10" [class.border-rose-200]="notification.type === 'error'" [class.border-emerald-200]="notification.type === 'success'" [class.border-sky-200]="notification.type === 'info'" role="status">
          <span class="mt-0.5 text-lg font-bold" [class.text-rose-600]="notification.type === 'error'" [class.text-emerald-600]="notification.type === 'success'" [class.text-sky-600]="notification.type === 'info'" aria-hidden="true">{{ notification.type === 'error' ? '!' : notification.type === 'success' ? '✓' : 'i' }}</span>
          <p class="flex-1 text-sm leading-5 text-slate-700">{{ notification.message }}</p>
          <button type="button" (click)="dismiss(notification.id)" class="text-lg leading-none text-slate-400 hover:text-slate-700" aria-label="Dismiss notification">×</button>
        </div>
      }
    </div>
  `
})
export class ToastOutletComponent {
  private readonly notificationService = inject(NotificationService);
  readonly notifications = this.notificationService.notifications;

  dismiss(id: number) {
    this.notificationService.dismiss(id);
  }
}