import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Evenement } from '../models/evenement.model';

@Injectable({ providedIn: 'root' })
export class EvenementService {
  private readonly http = inject(HttpClient);

  getEvenements(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>('/data/evenements.json');
  }

  isUpcoming(event: Evenement, today: string = this.todayISO()): boolean {
    const ref = event.dateFin ?? event.dateDebut;
    if (!ref) return false;
    return ref >= today;
  }

  todayISO(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
}
