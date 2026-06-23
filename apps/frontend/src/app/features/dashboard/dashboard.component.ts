import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiculturaService, Apiario, Colheita } from '../../core/services/apicultura.service';
import { AuthService } from '../../core/auth/auth.service';
import { extractBackendError } from '../../core/utils/error-handler.util';
import { CardComponent } from '../../shared/components/ui/card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
      <!-- Error state -->
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

      <!-- Loading state -->
      @if (isLoading()) {
        <div class="mb-6 flex items-center gap-2 text-muted-foreground text-sm">
          <svg
            class="animate-spin h-5 w-5 text-primary"
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
          <span>Carregando resumo da produção...</span>
        </div>
      }

      <!-- Welcome Header -->
      <div
        class="mb-8 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/20 shadow-sm"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-500 text-2xl"
          >
            🐝
          </div>
          <div>
            <h1 class="text-3xl font-extrabold tracking-tight text-foreground">
              Olá, {{ authService.currentUser()?.nome }}!
            </h1>
            <p class="text-muted-foreground mt-1">
              Bem-vindo ao Sistema de Gestão de Apicultura. Aqui está o resumo da sua produção.
            </p>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <!-- Apiarios Card -->
        <ui-card class="p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div
            class="absolute -right-4 -bottom-4 text-7xl opacity-5 group-hover:scale-110 transition-transform select-none"
          >
            🍯
          </div>
          <div class="flex justify-between items-start mb-4">
            <span class="text-sm font-semibold text-muted-foreground uppercase"
              >Total de Apiários</span
            >
            <span
              class="p-2 rounded-lg bg-amber-500/10 text-amber-600 text-xs font-bold border border-amber-500/20"
              >Apiários</span
            >
          </div>
          <div class="text-4xl font-extrabold text-foreground tracking-tight mb-2">
            {{ totalApiarios() }}
          </div>
          <p class="text-xs text-muted-foreground">
            <span class="text-success font-medium">{{ apiariosOperacionais() }}</span> ativos de
            forma operacional.
          </p>
        </ui-card>

        <!-- Colmeias Card -->
        <ui-card class="p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div
            class="absolute -right-4 -bottom-4 text-7xl opacity-5 group-hover:scale-110 transition-transform select-none"
          >
            📦
          </div>
          <div class="flex justify-between items-start mb-4">
            <span class="text-sm font-semibold text-muted-foreground uppercase"
              >Total de Colmeias</span
            >
            <span
              class="p-2 rounded-lg bg-yellow-500/10 text-yellow-600 text-xs font-bold border border-yellow-500/20"
              >Colmeias</span
            >
          </div>
          <div class="text-4xl font-extrabold text-foreground tracking-tight mb-2">
            {{ totalColmeias() }}
          </div>
          <p class="text-xs text-muted-foreground">
            Média de
            <span class="font-medium text-foreground">{{
              mediaColmeiasPorApiario() | number: '1.0-1'
            }}</span>
            colmeias por apiário.
          </p>
        </ui-card>

        <!-- Colheitas Card -->
        <ui-card class="p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
          <div
            class="absolute -right-4 -bottom-4 text-7xl opacity-5 group-hover:scale-110 transition-transform select-none"
          >
            🍯
          </div>
          <div class="flex justify-between items-start mb-4">
            <span class="text-sm font-semibold text-muted-foreground uppercase"
              >Total de Colheitas</span
            >
            <span
              class="p-2 rounded-lg bg-primary/10 text-primary text-xs font-bold border border-primary/20"
              >Colheitas</span
            >
          </div>
          <div class="text-4xl font-extrabold text-foreground tracking-tight mb-2">
            {{ totalColheitas() }}
          </div>
          <p class="text-xs text-muted-foreground">
            <span class="font-medium text-foreground"
              >{{ volumeTotalColhido() | number: '1.0-1' }} L</span
            >
            de mel registrados no total.
          </p>
        </ui-card>
      </div>

      <!-- Quick Actions and Rules Overview -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Actions Card -->
        <ui-card class="p-6">
          <h2 class="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
            <span>🚀 Atalhos Rápidos</span>
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              routerLink="/apicultura/apiarios"
              class="flex flex-col p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/80 transition-colors"
            >
              <span class="font-bold text-foreground text-sm">Gerenciar Apiários</span>
              <span class="text-xs text-muted-foreground mt-1"
                >Cadastrar, visualizar e desativar apiários cadastrados.</span
              >
            </a>
            <a
              routerLink="/apicultura/colmeias"
              class="flex flex-col p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/80 transition-colors"
            >
              <span class="font-bold text-foreground text-sm">Gerenciar Colmeias</span>
              <span class="text-xs text-muted-foreground mt-1"
                >Adicionar e gerenciar colmeias de cada apiário.</span
              >
            </a>
            <a
              routerLink="/apicultura/colheitas/novo"
              class="flex flex-col sm:col-span-2 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-colors flex items-center justify-between flex-row"
            >
              <div class="flex flex-col">
                <span class="font-bold text-amber-600 text-sm">Registrar Colheita</span>
                <span class="text-xs text-amber-700/80 mt-1"
                  >Registrar volumes de mel produzidos em apiários ativos.</span
                >
              </div>
              <span class="text-2xl">🍯</span>
            </a>
          </div>
        </ui-card>

        <!-- Rules Overview Card -->
        <ui-card class="p-6">
          <h2 class="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
            <span>📜 Regras de Negócio Importantes</span>
          </h2>
          <ul class="space-y-3 text-sm">
            <li class="flex gap-2.5 items-start">
              <span class="text-amber-500 font-bold">1.</span>
              <span class="text-muted-foreground"
                ><strong class="text-foreground">Viabilidade:</strong> Apiários devem ter no mínimo
                <strong class="text-foreground">5 colmeias</strong> para estarem aptos a registrar
                colheitas de mel.</span
              >
            </li>
            <li class="flex gap-2.5 items-start">
              <span class="text-amber-500 font-bold">2.</span>
              <span class="text-muted-foreground"
                ><strong class="text-foreground">Limite:</strong> A colheita não pode ultrapassar o
                limite realista de <strong class="text-foreground">1.5 litros</strong> por colmeia
                existente no apiário.</span
              >
            </li>
            <li class="flex gap-2.5 items-start">
              <span class="text-amber-500 font-bold">3.</span>
              <span class="text-muted-foreground"
                ><strong class="text-foreground">Status Operacional:</strong> Não é permitido
                registrar colheitas em apiários que estejam
                <strong class="text-foreground">inativos</strong>.</span
              >
            </li>
            <li class="flex gap-2.5 items-start">
              <span class="text-amber-500 font-bold">4.</span>
              <span class="text-muted-foreground"
                ><strong class="text-foreground">Pureza de Mel:</strong> Mel classificado como de
                Alta Pureza exige um volume mínimo de
                <strong class="text-foreground">10 litros</strong>. Mel comum deve ser inferior a
                80% do limite máximo.</span
              >
            </li>
          </ul>
        </ui-card>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  apiculturaService = inject(ApiculturaService);
  authService = inject(AuthService);

  apiarios = signal<Apiario[]>([]);
  colheitas = signal<Colheita[]>([]);
  isLoading = signal(false);
  errorMsg = signal('');

  totalApiarios = computed(() => this.apiarios().length);
  apiariosOperacionais = computed(() => this.apiarios().filter((a) => a.operacional).length);
  totalColmeias = computed(() => this.apiarios().reduce((acc, a) => acc + a.quantidadeColmeias, 0));

  totalColheitas = computed(() => this.colheitas().length);
  volumeTotalColhido = computed(() =>
    this.colheitas().reduce((acc, c) => acc + (c.volumeLitros || 0), 0),
  );

  mediaColmeiasPorApiario = computed(() => {
    const total = this.totalApiarios();
    return total > 0 ? this.totalColmeias() / total : 0;
  });

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.isLoading.set(true);
    this.errorMsg.set('');
    this.apiculturaService.getApiarios().subscribe({
      next: (data) => {
        this.apiarios.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMsg.set(extractBackendError(err));
        this.isLoading.set(false);
      },
    });
    this.apiculturaService.getColheitas().subscribe({
      next: (data) => this.colheitas.set(data),
      error: () => this.colheitas.set([]),
    });
  }
}
