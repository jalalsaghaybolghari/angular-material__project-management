import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Project } from '@models/project';
import { MaterialModule } from '@modules/Material.module';
import { ProjectService } from '@services/projects.service';
import { EMPTY, catchError, map, take } from 'rxjs';
import { JalaliMomentDateAdapter } from '@components/shared/jalali-moment-date-adapter/jalali-moment-date-adapter.component';
import jmoment, { Moment } from 'jalali-moment';
import {
  DateFilterFn,
  MatDatepickerInputEvent,
} from '@angular/material/datepicker';
import moment from 'jalali-moment';
import { CommonService } from '@services/common/common.service';

@Component({
  selector: 'add-project',
  standalone: true,
  imports: [MaterialModule, RouterLink, ReactiveFormsModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
})
export class AddProjectComponent implements OnInit {
  adapter: JalaliMomentDateAdapter;
  startDate = jmoment('2017-01-01', 'YYYY-MM-DD');
  minDate = jmoment('2017-10-02', 'YYYY-MM-DD');
  maxDate = jmoment('1396-07-29', 'jYYYY-jMM-jDD');
  jsonDate = '2017-10-19T12:19:48.817';
  jalaliMomentControl = (initialValue?: Moment) =>
    this.builder.control(initialValue || moment(), Validators.required);

  constructor(
    private builder: FormBuilder,
    private projectService: ProjectService,
    private commonService: CommonService,
    private router: Router
  ) {
    this.adapter = new JalaliMomentDateAdapter();
  }
  ngOnInit(): void {}
  public pageTitle: string = 'افزودن پروژه جدید';
  public id: string | null = null;
  projectForm = this.builder.group({
    title: this.builder.control('', Validators.required),
    description: this.builder.control('', Validators.required),
    startDate: this.jalaliMomentControl(),
    endDate: this.jalaliMomentControl(),
  });

  SaveProject() {
    if (this.projectForm.valid && this._dateValidator()) {
      const project: Project = {
        title: this.projectForm.value.title as string,
        description: this.projectForm.value.description as string,
        startDate: this.projectForm.value.startDate as Moment,
        endDate: this.projectForm.value.endDate as Moment,
      };
      // if (this.id == null) {
      this.projectService
        .addProject(project)
        .pipe(
          take(1),
          map((res) => {
            this.commonService.toastErrorMessage(
              'ثبت با موفقیت انجام شد',
              'success'
            );
            this.router.navigate(['/project-list']);
          }),
          catchError((error) => {
            this.commonService.toastErrorMessage(error.error, 'error');
            return EMPTY;
          })
        )
        .subscribe();
      // } else {
      //   project.id = this.id;
      //   this.projectService.updateProject(project).pipe(take(1)).subscribe();
      // }
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
  private _dateValidator(){
    const startDate = this.projectForm.value.startDate as Moment;
    const endDate = this.projectForm.value.endDate as Moment;
    if(startDate <= endDate)
      return true;

    this.commonService.toastErrorMessage("تاریخ شروع پروژه باید قبل از اتمام آن باشد", 'error');
    return false
  }

  // onInput(event: MatDatepickerInputEvent<jmoment.Moment>) {
  //   console.log('onInput: ', event.value);
  // }
  // private _loadProject() {
  //   this.id = this.activatedRouter.snapshot.paramMap.get('id') as string;
  //   if (this.id != null && this.id != '') {
  //     this.pageTitle = 'Update Project';
  //     this.projectService
  //       .getProject(this.id)
  //       .pipe(
  //         take(1),
  //         map((project) => {
  //           this.projectForm.setValue({
  //             code: project?.firstName || '',
  //             name: project?.lastName || '',
  //             email: project?.email || '',
  //             phone: project?.mobile || '',
  //           });
  //         })
  //       )
  //       .subscribe();
  //   }
  // }
}
