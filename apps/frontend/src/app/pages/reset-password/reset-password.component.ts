import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { parseAuthError } from '../../core/utils/error-handler.util';
import {
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardContentComponent,
} from '../../shared/components/ui/card.component';
import { InputComponent } from '../../shared/components/ui/input.component';
import { ButtonComponent } from '../../shared/components/ui/button.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
    InputComponent,
    ButtonComponent,
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <ui-card class="w-full max-w-md">
        <ui-card-header>
          <ui-card-title class="text-center text-3xl mb-1 text-foreground font-bold">
            Nova Senha
          </ui-card-title>
          <p class="text-muted-foreground text-center">Defina sua nova senha de acesso</p>
        </ui-card-header>

        <ui-card-content>
          @if (invalidToken()) {
            <div
              class="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-6 rounded-xl text-center space-y-3"
            >
              <div class="text-4xl">⚠️</div>
              <p class="font-semibold">Link inválido ou expirado.</p>
              <a routerLink="/forgot-password" ui-button variant="default" class="mt-2"
                >Solicitar novo link</a
              >
            </div>
          }

          @if (successMsg()) {
            <div
              class="bg-success/10 border border-success/20 text-success px-4 py-6 rounded-xl text-center space-y-3"
            >
              <div class="text-4xl">✅</div>
              <p class="font-semibold">{{ successMsg() }}</p>
              <a routerLink="/login" ui-button variant="default" class="mt-2">Fazer Login</a>
            </div>
          }

          @if (!invalidToken() && !successMsg()) {
            <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="space-y-4">
              <ui-input
                label="Nova Senha"
                type="password"
                formControlName="newPassword"
                placeholder="Mín. 6 caracteres"
              ></ui-input>

              @if (errorMsg()) {
                <div
                  class="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm"
                >
                  {{ errorMsg() }}
                </div>
              }

              <!-- Validação: formulário inteiro válido (todos os Validators passaram) | Funcionalidade: ativa/desativa o botão "Salvar Nova Senha" -->
              <button
                ui-button
                variant="default"
                type="submit"
                [disabled]="resetForm.invalid || isLoading()"
                class="w-full mt-2"
              >
                @if (isLoading()) {
                  <span class="mr-2">
                    <svg
                      class="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </span>
                }
                {{ isLoading() ? 'Salvando...' : 'Salvar Nova Senha' }}
              </button>
            </form>
          }
        </ui-card-content>
      </ui-card>
    </div>
  `,
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  resetForm = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  token = '';
  isLoading = signal(false);
  errorMsg = signal('');
  successMsg = signal('');
  invalidToken = signal(false);

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.invalidToken.set(true);
    }
  }

  onSubmit() {
    if (this.resetForm.valid && this.token) {
      this.isLoading.set(true);
      this.errorMsg.set('');

      const { newPassword } = this.resetForm.value;

      this.authService.resetPassword({ token: this.token, newPassword }).subscribe({
        next: (res: any) => {
          this.successMsg.set(res.message);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.errorMsg.set(parseAuthError(err));
          this.isLoading.set(false);
        },
      });
    }
  }
}
