export interface SnackbarNotification {
    open: boolean;
    message: string;
}

export interface SnackbarState {
    success: SnackbarNotification;
    error: SnackbarNotification;
}
