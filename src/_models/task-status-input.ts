import { TaskStatus } from "./task-result";

export class TaskStatusInput {
  taskId?: number;
  taskStatus?: TaskStatus;
  constructor() {
  }
}