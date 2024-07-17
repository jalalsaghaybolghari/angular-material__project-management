import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MemberInput } from '@models/member-input';
import { Project } from '@models/project';
import { ProjectMembersResult } from '@models/project-members-result';
import { ProjectResult } from '@models/project-result';
import { Utility } from 'app/shared/utility';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) {}

  addProject(project: Project) {
    return this.http.post<Project>(`${Utility.serverUrl}/projects`, project);
  }
  getProjects() {
    return this.http.get<ProjectResult[]>(`${Utility.serverUrl}/projects`);
  }
  deleteProject(id: string) {
    return this.http.delete<Project>(`${Utility.serverUrl}/projects/${id}`);
  }
  // getProject(id: string) {
  //   return this.http.get<Project>(`${Utility.serverUrl}/projects/${id}`);
  // }
  addMember(member: MemberInput) {
    return this.http.post<any>(`${Utility.serverUrl}/projects/members`, member);
  }
  getProjectMembers(id: number) {
    return this.http.get<ProjectMembersResult[]>(`${Utility.serverUrl}/projects/${id}/members`);
  }
}

