import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterInput } from '@models/register-input';
import { MaterialModule } from '@modules/Material.module';
import { CommonService } from '@services/common/common.service';
import { UserService } from '@services/users.service';
import { Utility } from 'app/shared/utility';
import { EMPTY, catchError, map, take } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  constructor(
    private userService: UserService,
    private commonService: CommonService,
    private router: Router,
    private _formBuilder: UntypedFormBuilder
  ) {}
  registerForm: UntypedFormGroup = this._formBuilder.group({
    username: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    mobile: ['', [Validators.required, this._phoneNumberValidator.bind(this)]], // Bind to component instance
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, this._passwordValidator.bind(this)]),
  });

  submit() {
    if (this.registerForm.valid) {
      const registerInput = new RegisterInput();
      registerInput.username = this.registerForm.value.username as string;
      registerInput.firstName = this.registerForm.value.firstName as string;
      registerInput.lastName = this.registerForm.value.lastName as string;
      registerInput.mobile = this.registerForm.value.mobile as string;
      registerInput.email = this.registerForm.value.email as string;
      registerInput.password = this.registerForm.value.password as string;

      this.userService
        .register(registerInput)
        .pipe(
          take(1),
          map((res) => {
            this.commonService.toastErrorMessage(
              'ثبت نام با موفقیت انجام شد',
              'success'
            );
            this.router.navigate(['/login']);
          }),
          catchError((error) => {
            this.commonService.toastErrorMessage(error.error, 'error');
            return EMPTY;
          })
        )
        .subscribe();
    }
  }
  private _phoneNumberValidator(control: FormControl): { [key: string]: any } | null {
    const isValidPhone = Utility.phoneRegex.test(control.value);
    if (!isValidPhone) {
      return { phoneNumber: true };
    }
    return null;
  }
  private _passwordValidator(control: FormControl): { [key: string]: any } | null {
    const isValidPassword = Utility.passwordRegex.test(control.value);
    if (!isValidPassword) {
      return { invalidPassword: true };
    }
    return null;
  }
}
