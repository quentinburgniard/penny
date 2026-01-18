import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { isString } from 'lodash-es';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { environment } from '../../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { EditExpenseAllocations } from '../edit-expense-allocations/edit-expense-allocations';

const EURO_DATE_FORMATS = {
  parse: {
    dateInput: 'dd/MM/yyyy',
  },
  display: {
    dateInput: 'dd/MM/yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

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
    MatButtonModule,
    EditExpenseAllocations,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: EURO_DATE_FORMATS },
  ],
  templateUrl: './edit-expense.html',
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
    currency: new FormControl<'eur' | 'chf' | null>('eur'),
    allocations: new FormControl({
      gift: null,
      reimbursement: null,
    }),
    project: new FormControl<any | null>(null),
  });

  get value() {
    const { date } = this._form.value;
    return {
      date: date?.toLocaleDateString('en-CA') ?? null,
      target: this._form.value.merchant?.target ?? null,
      merchant:
        this._form.value.merchant?.target === 'merchant' ? this._form.value.merchant.id : null,
      category:
        this._form.value.merchant?.target === 'category' ? this._form.value.merchant.id : null,
      amount: this._form.value.amount,
      currency: this._form.value.currency,
      project: this._form.value.project?.id ?? null,
      giftRate: this._form.value.allocations?.gift ?? null,
      reimbursementRate: this._form.value.allocations?.reimbursement ?? null,
    };
  }

  constructor(private readonly http: HttpClient) {
    this.merchants$ = forkJoin({
      merchants: this.http
        .get<{ data: any }>(`${environment.apiBaseUrl}/merchants`, { withCredentials: true })
        .pipe(map(({ data }) => data)),
      categories: this.http
        .get<{
          data: any;
        }>(`${environment.apiBaseUrl}/merchant-categories`, { withCredentials: true })
        .pipe(map(({ data }) => data)),
    }).pipe(
      map(({ merchants, categories }) => [
        ...merchants.map((merchant: any) => ({ target: 'merchant' as const, ...merchant })),
        ...categories.map((category: any) => ({ target: 'category' as const, ...category })),
      ]),
    );
    this.projects$ = this.http
      .get<{ data: any }>(`${environment.apiBaseUrl}/expense-projects`, { withCredentials: true })
      .pipe(map(({ data }) => data));
    this.filteredMerchants$ = this.merchants$;
  }

  ngOnInit() {
    this._form.controls.merchant.valueChanges.subscribe((value) => {
      this.filteredMerchants$ = this.merchants$.pipe(
        map((merchants) =>
          merchants.filter((merchant) =>
            isString(value) ? merchant.name.toLowerCase().includes(value.toLowerCase()) : true,
          ),
        ),
      );
    });
  }

  getName(value: any): string {
    return value ? value.name : '';
  }

  save$(id?: number): Observable<any> {
    return id
      ? this.http.put(
          `${environment.apiBaseUrl}/expenses/${id}`,
          { data: this.value },
          {
            withCredentials: true,
          },
        )
      : this.http.post(
          `${environment.apiBaseUrl}/expenses`,
          { data: this.value },
          {
            withCredentials: true,
          },
        );
  }
}
