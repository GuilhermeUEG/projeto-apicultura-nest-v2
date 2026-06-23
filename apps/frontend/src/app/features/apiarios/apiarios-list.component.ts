import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiculturaService, Apiario } from '../../core/services/apicultura.service';
import { ToastService } from '../../shared/components/ui/toast.service';
import { extractBackendError } from '../../core/utils/error-handler.util';
import { CardComponent } from '../../shared/components/ui/card.component';
import { ButtonComponent } from '../../shared/components/ui/button.component';
import { BadgeComponent } from '../../shared/components/ui/badge.component';

@Component({
  selector: 'app-apiarios-list',
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
            <span>🐝 Apiários</span>
          </h1>
          <p class="text-muted-foreground mt-1">
            Gerencie os apiários registrados e controle sua capacidade de colmeias.
          </p>
        </div>
        <div>
          <a
            routerLink="/apicultura/apiarios/novo"
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
            <span>Novo Apiário</span>
          </a>
        </div>
      </div>

      <!-- Search & Controls -->
      <ui-card class="mb-6 p-4">
        <div class="flex flex-col sm:flex-row items-center gap-4">
          <div class="w-full sm:max-w-xs relative">
            <svg
              class="w-4 h-4 absolute left-3 top-3 text-muted-foreground pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
            <input
              type="text"
              [ngModel]="searchQuery()"
              (ngModelChange)="searchQuery.set($event)"
              placeholder="Buscar apiário por nome..."
              class="flex h-10 w-full rounded-md border border-border bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
            />
          </div>

          <button
            ui-button
            variant="outline"
            (click)="loadApiarios()"
            [disabled]="isLoading()"
            class="ml-auto flex items-center gap-2"
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

      <!-- Feedback Banner on Load Error -->
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

      <!-- Main Table Card -->
      <ui-card>
        <div class="overflow-x-auto">
          <!-- Desktop Table -->
          @if (!isLoading() && filteredApiarios().length > 0) {
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
                    Colmeias
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    class="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border bg-transparent">
                @for (apiario of filteredApiarios(); track apiario.id) {
                  <tr class="hover:bg-muted/50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-base font-bold text-foreground">{{ apiario.nome }}</div>
                      <div class="text-xs text-muted-foreground">ID: {{ apiario.id }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="text-sm font-semibold text-foreground">{{
                        apiario.quantidadeColmeias
                      }}</span>
                      <span class="text-xs text-muted-foreground"> colmeias</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <ui-badge [variant]="apiario.operacional ? 'success' : 'secondary'">
                        {{ apiario.operacional ? 'Operacional' : 'Inativo' }}
                      </ui-badge>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex items-center justify-end gap-2">
                        <a
                          [routerLink]="['/apicultura/apiarios', apiario.id, 'editar']"
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
                          (click)="openDeleteModal(apiario)"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          }

          <!-- Mobile Cards -->
          @if (!isLoading() && filteredApiarios().length > 0) {
            <div class="md:hidden divide-y divide-border">
              @for (apiario of filteredApiarios(); track apiario.id) {
                <div class="p-5 space-y-4 hover:bg-muted/50 transition-colors">
                  <div>
                    <div class="text-base font-bold text-foreground">{{ apiario.nome }}</div>
                    <div class="text-xs text-muted-foreground">ID: {{ apiario.id }}</div>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-muted-foreground"
                      >Colmeias:
                      <strong class="text-foreground text-sm">{{
                        apiario.quantidadeColmeias
                      }}</strong></span
                    >
                    <ui-badge [variant]="apiario.operacional ? 'success' : 'secondary'">
                      {{ apiario.operacional ? 'Operacional' : 'Inativo' }}
                    </ui-badge>
                  </div>
                  <div class="flex items-center gap-2 pt-2 border-t border-border">
                    <a
                      [routerLink]="['/apicultura/apiarios', apiario.id, 'editar']"
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
                      (click)="openDeleteModal(apiario)"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <!-- States -->
        <!-- Loading State -->
        @if (isLoading() && filteredApiarios().length === 0) {
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
            <span class="text-muted-foreground text-sm font-medium"
              >Buscando lista de apiários...</span
            >
          </div>
        }

        <!-- Empty State -->
        @if (!isLoading() && filteredApiarios().length === 0) {
          <div class="py-20 flex flex-col items-center justify-center text-center p-6">
            <svg
              class="w-16 h-16 text-muted-foreground mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              ></path>
            </svg>
            <h3 class="text-lg font-bold text-foreground mb-1">Nenhum apiário encontrado</h3>
            <p class="text-muted-foreground text-sm max-w-sm">
              Tente redefinir a busca ou crie um novo apiário.
            </p>
          </div>
        }
      </ui-card>
    </div>

    <!-- Delete Confirmation Modal (Glassmorphism & premium UI) -->
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
              Tem certeza de que deseja excluir o apiário
              <strong class="text-foreground">"{{ selectedApiario()?.nome }}"</strong>? Esta ação
              não poderá ser desfeita e removerá todas as colmeias associadas a ele.
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
export class ApiariosListComponent implements OnInit {
  apiculturaService = inject(ApiculturaService);
  toastService = inject(ToastService);

  apiariosList = signal<Apiario[]>([]);
  isLoading = signal(false);
  errorMsg = signal('');

  searchQuery = signal('');

  showDeleteModal = signal(false);
  selectedApiario = signal<Apiario | null>(null);
  isDeleting = signal(false);

  filteredApiarios = computed(() => {
    const list = this.apiariosList();
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) return list;
    return list.filter((a) => a.nome.toLowerCase().includes(query));
  });

  ngOnInit() {
    this.loadApiarios();
  }

  loadApiarios() {
    this.isLoading.set(true);
    this.errorMsg.set('');

    this.apiculturaService.getApiarios().subscribe({
      next: (data) => {
        this.apiariosList.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMsg.set(extractBackendError(err));
        this.isLoading.set(false);
      },
    });
  }

  openDeleteModal(apiario: Apiario) {
    this.selectedApiario.set(apiario);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.selectedApiario.set(null);
    this.showDeleteModal.set(false);
  }

  confirmDelete() {
    const apiario = this.selectedApiario();
    if (apiario) {
      this.isDeleting.set(true);
      this.apiculturaService.deleteApiario(apiario.id).subscribe({
        next: () => {
          this.toastService.success(`Apiário "${apiario.nome}" excluído com sucesso!`);
          this.isDeleting.set(false);
          this.closeDeleteModal();
          this.loadApiarios();
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
