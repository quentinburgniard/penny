import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, tap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'penny-edit-expense',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './edit-expense.html',
  styleUrl: './edit-expense.css',
})
export class EditExpense {
  currencies = ['eur', 'chf'] as const;
  merchants$: Observable<Array<{ target: 'merchant' | 'category'; id: number; name: string }>>;
  filteredMerchants$: Observable<any>;

  constructor(private readonly http: HttpClient) {
    this.merchants$ = forkJoin({
      merchants: this.http
        .get<{ data: any }>(`${environment.apiBaseUrl}/merchants`, environment.httpOptions)
        .pipe(map(({ data }) => data)),
      categories: this.http
        .get<{ data: any }>(
          `${environment.apiBaseUrl}/merchant-categories`,
          environment.httpOptions
        )
        .pipe(map(({ data }) => data)),
    }).pipe(
      tap(({ merchants, categories }) => {
        console.log('Merchants:', merchants);
        console.log('Categories:', categories);
      }),
      map(({ merchants, categories }) => [
        ...merchants.map((merchant: any) => ({ target: 'merchant' as const, ...merchant })),
        ...categories.map((category: any) => ({ target: 'category' as const, ...category })),
      ])
    );
    this.filteredMerchants$ = this.merchants$;
  }

  protected readonly _form = new FormGroup({
    target: new FormControl<{ target: 'merchant' | 'category'; id: number } | null>(null),
    amount: new FormControl<number | null>(null),
    date: new FormControl<Date | null>(null),
    currency: new FormControl<'eur' | 'chf' | null>(null),
    reimbursementRate: new FormControl<number | null>(null),
    giftRate: new FormControl<number | null>(null),
    project: new FormControl<number | null>(null),
  });
}
