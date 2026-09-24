import { Directive, ElementRef, effect, inject, input } from '@angular/core';

@Directive({
  selector: '[appHighlightOverBudget]',
})
export class HighlightOverBudget {
  private el = inject(ElementRef<HTMLElement>);

  amount = input.required<number>({ alias: 'appHighlightOverBudget' });
  threshold = input<number>(100);

  constructor() {
    effect(() => {
      const over = this.amount() > this.threshold();
      const native = this.el.nativeElement as HTMLElement;
      if (over) {
        native.style.backgroundColor = '#fee2e2';
        native.style.borderLeft = '4px solid #dc2626';
      } else {
        native.style.backgroundColor = '';
        native.style.borderLeft = '';
      }
    });
  }
}