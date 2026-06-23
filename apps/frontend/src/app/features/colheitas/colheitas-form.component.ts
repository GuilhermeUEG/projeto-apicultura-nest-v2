import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiculturaService, Apiario } from '../../core/services/apicultura.service';
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
  selector: 'app-colheitas-form',
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
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
      <!-- Back Link -->
      <div class="mb-6">
        <a
          routerLink="/apicultura/colheitas"
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
          Voltar para colheitas
        </a>
      </div>

      <ui-card>
        <ui-card-header>
          <ui-card-title
            class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-600 flex items-center gap-2"
          >
            <span
              >🍯 {{ isEditMode() ? 'Editar Colheita de Mel' : 'Registrar Colheita de Mel' }}</span
            >
          </ui-card-title>
          <p class="text-muted-foreground text-sm">
            {{
              isEditMode()
                ? 'Altere os dados da colheita. As regras de negócio serão revalidadas no backend.'
                : 'Selecione o apiário produtor e insira os dados da colheita. As regras de negócio serão validadas no backend.'
            }}
          </p>
        </ui-card-header>

        <ui-card-content>
          <form [formGroup]="colheitaForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- General success block -->
            @if (successMsg()) {
              <div
                class="bg-success/10 border border-success/20 text-success px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                <span>✅</span> {{ successMsg() }}
              </div>
            }

            <!-- General error block (Business rules violation displays here prominently) -->
            @if (generalError()) {
              <div
                class="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl text-sm flex flex-col gap-1.5 shadow-sm animate-in fade-in duration-200"
              >
                <span class="font-bold flex items-center gap-1.5">
                  <span>⚠️</span> Falha na Validação (Regra de Negócio)
                </span>
                <p class="text-destructive/90">{{ generalError() }}</p>
              </div>
            }

            <!-- Apiário Selector -->
            <div>
              <label
                for="apiarioId"
                class="block text-xs font-bold text-muted-foreground uppercase mb-1"
                >Apiário Produtor</label
              >
              <select
                id="apiarioId"
                formControlName="apiarioId"
                [attr.disabled]="isEditMode() ? '' : null"
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="">-- Selecionar Apiário --</option>
                @for (apiario of apiariosList(); track apiario.id) {
                  <option [value]="apiario.id">
                    {{ apiario.nome }} ({{ apiario.quantidadeColmeias }} colmeias,
                    {{ apiario.operacional ? 'Operacional' : 'Inativo' }})
                  </option>
                }
              </select>
              <!-- Validação: erro retornado pelo backend para o campo apiarioId | Funcionalidade: exibe a mensagem abaixo do campo -->
              @if (fieldErrors()['apiarioId']) {
                <span class="text-xs text-destructive mt-1 block">
                  {{ fieldErrors()['apiarioId'] }}
                </span>
              }
            </div>

            <!-- Florada Selector -->
            <div>
              <label
                for="tipoFlorada"
                class="block text-xs font-bold text-muted-foreground uppercase mb-1"
                >Tipo de Florada</label
              >
              <select
                id="tipoFlorada"
                formControlName="tipoFlorada"
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors cursor-pointer"
              >
                <option value="">-- Selecionar Florada --</option>
                @for (florada of floradasPermitidas; track florada) {
                  <option [value]="florada">
                    {{ florada }}
                  </option>
                }
              </select>
              <!-- Validação: erro retornado pelo backend para o campo tipoFlorada | Funcionalidade: exibe a mensagem abaixo do campo -->
              @if (fieldErrors()['tipoFlorada']) {
                <span class="text-xs text-destructive mt-1 block">
                  {{ fieldErrors()['tipoFlorada'] }}
                </span>
              }
            </div>

            <!-- Data Colheita Input -->
            <div>
              <ui-input
                label="Data da Colheita"
                type="text"
                formControlName="dataColheita"
                placeholder="Ex: DD/MM/YYYY"
              ></ui-input>
              <p class="text-xs text-muted-foreground mt-1">
                Deve ser informada no formato brasileiro DD/MM/YYYY e não pode ser uma data futura.
              </p>
              <!-- Validação: erro retornado pelo backend para o campo dataColheita | Funcionalidade: exibe a mensagem abaixo do campo -->
              @if (fieldErrors()['dataColheita']) {
                <span class="text-xs text-destructive mt-1 block">
                  {{ fieldErrors()['dataColheita'] }}
                </span>
              }
            </div>

            <!-- Volume em Litros -->
            <div>
              <ui-input
                label="Volume Colhido (Litros)"
                type="number"
                formControlName="volumeLitros"
                placeholder="Ex: 12"
              ></ui-input>
              <!-- Validação: erro retornado pelo backend para o campo volumeLitros | Funcionalidade: exibe a mensagem abaixo do campo -->
              @if (fieldErrors()['volumeLitros']) {
                <span class="text-xs text-destructive mt-1 block">
                  {{ fieldErrors()['volumeLitros'] }}
                </span>
              }
            </div>

            <!-- Pureza Alta Checkbox -->
            <div class="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-muted/20">
              <input
                type="checkbox"
                id="purezaAlta"
                formControlName="purezaAlta"
                class="w-5 h-5 rounded border-border text-amber-500 focus:ring-amber-500 focus:ring-offset-2 transition-colors cursor-pointer"
              />
              <label
                for="purezaAlta"
                class="text-sm font-semibold text-foreground cursor-pointer select-none flex items-center gap-1.5"
              >
                <span>⭐</span> Mel de Alta Pureza
              </label>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <!-- Validação: formulário inteiro válido (todos os Validators passaram) | Funcionalidade: ativa/desativa o botão "Registrar Colheita"/"Salvar Alterações" -->
              <button
                ui-button
                variant="default"
                type="submit"
                class="w-full sm:w-auto"
                [disabled]="colheitaForm.invalid || isSubmitting()"
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
                {{ isEditMode() ? 'Salvar Alterações' : 'Registrar Colheita' }}
              </button>
            </div>
          </form>
        </ui-card-content>
      </ui-card>
    </div>
  `,
})
export class ColheitasFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private apiculturaService = inject(ApiculturaService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  colheitaForm = this.fb.group({
    apiarioId: ['', [Validators.required]],
    tipoFlorada: ['', [Validators.required]],
    dataColheita: [this.getTodayBrDate(), [Validators.required]],
    volumeLitros: [0, [Validators.required, Validators.min(0.1)]],
    purezaAlta: [false],
  });

  apiariosList = signal<Apiario[]>([]);
  isSubmitting = signal(false);
  isEditMode = signal(false);
  colheitaId = signal<string | null>(null);

  successMsg = signal('');
  generalError = signal('');
  fieldErrors = signal<Record<string, string>>({});

  readonly floradasPermitidas = ['Silvestre', 'Citros', 'Eucalipto', 'Flores Silvestres', 'Acácia'];

  ngOnInit() {
    this.loadApiarios();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.colheitaId.set(id);
      this.loadColheita(id);
    }
  }

  getTodayBrDate(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
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

  loadColheita(id: string) {
    this.apiculturaService.getColheitaById(id).subscribe({
      next: (colheita) => {
        this.colheitaForm.patchValue({
          apiarioId: colheita.apiario?.id ?? '',
          tipoFlorada: colheita.tipoFlorada,
          dataColheita: this.formatDateToBr(colheita.dataColheita),
          volumeLitros: colheita.volumeLitros,
          purezaAlta: colheita.purezaAlta,
        });
      },
      error: (err) => {
        this.toastService.error(
          err.status === 404 ? 'Colheita não encontrada.' : extractBackendError(err),
        );
        this.router.navigate(['/apicultura/colheitas']);
      },
    });
  }

  loadApiarios() {
    this.apiculturaService.getApiarios().subscribe({
      next: (apiarios) => {
        this.apiariosList.set(apiarios);
      },
      error: (err) => {
        this.generalError.set(extractBackendError(err));
        this.toastService.error('Não foi possível carregar a lista de apiários.');
      },
    });
  }

  onSubmit() {
    if (this.colheitaForm.valid) {
      this.isSubmitting.set(true);
      this.generalError.set('');
      this.successMsg.set('');
      this.fieldErrors.set({});

      const apiarioId = this.colheitaForm.value.apiarioId!;
      const data = {
        tipoFlorada: this.colheitaForm.value.tipoFlorada!,
        dataColheita: this.colheitaForm.value.dataColheita!,
        volumeLitros: Number(this.colheitaForm.value.volumeLitros!),
        purezaAlta: !!this.colheitaForm.value.purezaAlta,
      };

      const request$ = this.isEditMode()
        ? this.apiculturaService.updateColheita(this.colheitaId()!, data)
        : this.apiculturaService.registrarColheita(apiarioId, data);

      request$.subscribe({
        next: () => {
          this.toastService.success(
            this.isEditMode()
              ? 'Colheita atualizada com sucesso!'
              : 'Colheita registrada com sucesso!',
          );
          this.isSubmitting.set(false);
          this.router.navigate(['/apicultura/colheitas']);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.generalError.set(extractBackendError(err));
          this.fieldErrors.set(extractFieldErrors(err));
          this.toastService.error('Erro de validação. Veja os detalhes na tela.');
        },
      });
    }
  }
}
