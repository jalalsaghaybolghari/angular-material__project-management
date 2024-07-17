import { Component, inject, model } from '@angular/core';
import {
  FormBuilder,
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
import { TaskStatus } from '@models/task-result';
import { KeyValuePipe } from '@angular/common';
import { TaskStatusInput } from '@models/task-status-input';
import { TaskService } from '@services/tasks.service';
import { TranslateEnumPipe } from 'app/shared/translateenum.pipe';
export interface DialogData {
  taskId: number;
  taskTitle: string;
  taskStatus: TaskStatus;
}

@Component({
  selector: 'change-status',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    KeyValuePipe,
    TranslateEnumPipe,
  ],
  styleUrl: './list.component.scss',
  template: `
    <h2 mat-dialog-title style="direction: rtl;">
      <h2>تغییر وضعیت تسک</h2>
    </h2>
    <mat-dialog-content>
      <form [formGroup]="statusForm" style="direction: rtl; box-shadow: none">
        <p>
          <mat-form-field class="w-full">
            <mat-label>نام تسک</mat-label>
            <input
              class="pr-5"
              type="text"
              matInput
              placeholder="نام تسک"
              formControlName="taskTitle"
            />
          </mat-form-field>
        </p>
        <p>
          <mat-form-field class="w-full">
            <mat-label>وضعیت تسک</mat-label>
            <mat-select formControlName="taskStatus">
              @for (taskStatus of taskStatusMap; track taskStatus) {
              <mat-option [value]="taskStatus.value">
                {{ taskStatus.value | translateenum : statusEnum }}
              </mat-option>
              }
            </mat-select>
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
          (click)="changeStatus()"
          color="primary"
          type="button"
          class="ml-11"
        >
          تغییر وضعیت تسک
        </button>
      </div>
    </mat-dialog-actions>
  `,
})
export class ChangeStatusComponent {
  readonly dialogRef = inject(MatDialogRef<ChangeStatusComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  constructor(
    private builder: FormBuilder,
    private taskService: TaskService,
    private commonService: CommonService
  ) {}
  statusForm = this.builder.group({
    taskTitle: this.builder.control(this.data.taskTitle, Validators.required),
    taskStatus: this.builder.control(this.data.taskStatus, Validators.required),
  });
  taskStatusMap = Object.keys(TaskStatus).filter(key => isNaN(Number(key))).map(key => ({
    key: key,
    value: TaskStatus[key as keyof typeof TaskStatus]
  }));
  statusEnum = TaskStatus;

  onNoClick(): void {
    this.dialogRef.close();
  }
  changeStatus() {
    if (this.statusForm.valid) {
      const taskStatusInput: TaskStatusInput = {
        taskId: this.data.taskId as number,
        taskStatus: Number(this.statusForm.value.taskStatus) as TaskStatus,
      };
      this.taskService
        .changeTaskStatus(taskStatusInput)
        .pipe(
          take(1),
          map((res) => {
            this.commonService.toastErrorMessage(
              'تغییر وضعیت با موفقیت انجام شد',
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

  // private _dateValidator() {
  //   const fromDate = this.statusForm.value.taskStatus as Moment;
  //   if (fromDate <= toDate) return true;

  //   this.commonService.toastErrorMessage(
  //     'تاریخ شروع عضویت عضویت باید قبل از اتمام آن باشد',
  //     'error'
  //   );
  //   return false;
  // }
}
