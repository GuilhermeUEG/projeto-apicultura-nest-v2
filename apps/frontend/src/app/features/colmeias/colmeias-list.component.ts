import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiculturaService, Apiario, Colmeia } from '../../core/services/apicultura.service';
import { ToastService } from '../../shared/components/ui/toast.service';
import { extractBackendError } from '../../core/utils/error-handler.util';
import { CardComponent } from '../../shared/components/ui/card.component';
import { ButtonComponent } from '../../shared/components/ui/button.component';
import { BadgeComponent } from '../../shared/components/ui/badge.component';

@Component({
  selector: 'app-colmeias-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CardComponent, ButtonComponent, BadgeComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
      <!-- Header -->
      <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1
            class="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2"
          >
            <span>📦 Colmeias</span>
          </h1>
          <p class="text-muted-foreground mt-1">Gerencie as colmeias vinculadas a cada apiário.</p>
        </div>
        <div class="flex items-center gap-2">
          <button
            ui-button
            variant="outline"
            (click)="openBulkModal()"
            [disabled]="!selectedApiarioId()"
            class="flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              ></path>
            </svg>
            <span>Cadastrar em Massa</span>
          </button>
          <a
            [routerLink]="['/apicultura/colmeias/novo']"
            [queryParams]="{ apiarioId: selectedApiarioId() }"
            ui-button
            variant="default"
            class="flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            <span>Nova Colmeia</span>
          </a>
        </div>
      </div>

      <!-- Apiário Selector -->
      <ui-card class="mb-6 p-4">
        <div class="flex flex-col sm:flex-row items-center gap-4">
          <div class="w-full sm:max-w-xs">
            <label
              for="apiarioSelect"
              class="block text-xs font-bold text-muted-foreground uppercase mb-1"
              >Selecione o Apiário</label
            >
            <select
              id="apiarioSelect"
              [ngModel]="selectedApiarioId()"
              (ngModelChange)="onApiarioChange($event)"
              class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors cursor-pointer"
            >
              <option value="">-- Selecionar Apiário --</option>
              @for (apiario of apiariosList(); track apiario.id) {
                <option [value]="apiario.id">
                  {{ apiario.nome }} ({{ apiario.quantidadeColmeias }} colmeias)
                </option>
              }
            </select>
          </div>

          <button
            ui-button
            variant="outline"
            (click)="loadColmeias()"
            [disabled]="isLoading() || !selectedApiarioId()"
            class="ml-auto mt-4 sm:mt-0 flex items-center gap-2"
          >
            <svg
              class="w-4 h-4"
              [ngClass]="{ 'animate-spin': isLoading() }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2"
              ></path>
            </svg>
            <span>Atualizar</span>
          </button>
        </div>
      </ui-card>

      <!-- Feedback Banner on Error -->
      @if (errorMsg()) {
        <div
          class="mb-6 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3.5 rounded-xl flex items-center justify-between shadow-sm"
        >
          <div class="flex items-center gap-2">
            <svg
              class="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
            <span class="font-medium text-sm">{{ errorMsg() }}</span>
          </div>
        </div>
      }

      <!-- Main Content Card -->
      <ui-card>
        <!-- State: No Apiary Selected -->
        @if (!selectedApiarioId()) {
          <div class="py-20 flex flex-col items-center justify-center text-center p-6">
            <svg
              class="w-16 h-16 text-muted-foreground mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z"
              ></path>
            </svg>
            <h3 class="text-lg font-bold text-foreground mb-1">Selecione um apiário</h3>
            <p class="text-muted-foreground text-sm max-w-sm">
              Escolha um dos apiários no menu acima para gerenciar e listar suas colmeias.
            </p>
          </div>
        }

        <!-- State: Loading -->
        @if (isLoading() && selectedApiarioId()) {
          <div class="py-20 flex flex-col items-center justify-center gap-3">
            <svg
              class="animate-spin h-8 w-8 text-primary"
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
            <span class="text-muted-foreground text-sm font-medium">Buscando colmeias...</span>
          </div>
        }

        <!-- State: Empty List -->
        @if (!isLoading() && selectedApiarioId() && colmeiasList().length === 0) {
          <div class="py-20 flex flex-col items-center justify-center text-center p-6">
            <svg
              class="w-16 h-16 text-muted-foreground mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              ></path>
            </svg>
            <h3 class="text-lg font-bold text-foreground mb-1">Nenhuma colmeia neste apiário</h3>
            <p class="text-muted-foreground text-sm max-w-sm">
              Adicione uma nova colmeia para começar a monitorar a produção.
            </p>
          </div>
        }

        <!-- Desktop Table View -->
        @if (!isLoading() && selectedApiarioId() && colmeiasList().length > 0) {
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-border hidden md:table">
              <thead class="bg-muted/50">
                <tr>
                  <th
                    class="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Identificação / Código
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Tipo da Colmeia
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Apiário (Pai)
                  </th>
                  <th
                    class="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border bg-transparent">
                @for (colmeia of colmeiasList(); track colmeia.id) {
                  <tr class="hover:bg-muted/50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center gap-3">
                        <div
                          class="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-600 font-bold"
                        >
                          📦
                        </div>
                        <div>
                          <div class="text-sm font-semibold text-foreground">
                            {{ colmeia.codigo }}
                          </div>
                          <div class="text-xs text-muted-foreground">ID: {{ colmeia.id }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <ui-badge variant="secondary">
                        {{ colmeia.tipo }}
                      </ui-badge>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {{ selectedApiarioNome() }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex items-center justify-end gap-2">
                        <a
                          [routerLink]="['/apicultura/colmeias', colmeia.id, 'editar']"
                          ui-button
                          variant="outline"
                          size="sm"
                        >
                          Editar
                        </a>
                        <button
                          ui-button
                          variant="destructive"
                          size="sm"
                          (click)="openDeleteModal(colmeia)"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>

            <!-- Mobile Cards View -->
            <div class="md:hidden divide-y divide-border">
              @for (colmeia of colmeiasList(); track colmeia.id) {
                <div class="p-5 space-y-4 hover:bg-muted/50 transition-colors">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-600 font-bold"
                    >
                      📦
                    </div>
                    <div>
                      <div class="text-sm font-semibold text-foreground">{{ colmeia.codigo }}</div>
                      <div class="text-xs text-muted-foreground">ID: {{ colmeia.id }}</div>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-muted-foreground">Tipo da Colmeia:</span>
                    <ui-badge variant="secondary">
                      {{ colmeia.tipo }}
                    </ui-badge>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-muted-foreground">Apiário (Pai):</span>
                    <span class="text-sm font-medium text-foreground">{{
                      selectedApiarioNome()
                    }}</span>
                  </div>
                  <div class="flex items-center gap-2 pt-2 border-t border-border">
                    <a
                      [routerLink]="['/apicultura/colmeias', colmeia.id, 'editar']"
                      ui-button
                      variant="outline"
                      size="sm"
                      class="flex-1 text-center"
                    >
                      Editar
                    </a>
                    <button
                      ui-button
                      variant="destructive"
                      size="sm"
                      class="flex-1"
                      (click)="openDeleteModal(colmeia)"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </ui-card>
    </div>

    <!-- Delete Confirmation Modal -->
    @if (showDeleteModal()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity"
      >
        <div
          class="relative w-full max-w-md bg-background border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200"
        >
          <div class="p-6">
            <h3 class="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
              <span class="text-destructive">⚠️</span> Confirmar Exclusão
            </h3>
            <p class="text-sm text-muted-foreground">
              Tem certeza de que deseja excluir a colmeia
              <strong class="text-foreground">"{{ selectedColmeia()?.codigo }}"</strong>? Esta ação
              não poderá ser desfeita.
            </p>
          </div>
          <div class="px-6 py-4 bg-muted/40 border-t border-border flex justify-end gap-3">
            <button
              ui-button
              variant="outline"
              (click)="closeDeleteModal()"
              [disabled]="isDeleting()"
            >
              Cancelar
            </button>
            <button
              ui-button
              variant="destructive"
              (click)="confirmDelete()"
              [disabled]="isDeleting()"
            >
              {{ isDeleting() ? 'Excluindo...' : 'Confirmar Exclusão' }}
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Bulk Creation Modal -->
    @if (showBulkModal()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity"
      >
        <div
          class="relative w-full max-w-md bg-background border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200"
        >
          <div class="p-6 space-y-4">
            <h3 class="text-lg font-bold text-foreground flex items-center gap-2">
              <span class="text-primary">📦</span> Cadastrar Colmeias em Massa
            </h3>
            <p class="text-sm text-muted-foreground">
              Crie várias colmeias de uma vez no apiário
              <strong class="text-foreground">{{ selectedApiarioNome() }}</strong
              >. Os códigos serão gerados automaticamente em sequência.
            </p>

            @if (bulkError()) {
              <div
                class="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm"
              >
                {{ bulkError() }}
              </div>
            }

            <div>
              <label class="block text-xs font-bold text-muted-foreground uppercase mb-1"
                >Quantidade</label
              >
              <input
                type="number"
                min="1"
                max="100"
                [ngModel]="bulkQuantidade()"
                (ngModelChange)="bulkQuantidade.set($event)"
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-muted-foreground uppercase mb-1"
                >Tipo da Colmeia</label
              >
              <input
                type="text"
                placeholder="Ex: Langstroth"
                [ngModel]="bulkTipo()"
                (ngModelChange)="bulkTipo.set($event)"
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-muted-foreground uppercase mb-1"
                >Prefixo do Código</label
              >
              <input
                type="text"
                placeholder="Ex: CLM"
                [ngModel]="bulkCodigoBase()"
                (ngModelChange)="bulkCodigoBase.set($event)"
                class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
              />
              <p class="text-xs text-muted-foreground mt-1">
                Gera códigos como {{ bulkCodigoBase() || 'CLM' }}-001,
                {{ bulkCodigoBase() || 'CLM' }}-002, ...
              </p>
            </div>
          </div>
          <div class="px-6 py-4 bg-muted/40 border-t border-border flex justify-end gap-3">
            <button
              ui-button
              variant="outline"
              (click)="closeBulkModal()"
              [disabled]="isBulkSubmitting()"
            >
              Cancelar
            </button>
            <button
              ui-button
              variant="default"
              (click)="confirmBulk()"
              [disabled]="isBulkSubmitting() || !bulkTipo().trim() || bulkQuantidade() < 1"
            >
              {{
                isBulkSubmitting()
                  ? 'Cadastrando...'
                  : 'Cadastrar ' + bulkQuantidade() + ' colmeias'
              }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ColmeiasListComponent implements OnInit {
  apiculturaService = inject(ApiculturaService);
  toastService = inject(ToastService);

  apiariosList = signal<Apiario[]>([]);
  colmeiasList = signal<Colmeia[]>([]);

  selectedApiarioId = signal('');
  isLoading = signal(false);
  errorMsg = signal('');

  selectedApiarioNome = computed(() => {
    const id = this.selectedApiarioId();
    return this.apiariosList().find((a) => a.id === id)?.nome ?? '—';
  });

  showDeleteModal = signal(false);
  selectedColmeia = signal<Colmeia | null>(null);
  isDeleting = signal(false);

  showBulkModal = signal(false);
  isBulkSubmitting = signal(false);
  bulkError = signal('');
  bulkQuantidade = signal(5);
  bulkTipo = signal('Langstroth');
  bulkCodigoBase = signal('CLM');

  ngOnInit() {
    this.loadApiarios();
  }

  openBulkModal() {
    if (!this.selectedApiarioId()) return;
    this.bulkError.set('');
    this.bulkQuantidade.set(5);
    this.bulkTipo.set('Langstroth');
    this.bulkCodigoBase.set('CLM');
    this.showBulkModal.set(true);
  }

  closeBulkModal() {
    this.showBulkModal.set(false);
  }

  confirmBulk() {
    const apiarioId = this.selectedApiarioId();
    const quantidade = Number(this.bulkQuantidade());
    const tipo = this.bulkTipo().trim();
    const codigoBase = this.bulkCodigoBase().trim() || undefined;

    if (!apiarioId || !tipo || quantidade < 1) return;

    this.isBulkSubmitting.set(true);
    this.bulkError.set('');

    this.apiculturaService.addColmeiasBulk(apiarioId, { quantidade, tipo, codigoBase }).subscribe({
      next: (criadas) => {
        this.isBulkSubmitting.set(false);
        this.showBulkModal.set(false);
        this.toastService.success(`${criadas.length} colmeia(s) cadastrada(s) com sucesso!`);
        this.loadColmeias();
      },
      error: (err) => {
        this.isBulkSubmitting.set(false);
        this.bulkError.set(extractBackendError(err));
      },
    });
  }

  loadApiarios() {
    this.apiculturaService.getApiarios().subscribe({
      next: (apiarios) => {
        this.apiariosList.set(apiarios);
      },
      error: (err) => {
        this.errorMsg.set(extractBackendError(err));
      },
    });
  }

  onApiarioChange(apiarioId: string) {
    this.selectedApiarioId.set(apiarioId);
    this.colmeiasList.set([]);
    if (apiarioId) {
      this.loadColmeias();
    }
  }

  loadColmeias() {
    const apiarioId = this.selectedApiarioId();
    if (!apiarioId) return;

    this.isLoading.set(true);
    this.errorMsg.set('');

    this.apiculturaService.getColmeiasByApiario(apiarioId).subscribe({
      next: (data) => {
        this.colmeiasList.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMsg.set(extractBackendError(err));
        this.isLoading.set(false);
      },
    });
  }

  openDeleteModal(colmeia: Colmeia) {
    this.selectedColmeia.set(colmeia);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.selectedColmeia.set(null);
    this.showDeleteModal.set(false);
  }

  confirmDelete() {
    const colmeia = this.selectedColmeia();
    if (colmeia) {
      this.isDeleting.set(true);
      this.apiculturaService.deleteColmeia(colmeia.id).subscribe({
        next: () => {
          this.toastService.success(`Colmeia "${colmeia.codigo}" excluída com sucesso!`);
          this.isDeleting.set(false);
          this.closeDeleteModal();
          this.loadColmeias();
        },
        error: (err) => {
          this.toastService.error(extractBackendError(err));
          this.isDeleting.set(false);
          this.closeDeleteModal();
        },
      });
    }
  }
}
