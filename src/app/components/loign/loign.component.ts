import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginInput } from '@models/login-input';
import { MaterialModule } from '@modules/Material.module';
import { CommonService } from '@services/common/common.service';
import { LocalStorageService } from '@services/common/local-storage.service';
import { UserService } from '@services/users.service';
import { EMPTY, catchError, map, take } from 'rxjs';

@Component({
  selector: 'app-loign',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, NgIf,RouterLink],
  templateUrl: './loign.component.html',
  styleUrl: './loign.component.scss',
})
export class LoignComponent {
  constructor(private userService: UserService, private localStorageService: LocalStorageService, private commonService: CommonService,   private router: Router,
  ) {}

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  submit() {
    if (this.form.valid) {
      const loginInput = new LoginInput();
      loginInput.username = this.form.value.username as string;
      loginInput.password = this.form.value.password as string;

      this.userService
        .login(loginInput)
        .pipe(
          take(1),
          map((res) => {
            this.localStorageService.setLoginResult(res);
            this.router.navigate(["/"]);
          }),
          catchError((error) => {
            this.commonService.toastErrorMessage(error.error,'error');
            return EMPTY;
          })
        )
        .subscribe();
    }
  }

}
