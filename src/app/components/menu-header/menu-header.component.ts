import { Component, inject } from '@angular/core';
import { MaterialModule } from '@modules/Material.module';
import { Router, RouterLink } from '@angular/router';
import { LocalStorageService } from '@services/common/local-storage.service';
import { LoginResult } from '@models/login-result';
import { MatDialog } from '@angular/material/dialog';
import { PasswordComponent } from './password-modal';
import { UserProfileComponent } from './user-info-modal';

@Component({
  selector: 'app-menu-header',
  standalone: true,
  imports: [RouterLink, MaterialModule],
  templateUrl: './menu-header.component.html',
  styleUrl: './menu-header.component.scss',
})
export class MenuHeaderComponent {
  readonly dialog = inject(MatDialog);
  loginResult: LoginResult | null;
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.loginResult = this.localStorageService.getLoginResult() as LoginResult;
  }
  onLogOut() {
    this.localStorageService.removeLoginResult();
    this.router.navigate(['/login']);
  }
  onChangePassword() {
    const dialogRef = this.dialog.open(PasswordComponent, {
      data: {
        userName: this.loginResult?.username,
      },
      height: '500px',
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
  onChangeUserInfo() {
    const dialogRef = this.dialog.open(UserProfileComponent, {
      data: {
        firstName: this.loginResult?.firstname,
        lastName: this.loginResult?.lastname,
        mobile: this.loginResult?.mobile,
      },
      height: '500px',
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loginResult =
        this.localStorageService.getLoginResult() as LoginResult;
    });
  }
}
