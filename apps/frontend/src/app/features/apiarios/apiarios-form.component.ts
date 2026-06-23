import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiculturaService } from '../../core/services/apicultura.service';
import { ToastService } from '../../shared/components/ui/toast.service';
import { extractBackendError, extractFieldErrors } from '../../core/utils/error-handler.util';
import {
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardContentComponent,
} from '../../shared/components/ui/card.component';
import { InputComponent } from '../../shared/components/ui/input.component';
import { ButtonComponent } from '../../shared/components/ui/button.component';

@Component({
  selector: 'app-apiarios-form',
  standalone: true,
  imports: [
    CommonModule,
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
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
      <!-- Back Link -->
      <div class="mb-6">
        <a
          routerLink="/apicultura/apiarios"
          class="text-sm font-semibold text-primary hover:underline transition-colors flex items-center gap-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Voltar para listagem
        </a>
      </div>

      <ui-card>
        <ui-card-header>
          <ui-card-title
            class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-600"
          >
            {{ isEditMode() ? 'Editar Apiário' : 'Novo Apiário' }}
          </ui-card-title>
          <p class="text-muted-foreground text-sm">
            {{
              isEditMode()
                ? 'Modifique os dados do apiário selecionado.'
                : 'Preencha os campos abaixo para criar um novo apiário.'
            }}
          </p>
        </ui-card-header>

        <ui-card-content>
          <!-- Loader while fetching editing apiary -->
          @if (isLoadingDetails()) {
            <div class="py-12 flex flex-col items-center justify-center gap-2">
              <svg
                class="animate-spin h-8 w-8 text-amber-500"
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
              <span class="text-sm text-muted-foreground">Carregando dados do apiário...</span>
            </div>
          }

          @if (!isLoadingDetails()) {
            <form [formGroup]="apiarioForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <!-- Alert message for general errors -->
              @if (generalError()) {
                <div
                  class="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm"
                >
                  {{ generalError() }}
                </div>
              }

              <!-- Name Input -->
              <div>
                <ui-input
                  label="Nome do Apiário"
                  type="text"
                  formControlName="nome"
                  placeholder="Ex: Apiário Vale do Mel"
                ></ui-input>
                <!-- Field Error -->
                <!-- Validação: erro retornado pelo backend para o campo nome | Funcionalidade: exibe a mensagem abaixo do campo -->
                @if (fieldErrors()['nome']) {
                  <span class="text-xs text-destructive mt-1 block">
                    {{ fieldErrors()['nome'] }}
                  </span>
                }
              </div>

              <!-- Localização Input -->
              <div>
                <ui-input
                  label="Localização / Endereço"
                  type="text"
                  formControlName="localizacao"
                  placeholder="Ex: Fazenda Santa Maria, Km 12"
                ></ui-input>
                <!-- Field Error -->
                <!-- Validação: erro retornado pelo backend para o campo localizacao | Funcionalidade: exibe a mensagem abaixo do campo -->
                @if (fieldErrors()['localizacao']) {
                  <span class="text-xs text-destructive mt-1 block">
                    {{ fieldErrors()['localizacao'] }}
                  </span>
                }
              </div>

              <!-- Quantidade de Colmeias -->
              <div>
                <ui-input
                  label="Quantidade Inicial de Colmeias"
                  type="number"
                  formControlName="quantidadeColmeias"
                  placeholder="Ex: 10"
                ></ui-input>
                <p class="text-xs text-muted-foreground mt-1">
                  Gera automaticamente as colmeias iniciais vinculadas a este apiário.
                </p>
                <!-- Field Error -->
                <!-- Validação: erro retornado pelo backend para o campo quantidadeColmeias | Funcionalidade: exibe a mensagem abaixo do campo -->
                @if (fieldErrors()['quantidadeColmeias']) {
                  <span class="text-xs text-destructive mt-1 block">
                    {{ fieldErrors()['quantidadeColmeias'] }}
                  </span>
                }
              </div>

              <!-- Data Fundação Input -->
              <div>
                <ui-input
                  label="Data de Fundação (DD/MM/YYYY)"
                  type="text"
                  formControlName="dataFundacao"
                  placeholder="Ex: 25/05/2020"
                ></ui-input>
                <!-- Field Error -->
                <!-- Validação: erro retornado pelo backend para o campo dataFundacao | Funcionalidade: exibe a mensagem abaixo do campo -->
                @if (fieldErrors()['dataFundacao']) {
                  <span class="text-xs text-destructive mt-1 block">
                    {{ fieldErrors()['dataFundacao'] }}
                  </span>
                }
              </div>

              <!-- Operacional Status -->
              <div
                class="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-muted/20"
              >
                <input
                  type="checkbox"
                  id="operacional"
                  formControlName="operacional"
                  class="w-5 h-5 rounded border-border text-amber-500 focus:ring-amber-500 focus:ring-offset-2 transition-colors cursor-pointer"
                />
                <label
                  for="operacional"
                  class="text-sm font-semibold text-foreground cursor-pointer select-none"
                >
                  Apiário Operacional (Ativo)
                </label>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <a
                  routerLink="/apicultura/apiarios"
                  ui-button
                  variant="outline"
                  [ngClass]="{ 'pointer-events-none opacity-60': isSubmitting() }"
                >
                  Cancelar
                </a>
                <!-- Validação: formulário inteiro válido (todos os Validators passaram) | Funcionalidade: ativa/desativa o botão "Criar Apiário"/"Salvar Alterações" -->
                <button
                  ui-button
                  variant="default"
                  type="submit"
                  [disabled]="apiarioForm.invalid || isSubmitting()"
                >
                  @if (isSubmitting()) {
                    <span class="mr-2">
                      <svg
                        class="animate-spin h-4 w-4 text-background"
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
                  {{ isEditMode() ? 'Salvar Alterações' : 'Criar Apiário' }}
                </button>
              </div>
            </form>
          }
        </ui-card-content>
      </ui-card>
    </div>
  `,
})
export class ApiariosFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private apiculturaService = inject(ApiculturaService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  apiarioForm = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    localizacao: ['', [Validators.required, Validators.minLength(3)]],
    quantidadeColmeias: [10, [Validators.required, Validators.min(0)]],
    dataFundacao: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}\/\d{4}$/)]],
    operacional: [true],
  });

  isEditMode = signal(false);
  isLoadingDetails = signal(false);
  isSubmitting = signal(false);
  apiarioId = signal<string | null>(null);

  generalError = signal('');
  fieldErrors = signal<Record<string, string>>({});

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.apiarioId.set(id);
      this.loadApiarioDetails(id);
    }
  }

  private formatDateToBr(dateStr: string | Date | undefined): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    return `${day}/${mes}/${ano}`;
  }

  loadApiarioDetails(id: string) {
    this.isLoadingDetails.set(true);
    this.apiculturaService.getApiarioById(id).subscribe({
      next: (apiario) => {
        this.apiarioForm.patchValue({
          nome: apiario.nome,
          localizacao: apiario.localizacao,
          quantidadeColmeias: apiario.quantidadeColmeias,
          dataFundacao: this.formatDateToBr(apiario.dataFundacao),
          operacional: apiario.operacional,
        });
        this.isLoadingDetails.set(false);
      },
      error: (err) => {
        this.isLoadingDetails.set(false);
        this.toastService.error(
          err.status === 404 ? 'Apiário não encontrado.' : extractBackendError(err),
        );
        this.router.navigate(['/apicultura/apiarios']);
      },
    });
  }

  onSubmit() {
    if (this.apiarioForm.valid) {
      this.isSubmitting.set(true);
      this.generalError.set('');
      this.fieldErrors.set({});

      const data = {
        nome: this.apiarioForm.value.nome!,
        localizacao: this.apiarioForm.value.localizacao!,
        quantidadeColmeias: Number(this.apiarioForm.value.quantidadeColmeias!),
        dataFundacao: this.apiarioForm.value.dataFundacao!,
        operacional: !!this.apiarioForm.value.operacional,
      };

      const request$ = this.isEditMode()
        ? this.apiculturaService.updateApiario(this.apiarioId()!, data)
        : this.apiculturaService.createApiario(data);

      request$.subscribe({
        next: () => {
          this.toastService.success(
            this.isEditMode() ? 'Apiário atualizado com sucesso!' : 'Apiário criado com sucesso!',
          );
          this.isSubmitting.set(false);
          this.router.navigate(['/apicultura/apiarios']);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.generalError.set(extractBackendError(err));
          this.fieldErrors.set(extractFieldErrors(err));
        },
      });
    }
  }
}
