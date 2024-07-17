import { Transform } from "class-transformer";
import moment from "jalali-moment";
import { TaskStatus } from "./task-result";

export class TaskStatusResult {
  status?: TaskStatus;
  @Transform(({ value }) => moment.utc(value).local(false))
  time?: moment.Moment;
  constructor() {}
}
