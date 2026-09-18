import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { PlaceholderComponent } from './components/placeholder/placeholder.component';
import { ShortcutDirective } from './directives/shortcut.directive';
import { CurrencyGstPipe } from './pipes/currency-gst.pipe';

@NgModule({
  declarations: [
    // ShortcutDirective,
    // CurrencyGstPipe
  ],
  imports: [
    CommonModule,
    ShortcutDirective,
    CurrencyGstPipe],
  exports: [
    CommonModule,
    ShortcutDirective,
    CurrencyGstPipe
  ]
})
export class SharedModule { }