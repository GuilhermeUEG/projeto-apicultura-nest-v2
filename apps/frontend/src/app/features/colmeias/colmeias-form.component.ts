import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  selector: 'app-colmeias-form',
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
          routerLink="/apicultura/colmeias"
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
            {{ isEditMode() ? 'Editar Colmeia' : 'Nova Colmeia' }}
          </ui-card-title>
          <p class="text-muted-foreground text-sm">
            {{
              isEditMode()
                ? 'Modifique os dados da colmeia selecionada.'
                : 'Preencha os campos abaixo para criar uma nova colmeia.'
            }}
          </p>
        </ui-card-header>

        <ui-card-content>
          <!-- Loader while fetching details -->
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
              <span class="text-sm text-muted-foreground">Carregando dados da colmeia...</span>
            </div>
          }

          @if (!isLoadingDetails()) {
            <form [formGroup]="colmeiaForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <!-- Alert message for general errors -->
              @if (generalError()) {
                <div
                  class="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm"
                >
                  {{ generalError() }}
                </div>
              }

              <!-- Apiário Dropdown -->
              <div>
                <label
                  for="apiarioId"
                  class="block text-xs font-bold text-muted-foreground uppercase mb-1"
                  >Apiário Pertencente</label
                >
                <!-- Disable changing apiary in edit mode to prevent domain consistency issues or allow if supported. We can disable it if editing. -->
                <select
                  id="apiarioId"
                  formControlName="apiarioId"
                  [attr.disabled]="isEditMode() ? true : null"
                  class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors cursor-pointer"
                  [ngClass]="{ 'opacity-60 cursor-not-allowed': isEditMode() }"
                >
                  <option value="">-- Selecionar Apiário --</option>
                  @for (apiario of apiariosList(); track apiario.id) {
                    <option [value]="apiario.id">
                      {{ apiario.nome }} ({{ apiario.quantidadeColmeias }} colmeias)
                    </option>
                  }
                </select>
                <!-- Field Error -->
                <!-- Validação: erro retornado pelo backend para o campo apiarioId | Funcionalidade: exibe a mensagem abaixo do campo -->
                @if (fieldErrors()['apiarioId']) {
                  <span class="text-xs text-destructive mt-1 block">
                    {{ fieldErrors()['apiarioId'] }}
                  </span>
                }
              </div>

              <!-- Codigo Input -->
              <div>
                <ui-input
                  label="Identificação / Código"
                  type="text"
                  formControlName="codigo"
                  placeholder="Ex: CLM-001"
                ></ui-input>
                <!-- Field Error -->
                <!-- Validação: erro retornado pelo backend para o campo codigo | Funcionalidade: exibe a mensagem abaixo do campo -->
                @if (fieldErrors()['codigo']) {
                  <span class="text-xs text-destructive mt-1 block">
                    {{ fieldErrors()['codigo'] }}
                  </span>
                }
              </div>

              <!-- Tipo Input -->
              <div>
                <ui-input
                  label="Tipo de Colmeia"
                  type="text"
                  formControlName="tipo"
                  placeholder="Ex: Langstroth, Dadant"
                ></ui-input>
                <!-- Field Error -->
                <!-- Validação: erro retornado pelo backend para o campo tipo | Funcionalidade: exibe a mensagem abaixo do campo -->
                @if (fieldErrors()['tipo']) {
                  <span class="text-xs text-destructive mt-1 block">
                    {{ fieldErrors()['tipo'] }}
                  </span>
                }
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <a
                  routerLink="/apicultura/colmeias"
                  ui-button
                  variant="outline"
                  [ngClass]="{ 'pointer-events-none opacity-60': isSubmitting() }"
                >
                  Cancelar
                </a>
                <!-- Validação: formulário inteiro válido (todos os Validators passaram) | Funcionalidade: ativa/desativa o botão "Criar Colmeia"/"Salvar Alterações" -->
                <button
                  ui-button
                  variant="default"
                  type="submit"
                  [disabled]="colmeiaForm.invalid || isSubmitting()"
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
                  {{ isEditMode() ? 'Salvar Alterações' : 'Criar Colmeia' }}
                </button>
              </div>
            </form>
          }
        </ui-card-content>
      </ui-card>
    </div>
  `,
})
export class ColmeiasFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private apiculturaService = inject(ApiculturaService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  colmeiaForm = this.fb.group({
    codigo: ['', [Validators.required]],
    tipo: ['', [Validators.required]],
    apiarioId: ['', [Validators.required]],
  });

  apiariosList = signal<Apiario[]>([]);
  isEditMode = signal(false);
  isLoadingDetails = signal(false);
  isSubmitting = signal(false);
  colmeiaId = signal<string | null>(null);

  generalError = signal('');
  fieldErrors = signal<Record<string, string>>({});

  ngOnInit() {
    this.loadApiarios();

    const id = this.route.snapshot.paramMap.get('id');
    const queryApiarioId = this.route.snapshot.queryParamMap.get('apiarioId');

    if (id) {
      this.isEditMode.set(true);
      this.colmeiaId.set(id);
      this.loadColmeiaDetails(id);
    } else if (queryApiarioId) {
      this.colmeiaForm.patchValue({ apiarioId: queryApiarioId });
    }
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

  loadColmeiaDetails(id: string) {
    this.isLoadingDetails.set(true);
    this.apiculturaService.getColmeiaById(id).subscribe({
      next: (colmeia) => {
        this.colmeiaForm.patchValue({
          codigo: colmeia.codigo,
          tipo: colmeia.tipo,
          apiarioId: colmeia.apiarioId,
        });
        this.isLoadingDetails.set(false);
      },
      error: (err) => {
        this.isLoadingDetails.set(false);
        this.toastService.error(
          err.status === 404 ? 'Colmeia não encontrada.' : extractBackendError(err),
        );
        this.router.navigate(['/apicultura/colmeias']);
      },
    });
  }

  onSubmit() {
    if (this.colmeiaForm.valid) {
      this.isSubmitting.set(true);
      this.generalError.set('');
      this.fieldErrors.set({});

      const data = {
        codigo: this.colmeiaForm.value.codigo!,
        tipo: this.colmeiaForm.value.tipo!,
        apiarioId: this.colmeiaForm.value.apiarioId!,
      };

      const request$ = this.isEditMode()
        ? this.apiculturaService.updateColmeia(this.colmeiaId()!, data)
        : this.apiculturaService.addColmeia(data.apiarioId, data);

      request$.subscribe({
        next: () => {
          this.toastService.success(
            this.isEditMode() ? 'Colmeia atualizada com sucesso!' : 'Colmeia criada com sucesso!',
          );
          this.isSubmitting.set(false);
          this.router.navigate(['/apicultura/colmeias'], {
            queryParams: { apiarioId: data.apiarioId },
          });
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
