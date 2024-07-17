import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'jalaali', standalone: true })
export class JalaaliPipe implements PipeTransform {
  transform(value: any, args: string): any {
    if (value != null) {
      const format: string = args;
      if (value.isValid()) {
        return value.format(format);
      }
    }
    return null;
  }
}
