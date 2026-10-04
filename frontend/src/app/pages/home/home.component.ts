import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { SiteService } from '../../services/site.service';
import { EvenementService } from '../../services/evenement.service';
import { Evenement } from '../../models/evenement.model';
import { CATEGORY_ICONS, CATEGORY_LABELS, Site, SiteCategory } from '../../models/site.model';
import { SiteCardComponent } from '../../components/site-card/site-card.component';

const MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

const CATEGORY_ORDER: SiteCategory[] = ['chateau', 'grotte', 'troglodyte', 'nature'];

interface CategoryGroup {
  category: SiteCategory;
  label: string;
  icon: string;
  sites: Site[];
}

@Component({
  imports: [CommonModule, RouterLink, SiteCardComponent],
  selector: 'app-home',
  styleUrl: './home.component.scss',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private readonly siteService = inject(SiteService);
  private readonly evenementService = inject(EvenementService);

  readonly sitesByCategory$ = this.siteService.getSites().pipe(
    map((sites) => {
      const byCategory = new Map<SiteCategory, Site[]>();
      for (const site of sites) {
        const list = byCategory.get(site.category) ?? [];
        list.push(site);
        byCategory.set(site.category, list);
      }
      return CATEGORY_ORDER.filter((c) => byCategory.has(c)).map((c) => ({
        category: c,
        label: CATEGORY_LABELS[c],
        icon: CATEGORY_ICONS[c],
        sites: byCategory.get(c)!,
      }));
    }),
  );

  readonly evenementsAVenir$ = this.evenementService.getEvenements().pipe(
    map((events) => events.filter((e) => this.evenementService.isUpcoming(e))),
  );

  jour(event: Evenement): string {
    const d = this.partiesDate(event);
    return d ? d.jour : '—';
  }

  mois(event: Evenement): string {
    const d = this.partiesDate(event);
    return d ? d.mois : '';
  }

  private partiesDate(event: Evenement): { jour: string; mois: string } | null {
    const iso = event.dateDebut ?? event.dateFin;
    if (!iso) return null;
    const [, m, j] = iso.split('-').map(Number);
    return { jour: String(j), mois: MOIS[m - 1] ?? '' };
  }
}
