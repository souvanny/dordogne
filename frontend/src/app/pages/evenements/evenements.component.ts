import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { EvenementService } from '../../services/evenement.service';
import { Evenement } from '../../models/evenement.model';

@Component({
  imports: [CommonModule],
  selector: 'app-evenements',
  styleUrl: './evenements.component.scss',
  templateUrl: './evenements.component.html',
})
export class EvenementsComponent {
  private readonly evenementService = inject(EvenementService);

  readonly evenements$ = this.evenementService.getEvenements().pipe(
    map((events) => {
      const today = this.evenementService.todayISO();
      return {
        aVenir: events.filter((e) => this.evenementService.isUpcoming(e, today)),
        autres: events.filter((e) => !this.evenementService.isUpcoming(e, today)),
      };
    }),
  );

  formatDate(event: Evenement): string {
    return event.date || 'Date à définir';
  }

  lieu(event: Evenement): string {
    return [event.lieu, event.ville].filter(Boolean).join(' — ');
  }
}
