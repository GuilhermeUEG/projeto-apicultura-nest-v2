import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'ui-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none"
    >
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="flex items-center gap-3 p-4 rounded-xl shadow-lg border text-sm transition-all duration-300 transform pointer-events-auto animate-slide-in-right"
          [ngClass]="{
            'bg-success/10 text-success border-success/20': toast.type === 'success',
            'bg-destructive/10 text-destructive border-destructive/20': toast.type === 'error',
            'bg-info/10 text-info border-info/20': toast.type === 'info',
          }"
        >
          <!-- Success Icon -->
          @if (toast.type === 'success') {
            <svg
              class="w-5 h-5 flex-shrink-0 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }

          <!-- Error Icon -->
          @if (toast.type === 'error') {
            <svg
              class="w-5 h-5 flex-shrink-0 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          }

          <!-- Info Icon -->
          @if (toast.type === 'info') {
            <svg
              class="w-5 h-5 flex-shrink-0 text-info"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }

          <span class="flex-1 font-medium">{{ toast.message }}</span>

          <!-- Dismiss Button -->
          <button
            (click)="toastService.remove(toast.id)"
            class="p-1 rounded-lg text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastComponent {
  toastService = inject(ToastService);
}
