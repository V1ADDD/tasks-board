import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5210';

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl + '/api/project');
  }
}
