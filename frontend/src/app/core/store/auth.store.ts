import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { AuthState, UserSession } from '../models/auth.model';
import { computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ user }) => ({
    isAuthenticated: computed(() => !!user()),
    token: computed(() => user()?.token ?? null),
  })),

  withMethods((store, http = inject(HttpClient), router = inject(Router)) => ({
    logout() {
      patchState(store, { user: null, error: null });
      router.navigate(['/login']);
    },

    login: rxMethod<{ email: string; password: string }>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((credentials) =>
          http.post<UserSession>('http://localhost:5210/api/auth/login', credentials).pipe(
            tap((userSession) => {
              patchState(store, { user: userSession, isLoading: false });
              router.navigate(['/dashboard']);
            }),
            catchError((err) => {
              const errorMsg =
                err.status === 401
                  ? 'Invalid credentials'
                  : 'An error occurred. Please try again later.';
              patchState(store, { error: errorMsg, isLoading: false });
              return of(err);
            }),
          ),
        ),
      ),
    ),

    register: rxMethod<{ email: string; password: string }>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap((credentials) =>
          http.post<UserSession>('http://localhost:5210/api/auth/register', credentials).pipe(
            tap((userSession) => {
              patchState(store, { user: userSession, isLoading: false });
              router.navigate(['/dashboard']);
            }),
            catchError((err) => {
              const errorMsg =
                err.status === 401
                  ? 'Invalid credentials'
                  : 'An error occurred. Please try again later.';
              patchState(store, { error: errorMsg, isLoading: false });
              return of(err);
            }),
          ),
        ),
      ),
    ),
  })),
);
