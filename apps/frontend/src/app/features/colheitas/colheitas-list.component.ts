import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiculturaService, Colheita } from '../../core/services/apicultura.service';
import { ToastService } from '../../shared/components/ui/toast.service';
import { extractBackendError } from '../../core/utils/error-handler.util';
import { CardComponent } from '../../shared/components/ui/card.component';
import { ButtonComponent } from '../../shared/components/ui/button.component';
import { BadgeComponent } from '../../shared/components/ui/badge.component';

@Component({
  selector: 'app-colheitas-list',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, ButtonComponent, BadgeComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
      <!-- Header -->
      <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1
            class="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2"
          >
            <span>🍯 Colheitas de Mel</span>
          </h1>
          <p class="text-muted-foreground mt-1">
            Histórico de todas as colheitas registradas no sistema.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            ui-button
            variant="outline"
            (click)="loadColheitas()"
            [disabled]="isLoading()"
            class="flex items-center gap-2"
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
          <a
            [routerLink]="['/apicultura/colheitas/novo']"
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
            <span>Registrar Colheita</span>
          </a>
        </div>
      </div>

      <!-- Error banner -->
      @if (errorMsg()) {
        <div
          class="mb-6 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3.5 rounded-xl flex items-center gap-2 shadow-sm"
        >
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
          <span class="font-medium text-sm">{{ errorMsg() }}</span>
        </div>
      }

      <ui-card>
        <!-- Loading state -->
        @if (isLoading()) {
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
            <span class="text-muted-foreground text-sm font-medium">Buscando colheitas...</span>
          </div>
        }

        <!-- Empty state -->
        @if (!isLoading() && !errorMsg() && colheitas().length === 0) {
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
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z"
              ></path>
            </svg>
            <h3 class="text-lg font-bold text-foreground mb-1">Nenhuma colheita registrada</h3>
            <p class="text-muted-foreground text-sm max-w-sm">
              Registre a primeira colheita para começar a acompanhar a produção de mel.
            </p>
          </div>
        }

        <!-- Data -->
        @if (!isLoading() && colheitas().length > 0) {
          <div class="overflow-x-auto">
            <!-- Desktop Table -->
            <table class="min-w-full divide-y divide-border hidden md:table">
              <thead class="bg-muted/50">
                <tr>
                  <th
                    class="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Apiário
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Florada
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Data
                  </th>
                  <th
                    class="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Volume
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Pureza
                  </th>
                  <th
                    class="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border bg-transparent">
                @for (colheita of colheitas(); track colheita.id) {
                  <tr class="hover:bg-muted/50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center gap-3">
                        <div
                          class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 font-bold"
                        >
                          🍯
                        </div>
                        <span class="text-sm font-semibold text-foreground">{{
                          colheita.apiario?.nome ?? '—'
                        }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <ui-badge variant="secondary">{{ colheita.tipoFlorada }}</ui-badge>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {{ colheita.dataColheita | date: 'dd/MM/yyyy' }}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-foreground"
                    >
                      {{ colheita.volumeLitros }} L
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <ui-badge [variant]="colheita.purezaAlta ? 'success' : 'secondary'">
                        {{ colheita.purezaAlta ? 'Alta Pureza' : 'Comum' }}
                      </ui-badge>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex items-center justify-end gap-2">
                        <a
                          [routerLink]="['/apicultura/colheitas', colheita.id, 'editar']"
                          ui-button
                          variant="outline"
                          size="sm"
                          >Editar</a
                        >
                        <button
                          ui-button
                          variant="destructive"
                          size="sm"
                          (click)="openDeleteModal(colheita)"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>

            <!-- Mobile Cards -->
            <div class="md:hidden divide-y divide-border">
              @for (colheita of colheitas(); track colheita.id) {
                <div class="p-5 space-y-3 hover:bg-muted/50 transition-colors">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 font-bold"
                    >
                      🍯
                    </div>
                    <span class="text-sm font-semibold text-foreground">{{
                      colheita.apiario?.nome ?? '—'
                    }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-muted-foreground">Florada:</span>
                    <ui-badge variant="secondary">{{ colheita.tipoFlorada }}</ui-badge>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-muted-foreground">Data:</span>
                    <span class="text-sm text-foreground">{{
                      colheita.dataColheita | date: 'dd/MM/yyyy'
                    }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-muted-foreground">Volume:</span>
                    <span class="text-sm font-semibold text-foreground"
                      >{{ colheita.volumeLitros }} L</span
                    >
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-muted-foreground">Pureza:</span>
                    <ui-badge [variant]="colheita.purezaAlta ? 'success' : 'secondary'">
                      {{ colheita.purezaAlta ? 'Alta Pureza' : 'Comum' }}
                    </ui-badge>
                  </div>
                  <div class="flex items-center gap-2 pt-2 border-t border-border">
                    <a
                      [routerLink]="['/apicultura/colheitas', colheita.id, 'editar']"
                      ui-button
                      variant="outline"
                      size="sm"
                      class="flex-1 text-center"
                      >Editar</a
                    >
                    <button
                      ui-button
                      variant="destructive"
                      size="sm"
                      class="flex-1"
                      (click)="openDeleteModal(colheita)"
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
              Tem certeza de que deseja excluir esta colheita (<strong class="text-foreground"
                >{{ selectedColheita()?.tipoFlorada }} —
                {{ selectedColheita()?.volumeLitros }}L</strong
              >)? Esta ação não poderá ser desfeita.
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
  `,
})
export class ColheitasListComponent implements OnInit {
  private apiculturaService = inject(ApiculturaService);
  private toastService = inject(ToastService);

  colheitas = signal<Colheita[]>([]);
  isLoading = signal(false);
  errorMsg = signal('');

  showDeleteModal = signal(false);
  selectedColheita = signal<Colheita | null>(null);
  isDeleting = signal(false);

  ngOnInit() {
    this.loadColheitas();
  }

  loadColheitas() {
    this.isLoading.set(true);
    this.errorMsg.set('');
    this.apiculturaService.getColheitas().subscribe({
      next: (data) => {
        this.colheitas.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMsg.set(extractBackendError(err));
        this.isLoading.set(false);
      },
    });
  }

  openDeleteModal(colheita: Colheita) {
    this.selectedColheita.set(colheita);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.selectedColheita.set(null);
    this.showDeleteModal.set(false);
  }

  confirmDelete() {
    const colheita = this.selectedColheita();
    if (!colheita?.id) return;
    this.isDeleting.set(true);
    this.apiculturaService.deleteColheita(colheita.id).subscribe({
      next: () => {
        this.toastService.success('Colheita excluída com sucesso!');
        this.isDeleting.set(false);
        this.closeDeleteModal();
        this.loadColheitas();
      },
      error: (err) => {
        this.toastService.error(extractBackendError(err));
        this.isDeleting.set(false);
        this.closeDeleteModal();
      },
    });
  }
}
