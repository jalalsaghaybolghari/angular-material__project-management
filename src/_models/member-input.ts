import { Moment } from "jalali-moment";

export class MemberInput {
  projectId?: number | null;
  userId: string| null;
  fromDate?: Moment;
  toDate?: Moment;
  constructor() {
    this.projectId = null;
    this.userId = null;
  }
}