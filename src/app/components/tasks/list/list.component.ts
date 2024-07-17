import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { MaterialModule } from '@modules/Material.module';
import { JalaaliPipe } from 'app/shared/jalaali.pipe';
import { plainToClass } from 'class-transformer';
import { forkJoin, map, take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { User } from '@models/user';
import { TaskService } from '@services/tasks.service';
import { SortOrder, TaskInput, TaskSortType } from '@models/task-input';
import { TaskResult, TaskStatus } from '@models/task-result';
import { TranslateEnumPipe } from 'app/shared/translateenum.pipe';
import { ChangeStatusComponent } from './changeStatus';
import { TaskHistoryComponent } from './taskHistory';
@Component({
  selector: 'task-list',
  standalone: true,
  imports: [MaterialModule, CommonModule, RouterLink, JalaaliPipe, TranslateEnumPipe],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class TaskListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public taskDate!: TaskResult[];
  public userList!: User[];
  public dataSource: any;
  public searchInput: TaskInput;

  public columns: { key: string, display: string }[] = [
    { key: 'id', display: 'شناسه' },
    { key: 'title', display: 'عنوان' },
    { key: 'description', display: 'توضیحات' },
    { key: 'priority', display: 'اولویت' },
    { key: 'deadLine', display: 'تاریخ تحویل' },
    { key: 'projectTitle', display: 'نام پروژه' },
    { key: 'taskStatus', display: 'وضعیت' }
  ];
  public displayedColumns: string[] = this.columns.map(column => column.key);
  
  selectedRowIndex: number = -1;
  readonly dialog = inject(MatDialog);
  statusEnum = TaskStatus;

  constructor(private taskService: TaskService, private router: Router) {
    this.searchInput = new TaskInput();
  }
  ngOnInit(): void {
    this.loadInitData();
  }
  announceSortChange(sortState: any) {
    console.log(sortState);
    this.searchInput.SortType = this._convertColumnsToTaskSortType(sortState.active);
    this.searchInput.SortOrder = this._convertColumnsToSortOrder(sortState.direction);
    this.loadInitData();
  }

  onChangeTaskStatus() {
    var task = this.taskDate[this.selectedRowIndex];
    const dialogRef = this.dialog.open(ChangeStatusComponent, {
      data: {
        taskTitle: task.title,
        taskId: task.id,
        taskStatus: task.taskStatus
      },
      height: '500px',
      width: '500px'
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.loadInitData();
    });
  }
  onShowTaskHistory() {
    var task = this.taskDate[this.selectedRowIndex];
    const dialogRef = this.dialog.open(TaskHistoryComponent, {
      data: {
        taskId: task.id
      },
      height: '500px',
      width: '500px'
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.loadInitData();
    });
  }
  highlight(index: number) {
    this.selectedRowIndex = index;
  }

  private loadInitData() {
    forkJoin([
      this.taskService.getTasks(this.searchInput).pipe(
        take(1),
        map((tasks) => plainToClass(TaskResult, tasks))
      )
    ]).subscribe(([tasks]) => {
      this.taskDate = tasks;
      this.dataSource = new MatTableDataSource(tasks);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  private _convertColumnsToTaskSortType(column: string): TaskSortType {
    switch (column) {
      case 'priority':
        return TaskSortType.Priority;
      case 'deadLine':
        return TaskSortType.Deadline;
      case 'id':
        return TaskSortType.Id;
      case 'title':
        return TaskSortType.Title;
      case 'projectTitle':
        return TaskSortType.ProjectTitle;
      case 'description':
        return TaskSortType.Description;
      default:
        return TaskSortType.Priority;
    }
  }
  private _convertColumnsToSortOrder(column: string): SortOrder {
    switch (column) {
      case 'asc':
        return SortOrder.Ascending;
      case 'desc':
        return SortOrder.Descending;
      default:
        return SortOrder.Unspecified;
    }
  }
}
