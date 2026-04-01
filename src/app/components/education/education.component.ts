import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioStore } from '../../store/portfolio.store';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <h2 class="text-xl font-bold text-foreground mb-5">Education</h2>
      <div class="space-y-6">
        @for (edu of store.education(); track edu.degree + edu.school) {
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
            <div>
              <h3 class="text-sm font-semibold text-foreground">{{ edu.degree }}</h3>
              <p class="text-xs text-muted-foreground">{{ edu.school }}, {{ edu.location }}</p>
            </div>
            <span class="text-xs font-medium text-accent whitespace-nowrap pt-0.5">
              {{ edu.period }}
            </span>
          </div>
        } @empty {
          @if (store.isLoading()) {
            <p class="text-xs text-muted-foreground">Loading education...</p>
          }
        }
      </div>
    </section>
  `,
  styles: []
})
export class EducationComponent {
  readonly store = inject(PortfolioStore);
}
