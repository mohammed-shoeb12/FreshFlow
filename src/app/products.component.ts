import { Component, computed, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService, AuthUser } from './core/services/auth.service';
import { AuthSessionService } from './core/services/auth-session.service';

type Category = 'All' | 'Fruits' | 'Vegetables' | 'Seasonal fruits';

interface Product {
  id: number;
  name: string;
  category: Exclude<Category, 'All'>;
  quantity: string;
  price: number;
  previousPrice: number;
  discount: number;
  image: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-slate-50 text-slate-900">
      <header class="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <nav class="mx-auto flex max-w-7xl items-center gap-5 px-4 py-3 sm:px-6">
          <a routerLink="/products" class="flex shrink-0 items-center gap-2">
            <span class="grid h-10 w-10 place-items-center rounded-xl bg-lime-500 text-xl font-black text-white">F</span>
            <span class="text-2xl font-black tracking-tight text-lime-600">FreshFlow</span>
          </a>

          <div class="hidden flex-1 items-center gap-3 md:flex">
            <div class="rounded-lg bg-slate-100 px-4 py-2">
              <p class="text-xs font-semibold text-slate-500">Delivering to</p>
              <p class="text-sm font-semibold text-slate-800">Your doorstep in 10 minutes</p>
            </div>
          </div>

          <a routerLink="/login" class="hidden text-sm font-semibold text-slate-700 hover:text-lime-600 sm:block" [class.hidden]="isLoggedIn()">
            Login
          </a>
          @if (isLoggedIn()) {
            <div class="relative">
              <button type="button" (click)="toggleMenu()" class="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 hover:bg-slate-50">
                <span class="grid h-8 w-8 place-items-center rounded-full bg-lime-100 font-bold text-lime-700">{{ initials() }}</span>
                <span class="hidden max-w-28 truncate text-sm font-semibold sm:block">{{ userName() }}</span>
                <span class="text-slate-400">⌄</span>
              </button>
              @if (menuOpen()) {
                <div class="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                  <a routerLink="/profile" class="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100">Profile</a>
                  <a routerLink="/settings" class="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100">Settings</a>
                  <button type="button" (click)="logout()" class="block w-full rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50">Logout</button>
                </div>
              }
            </div>
          }
          <button type="button" (click)="cartOpen.set(true)" class="flex items-center gap-2 rounded-xl bg-lime-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-lime-700">
            <span aria-hidden="true">🛒</span>
            <span>{{ cartCount() }} item{{ cartCount() === 1 ? '' : 's' }}</span>
            <span class="hidden sm:inline">₹{{ cartTotal() }}</span>
          </button>
        </nav>
      </header>

      <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div class="mb-6">
          <p class="text-sm font-semibold text-lime-600">Fresh picks, everyday</p>
          <h1 class="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Stock up on daily essentials</h1>
          <p class="mt-2 text-slate-500">Farm-fresh fruits and vegetables delivered to your door.</p>
        </div>

        <div class="grid gap-6 lg:grid-cols-[180px_1fr]">
          <aside class="h-fit rounded-2xl border border-slate-200 bg-white p-3 lg:sticky lg:top-24">
            <p class="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Shop by category</p>
            <div class="grid grid-cols-2 gap-2 lg:grid-cols-1">
              @for (category of categories; track category) {
                <button type="button" (click)="selectedCategory.set(category)" class="rounded-xl px-3 py-3 text-left text-sm font-semibold transition" [class.bg-lime-50]="selectedCategory() === category" [class.text-lime-700]="selectedCategory() === category" [class.text-slate-600]="selectedCategory() !== category">
                  <span class="mr-2">{{ category === 'Fruits' ? '🍎' : category === 'Vegetables' ? '🥦' : category === 'Seasonal fruits' ? '🍓' : '🛍️' }}</span>{{ category }}
                </button>
              }
            </div>
          </aside>

          <section class="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            @for (product of filteredProducts(); track product.id) {
              <article class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div class="relative aspect-square overflow-hidden bg-slate-100">
                  <img [src]="product.image" [alt]="product.name" class="h-full w-full object-cover transition duration-300 hover:scale-105" />
                  <span class="absolute left-0 top-3 bg-blue-600 px-2 py-1 text-xs font-bold text-white shadow-sm">{{ product.discount }}% OFF</span>
                </div>
                <div class="p-3">
                  <h2 class="line-clamp-2 min-h-11 text-sm font-bold text-slate-900 sm:text-base">{{ product.name }}</h2>
                  <p class="mt-1 text-sm text-slate-500">{{ product.quantity }}</p>
                  <div class="mt-4 flex items-end justify-between gap-2">
                    <div>
                      <span class="text-xs text-slate-400 line-through">₹{{ product.previousPrice }}</span>
                      <span class="ml-1 text-base font-bold text-lime-700">₹{{ product.price }}</span>
                    </div>
                    @if (quantity(product.id) === 0) {
                      <button type="button" (click)="add(product)" class="rounded-lg border border-lime-600 px-3 py-1.5 text-xs font-bold text-lime-700 hover:bg-lime-50">ADD</button>
                    } @else {
                      <div class="flex items-center gap-2 rounded-lg bg-lime-600 px-2 py-1.5 text-sm font-bold text-white">
                        <button type="button" (click)="decrease(product)" aria-label="Decrease quantity">−</button>
                        <span>{{ quantity(product.id) }}</span>
                        <button type="button" (click)="add(product)" aria-label="Increase quantity">+</button>
                      </div>
                    }
                  </div>
                </div>
              </article>
            }
          </section>
        </div>
      </main>

      @if (cartOpen()) {
        <div class="fixed inset-0 z-30 bg-slate-950/30" (click)="cartOpen.set(false)">
          <aside class="absolute right-0 top-0 h-full w-full max-w-md bg-white p-6 shadow-2xl" (click)="$event.stopPropagation()">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold">Your cart</h2>
              <button type="button" (click)="cartOpen.set(false)" class="text-2xl text-slate-400">×</button>
            </div>
            <p class="mt-2 text-sm text-slate-500">{{ cartCount() }} item{{ cartCount() === 1 ? '' : 's' }} added</p>
            @if (cartCount() === 0) {
              <p class="mt-10 text-center text-slate-500">Your cart is empty.</p>
            } @else {
              <div class="mt-6 divide-y divide-slate-100">
                @for (product of cartProducts(); track product.id) {
                  <div class="flex items-center gap-3 py-4">
                    <img [src]="product.image" [alt]="product.name" class="h-14 w-14 rounded-lg object-cover" />
                    <div class="min-w-0 flex-1"><p class="truncate font-semibold">{{ product.name }}</p><p class="text-sm text-slate-500">{{ quantity(product.id) }} × ₹{{ product.price }}</p></div>
                    <span class="font-bold">₹{{ quantity(product.id) * product.price }}</span>
                  </div>
                }
              </div>
              <div class="mt-6 flex items-center justify-between border-t pt-4 text-lg font-bold"><span>Total</span><span>₹{{ cartTotal() }}</span></div>
            }
          </aside>
        </div>
      }
    </div>
  `
})
export class ProductsComponent {
  readonly categories: Category[] = ['All', 'Fruits', 'Vegetables', 'Seasonal fruits'];
  readonly products: Product[] = [
    { id: 1, name: 'Fresh Red Apples', category: 'Fruits', quantity: '1 kg', price: 119, previousPrice: 149, discount: 20, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80' },
    { id: 2, name: 'Fresh Bananas', category: 'Fruits', quantity: '6 pcs', price: 45, previousPrice: 60, discount: 25, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80' },
    { id: 3, name: 'Farm Fresh Tomatoes', category: 'Vegetables', quantity: '500 g', price: 32, previousPrice: 40, discount: 20, image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=600&q=80' },
    { id: 4, name: 'Crisp Green Broccoli', category: 'Vegetables', quantity: '250 g', price: 55, previousPrice: 70, discount: 21, image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=600&q=80' },
    { id: 5, name: 'Organic Carrots', category: 'Vegetables', quantity: '500 g', price: 38, previousPrice: 48, discount: 21, image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=600&q=80' },
    { id: 6, name: 'Sweet Alphonso Mangoes', category: 'Seasonal fruits', quantity: '1 kg', price: 299, previousPrice: 360, discount: 17, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80' },
    { id: 7, name: 'Juicy Watermelon', category: 'Seasonal fruits', quantity: '1 pc', price: 89, previousPrice: 110, discount: 19, image: 'https://images.unsplash.com/photo-1563114773-84221bd62daa?auto=format&fit=crop&w=600&q=80' },
    { id: 8, name: 'Fresh Strawberries', category: 'Seasonal fruits', quantity: '200 g', price: 149, previousPrice: 180, discount: 17, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80' }
  ];
  readonly selectedCategory = signal<Category>('All');
  readonly cart = signal<Record<number, number>>({});
  readonly menuOpen = signal(false);
  readonly cartOpen = signal(false);
  readonly user = signal<AuthUser | null>(null);
  readonly isLoggedIn = computed(() => !!this.user());
  readonly userName = computed(() => this.user()?.name || '');
  readonly initials = computed(() => this.userName().split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'U');
  readonly filteredProducts = computed(() => this.selectedCategory() === 'All' ? this.products : this.products.filter((product) => product.category === this.selectedCategory()));
  readonly cartCount = computed(() => Object.values(this.cart()).reduce((sum, count) => sum + count, 0));
  readonly cartTotal = computed(() => this.products.reduce((sum, product) => sum + (this.cart()[product.id] || 0) * product.price, 0));
  readonly cartProducts = computed(() => this.products.filter((product) => !!this.cart()[product.id]));

  constructor(private readonly auth: AuthService, private readonly session: AuthSessionService, private readonly router: Router) {
    this.user.set(this.session.getUser<AuthUser>());
  }

  quantity(id: number): number {
    return this.cart()[id] || 0;
  }

  add(product: Product): void {
    this.cart.update((items) => ({ ...items, [product.id]: this.quantity(product.id) + 1 }));
  }

  decrease(product: Product): void {
    const next = this.quantity(product.id) - 1;
    this.cart.update((items) => {
      const updated = { ...items };
      if (next <= 0) delete updated[product.id];
      else updated[product.id] = next;
      return updated;
    });
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  logout(): void {
    this.auth.logout();
    this.user.set(null);
    this.menuOpen.set(false);
  }
}
