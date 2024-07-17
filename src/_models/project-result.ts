import { Transform } from 'class-transformer';
import * as moment from 'jalali-moment';
import { Moment } from 'jalali-moment';

export class ProjectResult {
  id: number | null;
  title: string;
  description: string;
  @Transform(({ value }) => moment.utc(value).local(false))
  startDate?: moment.Moment;
  @Transform(({ value }) => moment.utc(value).local(false))
  endDate?: moment.Moment;
  constructor() {
    this.id = null;
    this.description = "";
    this.title = "";
  }
}