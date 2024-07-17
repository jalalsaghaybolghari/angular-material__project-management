import { EnumItem } from '@services/common/enum-translator.service';

export class EnumCollection {
  enumList: Enum[];
  a: any;
  constructor() {
    this.enumList = new Array<Enum>();
  }

  add(item: Enum): void {
    this.enumList.push(item);
  }

  remove(item: Enum) {
    // this.enumList.jRemove(item);
  }

  removeByEnum(e: any) {
    this.enumList = this.enumList.filter((x) => x.Enum !== e);
  }

  removeByEnumItem(e: any, enumItemIndex: number) {
    const item = this.enumList.filter((x) => x.Enum === e);
    if (item != null && item.length !== 0) {
      item[0].Items = item[0].Items.filter((x) => x.Id !== enumItemIndex);
    }
  }

  getEnumItemName(e: any, enumItemIndex: number): string {
    const item = this.enumList.filter((x) => x.Enum === e);
    if (item != null && item.length !== 0) {
      const i = item[0].Items.filter((f) => f.Id === enumItemIndex);
      if (i != null && i.length !== 0) {
        return i[0].DisplayName as string;
      } else {
        let enumDisplayName = '';
        let hasNoneZeroValue: boolean = false;
        let enumZeroValue: EnumItem | null = null;

        for (let i in e) {
          let enumItemValue = Number(i);
          if (isNaN(enumItemValue)) continue;

          if (enumItemValue != 0) hasNoneZeroValue = true;
          if (enumItemValue == 0) {
            let eitem = item[0].Items.filter((x) => x.Id == enumItemValue);
            if (eitem.length != 0) enumZeroValue = eitem[0];
            else enumZeroValue = null;
          }
          if ((enumItemIndex & enumItemValue) == enumItemValue) {
            let enumMember = item[0].Items.filter(
              (x) => x.Id === enumItemValue
            );
            if (enumMember != null && enumMember.length != 0)
              enumDisplayName += enumMember[0].DisplayName + ' ، ';
          }
        }

        if (
          hasNoneZeroValue &&
          enumDisplayName != null &&
          enumDisplayName != ''
        )
          //   enumDisplayName = enumDisplayName.remove(enumDisplayName.length - 3);
          return enumDisplayName;
      }
    }
    return e[enumItemIndex];
  }
}

export class Enum {
  constructor() {
    this.Items = new Array<EnumItem>();
  }

  Enum: any;
  Items: Array<EnumItem>;
}
