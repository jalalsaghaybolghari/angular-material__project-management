import { Transform } from "class-transformer";
import moment from "jalali-moment";

export class TaskResult {
  id?: number;
  title: string;
  description: string;
  priority?: number ;
  @Transform(({ value }) => moment.utc(value).local(false))
  deadLine?: moment.Moment;
  projectId?: number;
  projectTitle?: string;
  taskStatus?: TaskStatus;
  constructor() {
    this.description = "";
    this.title = "";
    this.priority = 1;
  }
}

export enum TaskStatus{
  NotAction = 0,
  Pending =1,
  InProgress =2,
  Completed =3
}

