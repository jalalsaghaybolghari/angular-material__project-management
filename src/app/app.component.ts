import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MenuHeaderComponent } from '@components/menu-header/menu-header.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonService } from '@services/common/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  defaultToastTimeOut: number = 3000;
  title = 'vahid jafari';
  constructor(
    private _toastrService: ToastrService,
    private _commonService: CommonService,
  ) {
    this.configAppToastMessage();
  }

  private configAppToastMessage() {

    this._commonService.toastMessage$.subscribe((toastMessage) => {
      if (
        toastMessage != null &&
        toastMessage.message != null &&
        toastMessage.message.length !== 0
      ) {
        if (toastMessage.messageType == 'error') {
          this._toastrService.error(`${toastMessage.message}`, undefined, {
            timeOut: toastMessage.timeOut ?? this.defaultToastTimeOut,
            progressBar: true,
          });
        } else if (toastMessage.messageType == 'success') {
          this._toastrService.success(`${toastMessage.message}`, undefined, {
            timeOut: toastMessage.timeOut ?? this.defaultToastTimeOut,
            progressBar: true,
          });
        } else {
          this._toastrService.info(`${toastMessage.message}`, undefined, {
            timeOut: toastMessage.timeOut ?? this.defaultToastTimeOut,
            progressBar: true,
          });
        }
      }
    });
  }
}
