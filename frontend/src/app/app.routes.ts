import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SiteDetailComponent } from './pages/site-detail/site-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Dordogne — Périgord' },
  { path: 'site/:id', component: SiteDetailComponent },
  { path: '**', redirectTo: '' },
];
