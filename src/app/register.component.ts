import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { NotificationService } from './shared/services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="mx-auto my-10 max-w-2xl rounded-[12px] border border-slate-300 bg-white p-8 shadow-sm shadow-slate-200/70">
      <h1 class="mb-2 text-2xl font-semibold text-slate-900">Create your business account</h1>
      <p class="mb-6 text-slate-600">Register the owner account and business profile to begin.</p>

      <div class="grid gap-4 sm:grid-cols-2">
        <label class="block text-sm font-medium text-slate-700">
          Owner name
          <input #name type="text" placeholder="Your name" class="mt-2 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200" />
        </label>
        <label class="block text-sm font-medium text-slate-700">
          Email
          <input #email type="email" placeholder="you@example.com" class="mt-2 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200" />
        </label>
        <label class="block text-sm font-medium text-slate-700">
          Password
          <input #password type="password" placeholder="At least 8 characters" class="mt-2 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200" />
        </label>
        <label class="block text-sm font-medium text-slate-700">
          Confirm password
          <input #confirmPassword type="password" placeholder="Repeat password" class="mt-2 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200" />
        </label>
        <label class="block text-sm font-medium text-slate-700 sm:col-span-2">
          Business name
          <input #businessName type="text" placeholder="My Shop" class="mt-2 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200" />
        </label>
        <label class="block text-sm font-medium text-slate-700">
          State
          <input #state type="text" placeholder="Maharashtra" class="mt-2 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200" />
        </label>
        <label class="block text-sm font-medium text-slate-700">
          GSTIN <span class="font-normal text-slate-500">(optional)</span>
          <input #gstin type="text" placeholder="27ABCDE1234F1Z5" class="mt-2 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 uppercase outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200" />
        </label>
      </div>

      <div class="mt-6 grid gap-3">
        <button type="button" (click)="register(name.value, email.value, password.value, confirmPassword.value, businessName.value, state.value, gstin.value)" class="rounded-md bg-sky-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-sky-700">Create account</button>
        @if (registerError) {
          <p class="text-sm text-rose-600">{{ registerError }}</p>
        }
        <a routerLink="/login" class="text-center text-sm font-semibold text-sky-700 hover:text-sky-800">Already have an account? Sign in</a>
      </div>
    </section>
  `
})
export class RegisterComponent {
  registerError = '';

  constructor(private auth: AuthService, private router: Router, private notifications: NotificationService) {}

  register(name: string, email: string, password: string, confirmPassword: string, businessName: string, state: string, gstin: string) {
    if (!name || !email || !password || !businessName || !state) {
      this.registerError = 'Complete all required fields.';
      this.notifications.error(this.registerError);
      return;
    }
    if (password.length < 8) {
      this.registerError = 'Password must contain at least 8 characters.';
      this.notifications.error(this.registerError);
      return;
    }
    if (password !== confirmPassword) {
      this.registerError = 'Passwords do not match.';
      this.notifications.error(this.registerError);
      return;
    }

    this.registerError = '';
    this.auth.register({ name, email, password, businessName, state, gstin }).subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: (error) => {
        this.registerError = error?.error?.message || 'Registration failed. Check the API connection and try again.';
        this.notifications.error(this.registerError);
      }
    });
  }
}