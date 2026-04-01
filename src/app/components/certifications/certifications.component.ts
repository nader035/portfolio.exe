import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioStore } from '../../store/portfolio.store';

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <h2 class="text-xl font-bold text-foreground mb-5">Certifications</h2>
      <ul class="space-y-1.5 list-disc list-inside">
        @for (cert of store.certifications(); track cert.name) {
          <li class="text-xs text-muted-foreground leading-relaxed">
            <span class="text-foreground font-medium">{{ cert.name }}</span>
          </li>
        } @empty {
          @if (store.isLoading()) {
            <p class="text-xs text-muted-foreground">Loading certifications...</p>
          }
        }
      </ul>
    </section>
  `,
  styles: []
})
export class CertificationsComponent {
  readonly store = inject(PortfolioStore);
}
