import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Project } from "../models/project.model";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class ProjectService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    getProjects(): Observable<Project[]> {
        return this.http.get<Project[]>(this.apiUrl + '/api/project');
    }
}