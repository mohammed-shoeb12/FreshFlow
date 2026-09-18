import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  template: `
    <section class="text-center p-12">
      <h1 class="mb-4 text-5xl font-bold text-slate-900">404</h1>
      <p class="mb-4 text-lg text-slate-600">Page not found.</p>
      <p><a href="/" class="font-semibold text-sky-600 transition hover:text-sky-700">Go back to the dashboard</a></p>
    </section>
  `,
})
export class NotFoundComponent {}
