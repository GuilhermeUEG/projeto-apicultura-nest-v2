import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
  selector: 'app-register',
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
            Criar Conta
          </ui-card-title>
          <p class="text-muted-foreground text-center">Preencha os dados para se cadastrar</p>
        </ui-card-header>

        <ui-card-content>
          @if (successMsg()) {
            <div
              class="bg-success/10 border border-success/20 text-success px-4 py-6 rounded-xl text-center space-y-3"
            >
              <p class="text-2xl font-bold">{{ successMsg() }}</p>
              <p class="text-base text-success/80">
                Aguarde o administrador ativar sua conta para poder realizar o login.
              </p>
              <a routerLink="/login" ui-button variant="default" class="mt-2"
                >Voltar para o Login</a
              >
            </div>
          }

          @if (!successMsg()) {
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
              <ui-input
                label="Nome Completo"
                type="text"
                formControlName="nome"
                placeholder="João da Silva"
              ></ui-input>

              <ui-input
                label="E-Mail"
                type="email"
                formControlName="email"
                placeholder="seu@email.com"
              ></ui-input>

              <ui-input
                label="Senha"
                type="password"
                formControlName="password"
                placeholder="Mín. 6 caracteres"
              ></ui-input>

              @if (errorMsg()) {
                <div
                  class="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm"
                >
                  {{ errorMsg() }}
                </div>
              }

              <!-- Validação: formulário inteiro válido (todos os Validators passaram) | Funcionalidade: ativa/desativa o botão "Cadastrar" -->
              <button
                ui-button
                variant="default"
                type="submit"
                [disabled]="registerForm.invalid || isLoading()"
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
                {{ isLoading() ? 'Criando conta...' : 'Cadastrar' }}
              </button>
            </form>

            <p class="mt-8 text-center text-sm text-muted-foreground">
              Já tem uma conta?
              <a
                routerLink="/login"
                class="text-primary hover:underline font-medium transition-colors"
                >Faça login</a
              >
            </p>
          }
        </ui-card-content>
      </ui-card>
    </div>
  `,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  registerForm = this.fb.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isLoading = signal(false);
  errorMsg = signal('');
  successMsg = signal('');

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.errorMsg.set('');

      const { nome, email, password } = this.registerForm.value;

      this.authService.register({ nome, email, senha: password }).subscribe({
        next: () => {
          this.successMsg.set('Cadastro realizado com sucesso!');
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
