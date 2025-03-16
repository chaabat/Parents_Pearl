import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customDate',
  standalone: true,
})
export class CustomDatePipe implements PipeTransform {
  transform(
    value: Date | string | null,
    format: string = 'EEEE, MMMM d, y'
  ): string {
    if (!value) return 'No date provided';

    // If value is a string, convert it to a Date object
    const date = typeof value === 'string' ? new Date(value) : value;

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', value);
      return 'Invalid date';
    }

    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format) || 'Date error';
  }
}
