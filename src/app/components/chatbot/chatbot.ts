import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AiChatbotService, ChatMessage } from '../../services/ai-chatbot';

@Component({
  selector: 'app-chatbot',
  imports: [FormsModule],
  template: `
    <section class="chatbot">
      <h2>💬 Expense Assistant</h2>

      <div class="messages">
        @for (m of messages(); track $index) {
          <div class="msg" [class.user]="m.role === 'user'" [class.bot]="m.role === 'bot'">
            <strong>{{ m.role === 'user' ? 'You' : 'Bot' }}:</strong>
            <span>{{ m.text }}</span>
          </div>
        }
        @if (loading()) {
          <div class="msg bot"><em>Bot is typing...</em></div>
        }
      </div>

      <div class="input-row">
        <input
          type="text"
          [(ngModel)]="draft"
          (keyup.enter)="send()"
          placeholder="Ask me about your expenses..."
        />
        <button (click)="send()" [disabled]="loading() || !draft.trim()">Send</button>
      </div>
    </section>
  `,
  styles: [`
    .chatbot { max-width: 700px; margin: 2rem auto; font-family: system-ui, sans-serif; border: 1px solid #e5e7eb; border-radius: 10px; padding: 1rem; }
    h2 { margin: 0 0 .75rem; }
    .messages { max-height: 320px; overflow-y: auto; display: flex; flex-direction: column; gap: .5rem; padding: .5rem 0; }
    .msg { padding: .5rem .75rem; border-radius: 8px; font-size: .95rem; white-space: pre-wrap; }
    .msg.user { background: #dbeafe; align-self: flex-end; }
    .msg.bot { background: #f3f4f6; align-self: flex-start; }
    .input-row { display: flex; gap: .5rem; margin-top: .75rem; }
    .input-row input { flex: 1; padding: .5rem; border: 1px solid #ccc; border-radius: 6px; }
    .input-row button { padding: .5rem 1rem; border: none; border-radius: 6px; background: #2563eb; color: white; font-weight: 600; cursor: pointer; }
    .input-row button:disabled { background: #93c5fd; cursor: not-allowed; }
  `],
})
export class Chatbot {
  private ai = inject(AiChatbotService);

  messages = signal<ChatMessage[]>([
    { role: 'bot', text: 'Hi! Ask me about your expenses. Type "help" to see what I can do.' },
  ]);
  loading = signal(false);
  draft = '';

  async send(): Promise<void> {
    const text = this.draft.trim();
    if (!text || this.loading()) return;

    this.messages.update(m => [...m, { role: 'user', text }]);
    this.draft = '';
    this.loading.set(true);

    try {
      const reply = await this.ai.send(text);
      this.messages.update(m => [...m, { role: 'bot', text: reply }]);
    } finally {
      this.loading.set(false);
    }
  }
}