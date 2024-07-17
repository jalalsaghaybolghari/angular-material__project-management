import { Pipe, PipeTransform } from '@angular/core';
import { EnumTranslatorService } from '@services/common/enum-translator.service';

@Pipe({ name: 'translateenum', standalone: true })
export class TranslateEnumPipe implements PipeTransform {
  enumTranslator: EnumTranslatorService;
  constructor() {
    this.enumTranslator = new EnumTranslatorService();
  }
  transform(value: any, enumType: any): any {
    if (value == null) {
      return '';
    }
    const enumItem = this.enumTranslator.getEnumItem(enumType, +value);
    return enumItem.DisplayName;
  }
}
