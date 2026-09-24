import { Pipe, PipeTransform } from '@angular/core';
import { ExpenseCategory } from '../models/expense.model';

@Pipe({
  name: 'categoryIcon',
})
export class CategoryIcon implements PipeTransform {
  private readonly icons: Record<ExpenseCategory, string> = {
    Food: '🍔',
    Transport: '🚗',
    Shopping: '🛍️',
    Bills: '💡',
    Entertainment: '🎬',
    Other: '📦',
  };

  transform(value: ExpenseCategory | string): string {
    const icon = this.icons[value as ExpenseCategory] ?? '📦';
    return `${icon} ${value}`;
  }
}