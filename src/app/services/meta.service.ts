import { Injectable, inject, effect } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { PortfolioStore } from '../store/portfolio.store';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  private title = inject(Title);
  private meta = inject(Meta);
  private store = inject(PortfolioStore);

  constructor() {
    // Automatically update SEO meta tags whenever the profile data changes
    effect(() => {
      const p = this.store.profile();
      if (p) {
        this.updateMeta(p);
      }
    });
  }

  updateMeta(p: any) {
    const siteTitle = `${p.name} | ${p.role}`;
    const description = `${p.name} is a ${p.role} based in ${p.location}, specializing in professional frontend development and modern UI/UX design.`;

    this.title.setTitle(siteTitle);

    // Standard Meta Tags
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: `${p.name}, ${p.role}, frontend developer, angular developer, web development portfolio` });
    this.meta.updateTag({ name: 'author', content: p.name });

    // OpenGraph (Facebook / LinkedIn)
    this.meta.updateTag({ property: 'og:title', content: siteTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: 'https://nader-portfolio.vercel.app/' }); // Update with real URL later
    this.meta.updateTag({ property: 'og:site_name', content: `${p.name} Portfolio` });

    // Twitter
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: siteTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
  }
}
