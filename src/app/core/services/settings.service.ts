import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private _currency = 'INR';

  get currency() {
    return this._currency;
  }

  set currency(code: string) {
    this._currency = code;
  }
}
