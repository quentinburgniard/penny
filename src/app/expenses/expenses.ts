import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { JsonPipe } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'penny-expenses',
  imports: [MatTableModule, NgxChartsModule],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css',
})
export class Expenses {
  protected readonly expenses$: Observable<any[]>;
  protected readonly columns: string[] = ['date', 'merchant', 'amount', 'project'];

  constructor(private readonly http: HttpClient) {
    this.expenses$ = this.http
      .get<{
        data: any;
      }>(`${environment.apiBaseUrl}/expenses`, {
        params: {
          populate: ['merchant', 'category', 'project'],
        },
        withCredentials: true,
      })
      .pipe(map(({ data }) => data));
  }
}
