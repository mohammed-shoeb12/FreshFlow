import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { NotificationService } from './shared/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="max-w-[360px] mx-auto my-16 rounded-[12px] border border-slate-300 bg-white p-8 shadow-sm shadow-slate-200/70">
      <h1 class="text-2xl font-semibold mb-3">Login</h1>
      <p class="text-slate-600 mb-6">Enter your credentials to continue.</p>

      <div class="grid gap-4">
        <label class="block text-sm font-medium text-slate-700">
          Email
          <input #username type="email" placeholder="you@example.com" class="mt-2 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200" />
        </label>

        <label class="block text-sm font-medium text-slate-700">
          Password
          <input #password type="password" placeholder="Password" class="mt-2 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200" />
        </label>

        <button (click)="login(username.value, password.value)" class="rounded-md bg-sky-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-sky-700">Sign in</button>
        @if (loginError) {
          <p class="text-sm text-rose-600">{{ loginError }}</p>
        }
        <a routerLink="/register" class="text-center text-sm font-semibold text-sky-700 hover:text-sky-800">Create a business account</a>
      </div>
    </section>
  `
})
export class LoginComponent implements OnInit {
  private returnUrl: string | null = null;
  loginError = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notifications: NotificationService
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

    if (!this.returnUrl && this.route.snapshot.fragment === 'add-stock-item') {
      this.returnUrl = '/inventory#add-stock-item';
    }

    if (this.auth.isLoggedIn()) {
      this.router.navigateByUrl(this.returnUrl || '/dashboard');
    }
  }

  login(username: string, password: string) {
    if (!username || !password) {
      return;
    }

    this.loginError = '';
    this.auth.login(username, password).subscribe({
      next: () => this.router.navigateByUrl(this.returnUrl || '/dashboard'),
      error: (error) => {
        this.loginError = error?.error?.message || 'Unable to sign in. Check the API connection and your credentials.';
        this.notifications.error(this.loginError);
      }
    });
  }
}
