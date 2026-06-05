import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'ToDo' | 'InProgress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  projectID: string;
  assigneeId?: string | null;
}

interface PaginatedResponse {
  items: Issue[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class IssueService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5210';

  getIssues(
    projectId: string,
    status?: string,
    page = 1,
    pageSize = 50,
  ): Observable<PaginatedResponse> {
    let url =
      this.apiUrl + `/api/issues?projectId=${projectId}&pageNumber=${page}&pageSize=${pageSize}`;

    if (status) {
      url += `&status=${status}`;
    }

    return this.http.get<PaginatedResponse>(url);
  }

  updateStatus(issueId: string, status: 'ToDo' | 'InProgress' | 'Done'): Observable<void> {
    return this.http.patch<void>(
      this.apiUrl + `/api/issues/${issueId}/status`,
      { status },
      { withCredentials: true },
    );
  }

  createIssue(payload: Partial<Issue>): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(this.apiUrl, payload);
  }
}
