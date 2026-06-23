import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/components/ui/button.component';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div
        class="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl p-8 text-center"
      >
        <div
          class="w-20 h-20 bg-destructive/10 border border-destructive/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg
            class="w-10 h-10 text-destructive"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            ></path>
          </svg>
        </div>

        <h2 class="text-3xl font-bold mb-3 text-foreground">Acesso Negado</h2>
        <p class="text-muted-foreground mb-8">
          Você não tem permissão para acessar esta página. Faça login com uma conta autorizada ou
          volte para uma área permitida.
        </p>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <a routerLink="/login" ui-button variant="default" class="w-full sm:w-auto">
            Ir para o Login
          </a>
          <a routerLink="/dashboard" ui-button variant="outline" class="w-full sm:w-auto">
            Voltar ao Dashboard
          </a>
        </div>

        <p class="mt-8 text-xs text-muted-foreground flex items-center justify-center gap-1.5">
          <span>🐝</span> Sistema de Gestão de Apicultura — UEG
        </p>
      </div>
    </div>
  `,
})
export class AccessDeniedComponent {}
