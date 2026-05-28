export interface UserSession {
    token: string;
    email: string;
}

export interface AuthState {
    user: UserSession | null;
    isLoading: boolean;
    error: string | null;
}