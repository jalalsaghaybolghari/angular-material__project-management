import { Moment } from 'jalali-moment';
import { TaskStatus } from './task-result';

export class TaskInput {
  taskId?: number;
  projectId?: number;
  priority?: number;
  deadLine?: Moment;
  TaskStatus?: TaskStatus;
  SortType: TaskSortType;
  SortOrder: SortOrder;

  constructor() {
    this.SortType = TaskSortType.Priority;
    this.SortOrder = SortOrder.Ascending;
  }
}

export enum TaskSortType {
  Priority = 1,
  Deadline = 2,
  Id = 3,
  Title = 4,
  ProjectTitle = 5,
  Description = 6
}
export enum SortOrder {
  Unspecified = -1,
  Ascending,
  Descending
}
