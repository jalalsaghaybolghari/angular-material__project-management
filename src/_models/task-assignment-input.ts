import { Moment } from "jalali-moment";

export class TaskAssignmentInput {
  taskId?: number;
  userName: string;
  fromDate ?: Moment;
  toDate ?: Moment;
  responsibility?: number;
  constructor() {
    this.userName = "";
  }
}