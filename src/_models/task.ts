import { Moment } from "jalali-moment";

export class Task {
  projectId?: number;
  title: string;
  description: string;
  deadLine?: Moment;
  priority?: number ;
  constructor() {
    this.description = "";
    this.title = "";
    this.priority = 1;
  }
}