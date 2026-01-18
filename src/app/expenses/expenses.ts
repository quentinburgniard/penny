import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'penny-expenses',
  imports: [MatTableModule, NgxChartsModule],
  templateUrl: './expenses.html',
})
export class Expenses {
  protected readonly expenses$: Observable<any[]>;
  protected readonly columns: string[] = ['date', 'merchant', 'amount'];

  constructor(private readonly http: HttpClient) {
    this.expenses$ = this.http
      .get<{
        data: any;
      }>(`${environment.apiBaseUrl}/expenses`, {
        params: {
          populate: ['merchant', 'category'],
        },
        withCredentials: true,
      })
      .pipe(map(({ data }) => data));
  }
}
