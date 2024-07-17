import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Project } from '@models/project';
import { MaterialModule } from '@modules/Material.module';
import { ProjectService } from '@services/projects.service';
import { EMPTY, catchError, map, take } from 'rxjs';
import { JalaliMomentDateAdapter } from '@components/shared/jalali-moment-date-adapter/jalali-moment-date-adapter.component';
import jmoment, { Moment } from 'jalali-moment';
import { DateFilterFn, MatDatepickerInputEvent } from '@angular/material/datepicker';
import moment from 'jalali-moment';
import { CommonService } from '@services/common/common.service';
import { UserService } from '@services/users.service';
import { User } from '@models/user';
import { Task } from '@models/task';
import { TaskAssignmentInput } from '@models/task-assignment-input';
import { TaskService } from '@services/tasks.service';
import { UserInput } from '@models/user-input';

@Component({
  selector: 'add-project',
  standalone: true,
  imports: [MaterialModule, RouterLink, ReactiveFormsModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddTaskComponent implements OnInit {
  adapter: JalaliMomentDateAdapter;
  projectId: number | null = null;
  startDate = jmoment('2017-01-01', 'YYYY-MM-DD');
  minDate = jmoment('2017-10-02', 'YYYY-MM-DD');
  maxDate = jmoment('1396-07-29', 'jYYYY-jMM-jDD');
  jsonDate = '2017-10-19T12:19:48.817';
  public userList!: User[];

  jalaliMomentControl = (initialValue?: Moment) => this.builder.control(initialValue || moment(), Validators.required);

  constructor(
    private builder: FormBuilder,
    private taskService: TaskService,
    private userService: UserService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.adapter = new JalaliMomentDateAdapter();
  }
  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('projectId'));
    const userInput = new UserInput();
    userInput.projectId = this.projectId;
    this.userService
      .getUsers(userInput)
      .pipe(
        take(1),
        map((users) => (this.userList = users))
      )
      .subscribe();
  }
  public pageTitle: string = 'افزودن تسک جدید';
  public id: string | null = null;
  taskForm = this.builder.group({
    title: this.builder.control('', Validators.required),
    description: this.builder.control('', Validators.required),
    deadLine: this.jalaliMomentControl(),
    priority: this.builder.control(1, Validators.required),
    assignmentUserName: this.builder.control('', Validators.required)
  });

  SaveTask() {
    if (this.taskForm.valid && this._dateValidator()) {
      const task: Task = {
        projectId: this.projectId as number,
        title: this.taskForm.value.title as string,
        description: this.taskForm.value.description as string,
        deadLine: this.taskForm.value.deadLine as Moment,
        priority: this.taskForm.value.priority as number
      };
      this.taskService
        .addTask(task)
        .pipe(
          take(1),
          map((res) => {
            const taskAssignmentInput: TaskAssignmentInput = {
              taskId: res as number,
              userName: this.taskForm.value.assignmentUserName as string,
              fromDate: moment() as Moment,
              toDate: moment() as Moment,
              responsibility: 0
            };
            this.taskService
              .assignTaskToMember(taskAssignmentInput)
              .pipe(
                take(1),
                map((res) => {
                  this.commonService.toastErrorMessage('ثبت با موفقیت انجام شد', 'success');
                  this.router.navigate(['/task-list']);
                })
              )
              .subscribe();
          }),
          catchError((error) => {
            this.commonService.toastErrorMessage(error.error, 'error');
            return EMPTY;
          })
        )
        .subscribe();
    }
  }
  dateFilters: DateFilterFn<Moment | null> = (date: Moment | null) => {
    if (date != null) {
      const day: number = date.day();
      if (day === 5) {
        return false;
      }
      return date.isValid(); // Example filter
    } else {
      return false;
    }
  };

  onChange(event: MatDatepickerInputEvent<jmoment.Moment>) {
    console.log('onevent: ', event.value);
  }
  private _dateValidator() {
    const deadLine = this.taskForm.value.deadLine as Moment;
    if (moment() < deadLine) return true;

    this.commonService.toastErrorMessage('مهلت انجام تسک باید بعد از تاریخ امروز باشد', 'error');
    return false;
  }
}
