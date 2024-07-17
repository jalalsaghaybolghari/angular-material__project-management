import { Injectable } from '@angular/core';
import { ToastMessage } from '@models/toast-message';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public toastMessageSubject = new BehaviorSubject<ToastMessage | null>(null);
  toastMessage$ = this.toastMessageSubject.asObservable();

  constructor() {}

  toastErrorMessage = (message: string, messageType: 'success' | 'error' | 'info') => {
    const toastMessage = new ToastMessage();
    toastMessage.message = message;
    toastMessage.messageType = messageType;
    this.toastMessageSubject.next(toastMessage);
  };
}
