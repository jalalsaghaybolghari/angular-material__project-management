import { Moment } from "jalali-moment";

export class Project {
  id?: number | null;
  title: string;
  description: string;
  startDate?: Moment;
  endDate?: Moment;
  constructor() {
    this.description = "";
    this.title = "";
  }
}