import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORY_LABELS, Site } from '../../models/site.model';

@Component({
  imports: [RouterLink],
  selector: 'app-site-card',
  styleUrl: './site-card.component.scss',
  templateUrl: './site-card.component.html',
})
export class SiteCardComponent {
  readonly site = input.required<Site>();

  get categoryLabel(): string {
    return CATEGORY_LABELS[this.site().category];
  }
}
