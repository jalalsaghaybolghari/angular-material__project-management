import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { ProjectResult } from '@models/project-result';
import { MaterialModule } from '@modules/Material.module';
import { ProjectService } from '@services/projects.service';
import { JalaaliPipe } from 'app/shared/jalaali.pipe';
import { plainToClass } from 'class-transformer';
import { forkJoin, map, take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '@services/users.service';
import { User } from '@models/user';
import { UserInput } from '@models/user-input';
import { AddMemberComponent } from './addMember';
import { MemberListComponent } from './memberList';
@Component({
  selector: 'project-list',
  standalone: true,
  imports: [MaterialModule, CommonModule, RouterLink, JalaaliPipe],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ProjectListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public projectDate!: ProjectResult[];
  public userList!: User[];
  public dataSource: any;
  public columns: { key: string, display: string }[] = [
    { key: 'id', display: 'شناسه' },
    { key: 'title', display: 'عنوان' },
    { key: 'description', display: 'توضیحات' },
    { key: 'startDate', display: 'تاریخ شروع پروژه' },
    { key: 'endDate', display: 'تاریخ پایان پروژه' },
    { key: 'actions', display: 'عملیات' }
  ];
  public displayedColumns: string[] = this.columns.map(column => column.key);

  selectedRowIndex: number = -1;
  readonly dialog = inject(MatDialog);

  constructor(
    private projectService: ProjectService,
    private userService: UserService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loadInitData();
  }

  private loadInitData() {
    const userInput = new UserInput();
    forkJoin([
      this.projectService.getProjects().pipe(
        take(1),
        map((projects) => plainToClass(ProjectResult, projects))
      ),
      this.userService.getUsers(userInput).pipe(
        take(1),
        map((res) => res)
      ),
    ]).subscribe(([projects, users]) => {
      this.projectDate = projects;
      this.dataSource = new MatTableDataSource(projects);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.userList = users;
    });
  }
  highlight(index: number) {
    this.selectedRowIndex = index;
  }
  onAddNewMember() {
    var project = this.projectDate[this.selectedRowIndex];
    const dialogRef = this.dialog.open(AddMemberComponent, {
      data: {
        projectTitle: project.title,
        projectId: project.id,
        userList: this.userList,
      },
      height: '600px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
  onShowMemberList() {
    var project = this.projectDate[this.selectedRowIndex];
    const dialogRef = this.dialog.open(MemberListComponent, {
      data: {
        projectId: project.id,
      },
      height: '600px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
  onAddNewTask() {
    var project = this.projectDate[this.selectedRowIndex];
    this.router.navigate([`add-task/${project.id}`]);
  }
}
