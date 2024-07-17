import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '@models/task';
import { TaskAssignmentInput } from '@models/task-assignment-input';
import { TaskInput } from '@models/task-input';
import { TaskResult } from '@models/task-result';
import { TaskStatusInput } from '@models/task-status-input';
import { TaskStatusResult } from '@models/task-status-result';
import { Utility } from 'app/shared/utility';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private http: HttpClient) {}

  addTask(task: Task) {
    return this.http.post<number>(`${Utility.serverUrl}/tasks`, task);
  }
  getTasks(taskInput: TaskInput) {
    const url = Utility.getQueryStringParams(`${Utility.serverUrl}/tasks`, taskInput);

    return this.http.get<TaskResult[]>(url);
  }
  changeTaskStatus(taskStatusInput: TaskStatusInput) {
    return this.http.put<any>(`${Utility.serverUrl}/tasks/status`, taskStatusInput);
  }
  getTaskStatuses(taskId: number) {
    return this.http.get<TaskStatusResult[]>(`${Utility.serverUrl}/tasks/${taskId}/status`);
  }
  assignTaskToMember(assignment: TaskAssignmentInput) {
    return this.http.post<any>(`${Utility.serverUrl}/tasks/assign-to-member`, assignment);
  }
}
