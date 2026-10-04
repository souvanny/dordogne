import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Site } from '../models/site.model';

@Injectable({ providedIn: 'root' })
export class SiteService {
  private readonly http = inject(HttpClient);

  getSites(): Observable<Site[]> {
    return this.http.get<Site[]>('/data/sites.json');
  }

  getSite(id: string): Observable<Site | undefined> {
    return this.getSites().pipe(map((sites) => sites.find((site) => site.id === id)));
  }
}
