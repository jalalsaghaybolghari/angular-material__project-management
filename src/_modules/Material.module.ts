import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { JalaliMomentDateAdapter } from '@components/shared/jalali-moment-date-adapter/jalali-moment-date-adapter.component';
import { JALALI_MOMENT_FORMATS } from '@components/shared/jalali-moment-date-adapter/jalali_moment_formats';
import {MatDividerModule} from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  exports: [
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule ,
    MatDividerModule,
    MatSelectModule
  ],
  providers: [
    { provide: DateAdapter, useClass: JalaliMomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: JALALI_MOMENT_FORMATS },
  ]
})
export class MaterialModule {}
