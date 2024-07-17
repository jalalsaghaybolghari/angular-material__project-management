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
import { ProfileInput } from '@models/profile-input';
import { LocalStorageService } from '@services/common/local-storage.service';
import { LoginResult } from '@models/login-result';
import { Utility } from 'app/shared/utility';
export interface DialogData {
  firstName: string;
  lastName: string;
  mobile: string;
}

@Component({
  selector: 'user-profile',
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
      <h2>ویرایش اطلاعات کاربری</h2>
    </h2>
    <mat-dialog-content>
      <form [formGroup]="profileForm" style="direction: rtl; box-shadow: none">
        <p>
          <mat-form-field class="w-full">
            <mat-label>نام</mat-label>
            <input
              class="pr-5"
              type="text"
              matInput
              formControlName="firstName"
              placeholder="نام"
            />
          </mat-form-field>
        </p>
        <p>
          <mat-form-field class="w-full">
            <mat-label>نام خانوادکی</mat-label>
            <input
              class="pr-5"
              type="text"
              matInput
              formControlName="lastName"
              placeholder="نام خانوادکی"
            />
          </mat-form-field>
        </p>
        <p>
          <mat-form-field class="w-full">
            <mat-label>شماره موبایل</mat-label>
            <input
              class="pr-5"
              type="text"
              matInput
              formControlName="mobile"
              placeholder="شماره موبایل"
            />
            @if(profileForm.get('mobile')?.errors != null &&
            profileForm.get('mobile')?.errors?.['phoneNumber']){
            <mat-error style="direction: ltr;" class="text-end">
              شماره موبایل وارد شده صحیح نمیباشد
            </mat-error>
            }
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
          (click)="changeProfileInfo()"
          color="primary"
          type="button"
          class="ml-11"
        >
          ویرایش
        </button>
      </div>
    </mat-dialog-actions>
  `,
})
export class UserProfileComponent {
  readonly dialogRef = inject(MatDialogRef<UserProfileComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  constructor(
    private builder: FormBuilder,
    private commonService: CommonService,
    private userService: UserService,
    private localStorageService: LocalStorageService
  ) {}
  profileForm = this.builder.group({
    firstName: this.builder.control(this.data.firstName, Validators.required),
    lastName: this.builder.control(this.data.lastName, Validators.required),
    mobile: this.builder.control(this.data.mobile, [Validators.required, this._phoneNumberValidator.bind(this)]),
  });

  onNoClick(): void {
    this.dialogRef.close();
  }
  changeProfileInfo() {
    if (this.profileForm.valid) {
      const profileInput: ProfileInput = {
        firstName: this.profileForm.value.firstName as string,
        lastName: this.profileForm.value.lastName as string,
        mobile: this.profileForm.value.mobile as string,
      };
      this.userService
        .changeProfileInfo(profileInput)
        .pipe(
          take(1),
          map((res) => {
            const login =
              this.localStorageService.getLoginResult() as LoginResult;
            login.firstname = this.profileForm.value.firstName as string;
            login.lastname = this.profileForm.value.lastName as string;
            login.mobile = this.profileForm.value.mobile as string;
            this.localStorageService.setLoginResult(login);
            this.onNoClick();
            this.commonService.toastErrorMessage(
              'ثبت با موفقیت انجام شد',
              'success'
            );
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
    const isValidPhone = Utility.phoneRegex.test(control.value as string);
    if (!isValidPhone) {
      return { phoneNumber: true };
    }
    return null;
  }
}
