import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HeaderComponent as UiHeaderComponent } from '../../shared/components/layout/header.component';
import { ButtonComponent } from '../../shared/components/ui/button.component';
import { BadgeComponent } from '../../shared/components/ui/badge.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    UiHeaderComponent,
    ButtonComponent,
    BadgeComponent,
  ],
  template: `
    <ui-header (menuToggle)="menuToggle.emit()">
      <a
        logo
        routerLink="/"
        class="flex items-center gap-2 font-bold text-xl text-primary hover:text-primary-hover transition-colors"
      >
        <svg
          class="w-7 h-7 text-amber-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 2.5 20.5 7.25 20.5 16.75 12 21.5 3.5 16.75 3.5 7.25 Z"
          ></path>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.6"
            d="M12 8 15.5 10 15.5 14 12 16 8.5 14 8.5 10 Z"
          ></path>
        </svg>
        <span class="font-extrabold tracking-tight"
          >Hexa<span class="text-amber-500">Bee</span></span
        >
      </a>

      <nav actions class="flex items-center gap-4">
        @if (authService.isAuth()) {
          <div class="hidden md:flex items-center gap-4 mr-4 border-r border-border pr-6">
            @if (authService.isAdmin()) {
              <a
                routerLink="/admin"
                routerLinkActive="text-primary border-primary"
                [routerLinkActiveOptions]="{ exact: true }"
                class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-1 border-b-2 border-transparent"
              >
                Painel Admin
              </a>
            }
          </div>

          <div class="flex items-center gap-3">
            <div class="hidden sm:flex items-center gap-2 mr-2 border-r border-border pr-3">
              <span class="text-sm font-medium text-foreground">{{
                authService.currentUser()?.nome
              }}</span>
              <ui-badge [variant]="authService.isAdmin() ? 'info' : 'success'">
                {{ authService.currentUser()?.role | uppercase }}
              </ui-badge>
            </div>

            <button ui-button variant="destructive" size="sm" (click)="askLogout()" class="gap-1.5">
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                ></path>
              </svg>
              <span>Sair</span>
            </button>
          </div>
        } @else {
          <div class="flex items-center gap-2">
            <a routerLink="/login" ui-button variant="ghost">Entrar</a>
            <a routerLink="/register" ui-button variant="default">Cadastrar</a>
          </div>
        }
      </nav>
    </ui-header>

    <!-- Logout Confirmation Modal -->
    @if (showLogoutConfirm()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity"
      >
        <div
          class="relative w-full max-w-sm bg-background border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200"
        >
          <div class="p-6">
            <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Confirmar Saída
            </h3>
            <p class="text-xl font-bold text-foreground">
              Tem certeza de que deseja sair da sua conta?
            </p>
          </div>
          <div class="px-6 py-4 bg-muted/40 border-t border-border flex justify-end gap-3">
            <button ui-button variant="outline" (click)="cancelLogout()">Cancelar</button>
            <button ui-button variant="destructive" (click)="confirmLogout()">Sair</button>
          </div>
        </div>
      </div>
    }
  `,
})
export class HeaderComponent {
  authService = inject(AuthService);
  menuToggle = output<void>();

  showLogoutConfirm = signal(false);

  askLogout() {
    this.showLogoutConfirm.set(true);
  }

  cancelLogout() {
    this.showLogoutConfirm.set(false);
  }

  confirmLogout() {
    this.showLogoutConfirm.set(false);
    this.authService.logout();
  }
}
