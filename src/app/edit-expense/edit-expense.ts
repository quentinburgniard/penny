import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, filter, forkJoin, map, tap } from 'rxjs';
import { isString } from 'lodash-es';
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
export class EditExpense implements OnInit {
  currencies = ['eur', 'chf'] as const;
  merchants$: Observable<Array<{ target: 'merchant' | 'category'; id: number; name: string }>>;
  filteredMerchants$: Observable<any>;
  projects$: Observable<any>;

  protected readonly _form = new FormGroup({
    merchant: new FormControl<any | null>(null),
    amount: new FormControl<number | null>(null),
    date: new FormControl<Date | null>(null),
    currency: new FormControl<'eur' | 'chf' | null>(null),
    reimbursementRate: new FormControl<number | null>(null),
    giftRate: new FormControl<number | null>(null),
    project: new FormControl<number | null>(null),
  });

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
      map(({ merchants, categories }) => [
        ...merchants.map((merchant: any) => ({ target: 'merchant' as const, ...merchant })),
        ...categories.map((category: any) => ({ target: 'category' as const, ...category })),
      ])
    );
    this.projects$ = this.http
      .get<{ data: any }>(`${environment.apiBaseUrl}/expense-projects`, environment.httpOptions)
      .pipe(map(({ data }) => data));
    this.filteredMerchants$ = this.merchants$;
  }

  ngOnInit() {
    this._form.controls.merchant.valueChanges.subscribe((value) => {
      console.log(value);
      this.filteredMerchants$ = this.merchants$.pipe(
        map((merchants) =>
          merchants.filter((merchant) =>
            isString(value) ? merchant.name.toLowerCase().includes(value.toLowerCase()) : true
          )
        )
      );
    });
  }

  getMerchantName(merchant: any): string {
    console.log(merchant);
    return merchant ? merchant.name : '';
  }
}
