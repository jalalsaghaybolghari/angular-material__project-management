import { Injectable } from '@angular/core';
import { EnumCollection } from '@models/enum-collection';
import { TaskStatus } from '@models/task-result';
@Injectable()
export class EnumTranslatorService {
  private static _instanse: EnumTranslatorService | null = null;
  public static get Instanse(): EnumTranslatorService {
    if (this._instanse == null) {
      this._instanse = new EnumTranslatorService();
    }
    return this._instanse;
  }
  enums: EnumCollection;
  constructor() {
    this.enums = new EnumCollection();
    this.init();
  }
  getEnumItem(e: any, index: number): EnumItem {
    const item = new EnumItem();
    item.Id = index;
    item.DisplayName = this.enums.getEnumItemName(e, index);
    return item;
  }
  init() {
    this.enums.add({
      Enum: TaskStatus,
      Items: [
        { Id: TaskStatus.NotAction, DisplayName: 'اقدام نشده' },
        { Id: TaskStatus.Pending, DisplayName: 'در انتظار تایید' },
        { Id: TaskStatus.InProgress, DisplayName: 'در حال اقدام' },
        { Id: TaskStatus.Completed, DisplayName: 'تکمیل شده' },
      ],
    });
  }
}

export class EnumItem {
  Id?: number;
  DisplayName?: string;
}
