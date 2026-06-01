import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { Project } from "../models/project.model";
import { inject } from "@angular/core";
import { ProjectService } from "../services/project.service";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { catchError, of, pipe, switchMap, tap } from "rxjs";

export interface ProjectState {
    projects: Project[];
    isLoading: boolean;
    error: string | null;
}

export const initialState: ProjectState = {
    projects: [],
    isLoading: false,
    error: null,
}

export const ProjectStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store, projectService = inject(ProjectService)) => ({
        loadAllProjects: rxMethod<void>(
            pipe(
                tap(() => {
                    patchState(store, { isLoading: true, error: null })
                }),
                switchMap(() =>
                    projectService.getProjects().pipe(
                        tap((projects) => {
                            patchState(store, { projects, isLoading: false })
                        }),
                        catchError((error) => {
                            patchState(store, { error: 'Failed to load projects', isLoading: false })
                            return of([]);
                        })
                    )
                )
            )
        )
    }))
)