import { Component, OnInit, ViewChild, inject, model } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
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
import { forkJoin, map, take } from 'rxjs';
import { TaskStatus } from '@models/task-result';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { TaskService } from '@services/tasks.service';
import { TranslateEnumPipe } from 'app/shared/translateenum.pipe';
import { JalaaliPipe } from 'app/shared/jalaali.pipe';
import { plainToClass } from 'class-transformer';
import { TaskStatusResult } from '@models/task-status-result';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
export interface DialogData {
  taskId: number;
}

@Component({
  selector: 'task-history',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    TranslateEnumPipe,
    JalaaliPipe,
    CommonModule,
  ],
  styleUrl: './list.component.scss',
  template: `
    <h2 mat-dialog-title style="direction: rtl;">
      <h2>تاریخچه تغییر وضعیت</h2>
    </h2>
    <mat-dialog-content>
      <table
        style="direction: rtl; text-align: justify"
        mat-table
        matSort
        [dataSource]="dataSource"
      >
        <ng-container
          matColumnDef="{{ innerColumn.key }}"
          *ngFor="let innerColumn of columns"
        >
          <th mat-sort-header mat-header-cell class="p-0" *matHeaderCellDef>
            {{ innerColumn.display }}
          </th>
          <th mat-cell *matCellDef="let element; let index = index">
            @if(innerColumn.key === 'time' ){
            <ng-container>
              {{ element[innerColumn.key] | jalaali : 'jYYYY/jMM/jDD' }}
            </ng-container>
            }@else if(innerColumn.key === 'status' ){
            <ng-container>
              {{ element[innerColumn.key] | translateenum : statusEnum }}
            </ng-container>
            } @else{
            <ng-container>
              {{ element[innerColumn.key] }}
            </ng-container>
            }
          </th>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayColumns"></tr>
        <tr
          mat-row
          *matRowDef="let row; let index = index; columns: displayColumns"
        ></tr>
      </table>
    </mat-dialog-content>
    <mat-dialog-actions>
      <div class="w-full flex items-center justify-center">
        <button (click)="onNoClick()" mat-raised-button color="accent">
          خروج
        </button>
      </div>
    </mat-dialog-actions>
  `,
})
export class TaskHistoryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  readonly dialogRef = inject(MatDialogRef<TaskHistoryComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  public taskstatusesDate!: TaskStatusResult[];
  public dataSource: any;
  public displayColumns: string[] = ['time', 'status'];
  public columns: { key: string, display: string }[] = [
    { key: 'time', display: 'تاریخ تغییر وضعیت' },
    { key: 'status', display: 'وضعیت' },
  ];
  public displayedColumns: string[] = this.columns.map(column => column.key);
  
  constructor(
    private taskService: TaskService
  ) {}
  ngOnInit(): void {
    this.loadInitData();
  }
  statusEnum = TaskStatus;
  loadInitData() {
    forkJoin([
      this.taskService.getTaskStatuses(this.data.taskId).pipe(
        take(1),
        map((taskstatuses) => plainToClass(TaskStatusResult, taskstatuses))
      ),
    ]).subscribe(([taskstatuses]) => {
      this.taskstatusesDate = taskstatuses;
      this.dataSource = new MatTableDataSource(taskstatuses);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
