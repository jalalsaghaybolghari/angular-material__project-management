import { InjectionToken } from '@angular/core';
import { MatDateFormats } from '@angular/material/core';
export const JALALI_MOMENT_FORMATS: MatDateFormats = {
    parse: {
        dateInput: 'jYYYY/jMM/jDD',
        // dateInput: 'l',
    },
    display: {
        dateInput: 'jYYYY/jMM/jDD',
        monthYearLabel: 'jYYYY jMMMM',
        dateA11yLabel: 'jYYYY/jMM/jDD',
        monthYearA11yLabel: 'jYYYY jMMMM'
    }
}; 

// export const MOMENT_FORMATS: InjectionToken<MOMENT_FORMATS>;
