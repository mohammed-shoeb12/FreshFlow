import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthSessionService } from '../services/auth-session.service';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private session: AuthSessionService, private router: Router, private notifications: NotificationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.session.getToken();
    if (token) {
      const cloned = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
      return next.handle(cloned).pipe(catchError((error) => this.handleError(error)));
    }
    return next.handle(req).pipe(catchError((error) => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      this.session.clear();
      this.notifications.error('Your session has expired. Please sign in again.');
      void this.router.navigate(['/login']);
    }
    return throwError(() => error);
  }
}
