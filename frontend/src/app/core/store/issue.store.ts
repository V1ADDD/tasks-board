import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Issue, IssueService } from '../services/issue.service';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';

export interface IssueState {
  issues: Issue[];
  isLoading: boolean;
  error: string | null;
  activeProjectId: string | null;
}

const initialState: IssueState = {
  issues: [],
  isLoading: false,
  error: null,
  activeProjectId: null,
};

export const IssueStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ issues }) => ({
    todoIssues: computed(() => issues().filter((issue) => issue.status === 'ToDo')),
    inProgressIssues: computed(() => issues().filter((issue) => issue.status === 'InProgress')),
    doneIssues: computed(() => issues().filter((issue) => issue.status === 'Done')),
  })),

  withMethods((store, issueService = inject(IssueService)) => {
    const loadIssuesByProject = rxMethod<string>(
      pipe(
        tap((projectId) =>
          patchState(store, { isLoading: true, activeProjectId: projectId, error: null }),
        ),
        switchMap((projectId) =>
          issueService.getIssues(projectId, 'ToDo').pipe(
            tap((response) => patchState(store, { issues: response.items, isLoading: false })),
            catchError(() => {
              patchState(store, { error: 'Failed to load task boards', isLoading: false });
              return of({ items: [] });
            }),
          ),
        ),
      ),
    );

    const moveIssueStatus = rxMethod<{
      issueId: string;
      nextStatus: 'ToDo' | 'InProgress' | 'Done';
    }>(
      pipe(
        tap(({ issueId, nextStatus }) => {
          const updatedList = store
            .issues()
            .map((issue) => (issue.id === issueId ? { ...issue, status: nextStatus } : issue));
          patchState(store, { issues: updatedList });
        }),
        switchMap(({ issueId, nextStatus }) =>
          issueService.updateStatus(issueId, nextStatus).pipe(
            catchError(() => {
              patchState(store, { error: 'Failed to move task' });
              if (store.activeProjectId()) {
                loadIssuesByProject(store.activeProjectId()!);
              }
              return of(null);
            }),
          ),
        ),
      ),
    );

    return {
      loadIssuesByProject,
      moveIssueStatus,
    };
  }),
);
