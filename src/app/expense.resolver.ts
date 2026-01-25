import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResolveFn } from '@angular/router';
import { map, of } from 'rxjs';
import { environment } from '../environments/environment';

export const expenseResolver: ResolveFn<any | null> = (route) => {
  const id = route.paramMap.get('id');
  if (!id) {
    return of(null);
  }

  const http = inject(HttpClient);
  return http
    .get<{ data: any }>(`${environment.apiBaseUrl}/expenses/${id}`, { withCredentials: true })
    .pipe(map(({ data }) => data));
};
