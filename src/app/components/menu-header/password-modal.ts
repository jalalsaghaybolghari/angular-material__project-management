import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MaterialModule } from '@modules/Material.module';
import { CommonService } from '@services/common/common.service';
import { EMPTY, catchError, map, take } from 'rxjs';
import { PasswordInput } from '@models/password-input';
import { UserService } from '@services/users.service';
import { Utility } from 'app/shared/utility';
export interface DialogData {
  userName: string;
}

@Component({
  selector: 'change-password',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
  ],
  styleUrl: './menu-header.component.scss',

  template: `
    <h2 mat-dialog-title style="direction: rtl;">
      <h2>تغییر رمز ورود</h2>
    </h2>
    <mat-dialog-content>
      <form [formGroup]="passwordForm" style="direction: rtl; box-shadow: none">
        <p>
          <mat-form-field class="w-full">
            <mat-label>رمز ورود فعلی</mat-label>
            <input
              class="pr-5"
              type="password"
              matInput
              placeholder="رمز ورود فعلی"
            />
          </mat-form-field>
        </p>
        <p>
          <mat-form-field class="w-full">
            <mat-label>رمز ورود جدید</mat-label>
            <input
              class="pr-5"
              type="password"
              matInput
              formControlName="newPassword"
              placeholder="رمز ورود جدید"
            />
            @if(passwordForm.get('password')?.errors != null &&
            passwordForm.get('password')?.errors?.['invalidPassword']){
            <mat-error class="text-end"
              >کلمه عبور ۶ کاراکتری(اعداد، حروف بزرگ، کوچک و کاراکترهای خاص)
            </mat-error>
            }
          </mat-form-field>
        </p>
        <p>
          <mat-form-field class="w-full">
            <mat-label>تکرار رمز ورود جدید</mat-label>
            <input
              class="pr-5"
              type="password"
              matInput
              formControlName="newPasswordRepeat"
              placeholder="تکرار رمز ورود جدید"
            />
          </mat-form-field>
        </p>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <div class="w-full flex items-center justify-center">
        <button (click)="onNoClick()" mat-raised-button color="accent">
          لغو
        </button>
        <button
          mat-raised-button
          (click)="changePassword()"
          color="primary"
          type="button"
          class="ml-11"
        >
          تغییر رمز
        </button>
      </div>
    </mat-dialog-actions>
  `,
})
export class PasswordComponent {
  readonly dialogRef = inject(MatDialogRef<PasswordComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  constructor(
    private builder: FormBuilder,
    private commonService: CommonService,
    private userService: UserService
  ) {}
  passwordForm = this.builder.group({
    newPassword: this.builder.control('', [
      Validators.required,
      this._passwordValidator.bind(this),
    ]),
    newPasswordRepeat: this.builder.control('', Validators.required),
  });

  onNoClick(): void {
    this.dialogRef.close();
  }
  changePassword() {
    if (this.passwordForm.valid) {
      const passwordInput: PasswordInput = {
        username: this.data.userName as string,
        newPassword: this.passwordForm.value.newPassword as string,
      };
      this.userService
        .changePassword(passwordInput)
        .pipe(
          take(1),
          map((res) => {
            this.commonService.toastErrorMessage(
              'ثبت با موفقیت انجام شد',
              'success'
            );
            this.onNoClick();
          }),
          catchError((error) => {
            this.commonService.toastErrorMessage(error.error, 'error');
            return EMPTY;
          })
        )
        .subscribe();
    }
  }
  private _passwordValidator(
    control: FormControl
  ): { [key: string]: any } | null {
    const isValidPassword = Utility.passwordRegex.test(control.value);
    if (!isValidPassword) {
      return { invalidPassword: true };
    }
    return null;
  }
}
