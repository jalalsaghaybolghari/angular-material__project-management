import { Transform } from "class-transformer";
import moment from "jalali-moment";
import { TaskStatus } from "./task-result";

export class ProjectMembersResult {
  id?: number;
  userName?: number;
  projectRole?: number;
  @Transform(({ value }) => moment.utc(value).local(false))
  fromDate?: moment.Moment;
  @Transform(({ value }) => moment.utc(value).local(false))
  toDate?: moment.Moment;
  constructor() {}
}