import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Apiario {
  id: string;
  nome: string;
  localizacao: string;
  quantidadeColmeias: number;
  dataFundacao: string;
  operacional: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Colmeia {
  id: string;
  codigo: string;
  tipo: string;
  apiarioId: string;
  apiario?: Apiario;
}

export interface Colheita {
  id?: string | number;
  tipoFlorada: string;
  dataColheita: string;
  purezaAlta: boolean;
  volumeLitros: number;
  apiario?: Apiario;
}

export interface BulkColmeiaPayload {
  quantidade: number;
  tipo: string;
  codigoBase?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiculturaService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getApiarios(): Observable<Apiario[]> {
    return this.http.get<Apiario[]>(`${this.apiUrl}/apiarios`);
  }

  getApiarioById(id: string): Observable<Apiario> {
    return this.http.get<Apiario>(`${this.apiUrl}/apiarios/${id}`);
  }

  createApiario(apiario: Omit<Apiario, 'id'>): Observable<Apiario> {
    return this.http.post<Apiario>(`${this.apiUrl}/apiarios`, apiario);
  }

  updateApiario(id: string, apiario: Partial<Apiario>): Observable<Apiario> {
    return this.http.put<Apiario>(`${this.apiUrl}/apiarios/${id}`, apiario);
  }

  deleteApiario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/apiarios/${id}`);
  }

  getColmeiasByApiario(apiarioId: string): Observable<Colmeia[]> {
    return this.http.get<Colmeia[]>(`${this.apiUrl}/colmeias/apiario/${apiarioId}`);
  }

  getColmeiaById(id: string): Observable<Colmeia> {
    return this.http.get<Colmeia>(`${this.apiUrl}/colmeias/${id}`);
  }

  addColmeia(apiarioId: string, colmeia: { codigo: string; tipo: string }): Observable<Colmeia> {
    return this.http.post<Colmeia>(`${this.apiUrl}/colmeias/${apiarioId}`, {
      ...colmeia,
      apiarioId,
    });
  }

  addColmeiasBulk(apiarioId: string, payload: BulkColmeiaPayload): Observable<Colmeia[]> {
    return this.http.post<Colmeia[]>(`${this.apiUrl}/colmeias/${apiarioId}/bulk`, payload);
  }

  updateColmeia(id: string, colmeia: { codigo: string; tipo: string }): Observable<Colmeia> {
    return this.http.patch<Colmeia>(`${this.apiUrl}/colmeias/${id}`, colmeia);
  }

  deleteColmeia(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/colmeias/${id}`);
  }

  registrarColheita(
    apiarioId: string,
    colheita: Omit<Colheita, 'id' | 'apiario'>,
  ): Observable<Colheita> {
    return this.http.post<Colheita>(`${this.apiUrl}/colheitas/${apiarioId}`, colheita);
  }

  getColheitas(): Observable<Colheita[]> {
    return this.http.get<Colheita[]>(`${this.apiUrl}/colheitas`);
  }

  getColheitasByApiario(apiarioId: string): Observable<Colheita[]> {
    return this.http.get<Colheita[]>(`${this.apiUrl}/colheitas/apiario/${apiarioId}`);
  }

  getColheitaById(id: string | number): Observable<Colheita> {
    return this.http.get<Colheita>(`${this.apiUrl}/colheitas/${id}`);
  }

  updateColheita(
    id: string | number,
    colheita: Omit<Colheita, 'id' | 'apiario'>,
  ): Observable<Colheita> {
    return this.http.put<Colheita>(`${this.apiUrl}/colheitas/${id}`, colheita);
  }

  deleteColheita(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/colheitas/${id}`);
  }
}
