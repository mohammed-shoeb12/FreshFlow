import { Directive, HostListener, Input } from '@angular/core';

@Directive({ selector: '[appShortcut]' })
export class ShortcutDirective {
  @Input('appShortcut') shortcut = '';

  @HostListener('window:keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    // Example: listen for F8
    if (event.key === this.shortcut) {
      event.preventDefault();
      const el = document.activeElement as HTMLElement;
      el?.dispatchEvent(new Event('shortcut')); // simple hook
    }
  }
}
