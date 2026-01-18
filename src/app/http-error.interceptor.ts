import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

const LOGIN_URL = 'https://id.digitalleman.com';
const HANDLED_HTTP_ERRORS = [401, 403];

export const httpErrorInterceptor: HttpInterceptorFn = (request, next) =>
  next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && HANDLED_HTTP_ERRORS.includes(error.status)) {
        const url = new URL(LOGIN_URL);
        if (error.status === 401) {
          url.searchParams.set(
            'r',
            `${window.location.host}${window.location.pathname}${window.location.search}`,
          );
        }
        window.location.assign(url);
      }

      return throwError(() => error);
    }),
  );
