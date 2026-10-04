import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteService } from '../../services/site.service';
import { SiteCardComponent } from '../../components/site-card/site-card.component';

@Component({
  imports: [CommonModule, SiteCardComponent],
  selector: 'app-home',
  styleUrl: './home.component.scss',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private readonly siteService = inject(SiteService);

  readonly sites$ = this.siteService.getSites();
}
