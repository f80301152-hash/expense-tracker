import { Injectable, inject } from '@angular/core';
import { ExpenseService } from './expense.service';

export interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

@Injectable({ providedIn: 'root' })
export class AiChatbotService {
  private expenseService = inject(ExpenseService);

  send(message: string): Promise<string> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.reply(message)), 600);
    });
  }

  private reply(raw: string): string {
    const msg = raw.trim().toLowerCase();
    const expenses = this.expenseService.expenses();

    if (!msg) return 'Please type something.';

    if (msg.includes('total') || msg.includes('sum')) {
      const total = expenses.reduce((s, e) => s + e.amount, 0);
      return `Your total spending is $${total.toFixed(2)} across ${expenses.length} expense(s).`;
    }

    if (msg.includes('biggest') || msg.includes('largest') || msg.includes('most expensive')) {
      if (!expenses.length) return 'You have no expenses yet.';
      const top = expenses.reduce((a, b) => (b.amount > a.amount ? b : a));
      return `Your biggest expense is $${top.amount.toFixed(2)} in ${top.category} on ${top.date}.`;
    }

    if (msg.includes('count') || msg.includes('how many')) {
      return `You have ${expenses.length} expense(s) recorded.`;
    }

    if (msg.includes('category') || msg.includes('categories')) {
      const counts = new Map<string, number>();
      expenses.forEach(e => counts.set(e.category, (counts.get(e.category) ?? 0) + 1));
      if (!counts.size) return 'No categories yet.';
      const lines = [...counts.entries()].map(([c, n]) => `${c}: ${n}`).join('\n');
      return `Here is a breakdown by category:\n${lines}`;
    }

    if (msg.startsWith('add ')) {
      const parts = raw.split(' ').slice(1).join(' ').split(',');
      if (parts.length < 3) {
        return 'To add an expense, say: "add 50, Food, 2026-09-20, lunch"';
      }
      const amount = Number(parts[0]!.trim());
      const category = parts[1]!.trim();
      const date = parts[2]!.trim();
      const note = parts[3]?.trim() ?? '';
      if (!amount || amount <= 0) return 'Amount must be a positive number.';

      this.expenseService.addExpense({
        amount,
        category: category as any,
        date,
        note,
      }).subscribe();

      return `Added: $${amount} in ${category} on ${date}.`;
    }

    if (msg.includes('help') || msg.includes('what can you do')) {
      return 'I can help with:\n- "total"\n- "biggest expense"\n- "how many"\n- "categories"\n- "add 50, Food, 2026-09-20, lunch"';
    }

    return 'Sorry, I did not understand. Type "help" to see what I can do.';
  }
}