import { Component, OnInit, ViewChild, inject } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { JalaaliPipe } from 'app/shared/jalaali.pipe';
import { plainToClass } from 'class-transformer';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProjectMembersResult } from '@models/project-members-result';
import { ProjectService } from '@services/projects.service';
export interface DialogData {
  projectId: number;
}

@Component({
  selector: 'member-list',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    JalaaliPipe,
    CommonModule,
  ],
  styleUrl: './list.component.scss',
  template: `
    <h2 mat-dialog-title style="direction: rtl;">
      <h2>لیست اعضای پروژه</h2>
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
            @if(innerColumn.key === 'fromDate' || innerColumn.key === 'toDate' ){
            <ng-container>
              {{ element[innerColumn.key] | jalaali : 'jYYYY/jMM/jDD' }}
            </ng-container>
            } @else{
            <ng-container>
              {{ element[innerColumn.key] }}
            </ng-container>
            }
          </th>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr
          mat-row
          *matRowDef="let row; let index = index; columns: displayedColumns"
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
export class MemberListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  readonly dialogRef = inject(MatDialogRef<MemberListComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  public membersData!: ProjectMembersResult[];
  public dataSource: any;
  public columns: { key: string, display: string }[] = [
    { key: 'userName', display: 'نام کاربر' },
    { key: 'projectRole', display: 'نقش کاربر' },
    { key: 'fromDate', display: 'تاریخ عضویت از' },
    { key: 'toDate', display: 'تاریخ عضویت تا' }
  ];
  public displayedColumns: string[] = this.columns.map(column => column.key);
  constructor(
    private projectService: ProjectService
  ) {}
  ngOnInit(): void {
    this.loadInitData();
  }
  loadInitData() {
    forkJoin([
      this.projectService.getProjectMembers(this.data.projectId).pipe(
        take(1),
        map((res) => plainToClass(ProjectMembersResult, res))
      ),
    ]).subscribe(([res]) => {
      this.membersData = res;
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
