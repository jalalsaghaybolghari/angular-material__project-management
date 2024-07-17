import { Component, inject, model } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import jmoment, { Moment } from 'jalali-moment';

import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { JalaliMomentDateAdapter } from '@components/shared/jalali-moment-date-adapter/jalali-moment-date-adapter.component';
import { MaterialModule } from '@modules/Material.module';
import moment from 'jalali-moment';
import { ProjectService } from '@services/projects.service';
import { CommonService } from '@services/common/common.service';
import { MemberInput } from '@models/member-input';
import { EMPTY, catchError, map, take } from 'rxjs';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { JALALI_MOMENT_FORMATS } from '@components/shared/jalali-moment-date-adapter/jalali_moment_formats';
import { User } from '@models/user';
export interface DialogData {
  projectId: number;
  projectTitle: string;
  userList: User[];
}

@Component({
  selector: 'add-member',
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
  providers: [
    {
      provide: DateAdapter,
      useClass: JalaliMomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: JALALI_MOMENT_FORMATS },
  ],
  styleUrl: './list.component.scss',

  template: `
    <h2 mat-dialog-title style="direction: rtl;">
      <h2 >افزودن عضو جدید</h2>
    </h2>
    <mat-dialog-content>
      <form [formGroup]="memberForm" style="direction: rtl; box-shadow: none">
        <p>
          <mat-form-field class="w-full">
            <mat-label>نام پروژه</mat-label>
            <input
              class="pr-5"
              type="text"
              matInput
              placeholder="نام پروژه"
              formControlName="projectTitle"
            />
          </mat-form-field>
        </p>
        <p>
          <mat-form-field class="w-full">
            <mat-label>نام کاربر</mat-label>
            <mat-select formControlName="userId">
              @for (user of data.userList; track user) {
              <mat-option [value]="user.id"
                >{{ user.firstName }} {{ user.lastName }}</mat-option
              >
              }
            </mat-select>
          </mat-form-field>         
        </p>
        <p>
          <mat-form-field class="w-full">
            <mat-label>تاریخ شروع عضویت</mat-label>
            <input
              class="pr-5"
              matInput
              [matDatepicker]="picker3"
              formControlName="fromDate"
              placeholder="تاریخ شروع عضویت"
            />
            <mat-datepicker-toggle
              matSuffix
              [for]="picker3"
            ></mat-datepicker-toggle>
            <mat-datepicker #picker3></mat-datepicker>
          </mat-form-field>
        </p>
        <p>
          <mat-form-field class="w-full">
            <mat-label>تاریخ پایان عضویت</mat-label>
            <input
              class="pr-5"
              matInput
              [matDatepicker]="picker4"
              formControlName="toDate"
              placeholder="تاریخ پایان عضویت"
            />
            <mat-datepicker-toggle
              matSuffix
              [for]="picker4"
            ></mat-datepicker-toggle>
            <mat-datepicker #picker4></mat-datepicker>
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
          (click)="addMember()"
          color="primary"
          type="button"
          class="ml-11"
        >
          افزودن عضو
        </button>
      </div>
      <!-- <button mat-button [mat-dialog-close]="animal()" cdkFocusInitial>
        Ok
      </button> -->
    </mat-dialog-actions>
  `,
})
export class AddMemberComponent {
  adapter: JalaliMomentDateAdapter;
  startDate = jmoment('2017-01-01', 'YYYY-MM-DD');
  minDate = jmoment('2017-10-02', 'YYYY-MM-DD');
  maxDate = jmoment('1396-07-29', 'jYYYY-jMM-jDD');
  jsonDate = '2017-10-19T12:19:48.817';
  jalaliMomentControl = (initialValue?: Moment) =>
    this.builder.control(initialValue || moment(), Validators.required);

  readonly dialogRef = inject(MatDialogRef<AddMemberComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  constructor(
    private builder: FormBuilder,
    private projectService: ProjectService,
    private commonService: CommonService
  ) {
    this.adapter = new JalaliMomentDateAdapter();
  }
  memberForm = this.builder.group({
    projectTitle: this.builder.control(
      this.data.projectTitle,
      Validators.required
    ),
    userId: this.builder.control("", Validators.required),
    fromDate: this.jalaliMomentControl(),
    toDate: this.jalaliMomentControl(),
  });

  onNoClick(): void {
    this.dialogRef.close();
  }
  addMember() {
    if (this.memberForm.valid && this._dateValidator()) {
      const member: MemberInput = {
        projectId: this.data.projectId as number,
        userId: this.memberForm.value.userId as string,
        fromDate: this.memberForm.value.fromDate as Moment,
        toDate: this.memberForm.value.toDate as Moment,
      };
      this.projectService
        .addMember(member)
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

  private _dateValidator() {
    const fromDate = this.memberForm.value.fromDate as Moment;
    const toDate = this.memberForm.value.toDate as Moment;
    if (fromDate <= toDate) return true;

    this.commonService.toastErrorMessage(
      'تاریخ شروع عضویت عضویت باید قبل از اتمام آن باشد',
      'error'
    );
    return false;
  }
}
