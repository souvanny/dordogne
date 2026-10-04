import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { SiteService } from '../../services/site.service';
import { CATEGORY_LABELS } from '../../models/site.model';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-site-detail',
  styleUrl: './site-detail.component.scss',
  templateUrl: './site-detail.component.html',
})
export class SiteDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly siteService = inject(SiteService);

  readonly site$ = this.route.paramMap.pipe(
    switchMap((params) => this.siteService.getSite(params.get('id') ?? '')),
  );

  readonly labels = CATEGORY_LABELS;
}
