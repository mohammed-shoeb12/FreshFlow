import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyGst' })
export class CurrencyGstPipe implements PipeTransform {
  transform(value: number, gstPercent = 18, currency = 'INR'): string {
    if (value == null) return '';
    const gst = (value * gstPercent) / 100;
    const total = value + gst;
    return `${currency} ${total.toFixed(2)} (incl. ${gstPercent}% GST)`;
  }
}
