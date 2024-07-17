import { Injectable } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginResult } from '@models/login-result';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private loginResultSubject: BehaviorSubject<LoginResult | null> = new BehaviorSubject<LoginResult| null>(null);
  public loginResult$: Observable<LoginResult| null> = this.loginResultSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    const loginResult = this.getItem('loginResult');
    if (loginResult) this.setLoginResult(loginResult);
  }

  setItem(key: string, value: any): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  getItem(key: string): any {
    if (isPlatformBrowser(this.platformId)) {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    }
    return null;
  }

  removeItem(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }
  getLoginResult() {
    const value = localStorage.getItem('loginResult');
    return value ? JSON.parse(value) : null;
  }

  setLoginResult(value: LoginResult) {
    if (isPlatformBrowser(this.platformId)) {
      this.loginResultSubject.next(value);
      this.setItem('loginResult', value);
    }
  }

  removeLoginResult() {
    if (isPlatformBrowser(this.platformId)) {
      this.loginResultSubject.next(null);
      this.removeItem('loginResult');
    }
  }
}
