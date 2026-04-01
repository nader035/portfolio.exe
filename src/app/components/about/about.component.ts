import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioStore } from '../../store/portfolio.store';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <h2 class="text-xl font-bold text-foreground mb-5">About</h2>
      <div class="space-y-3 text-sm text-muted-foreground leading-6">
        @for (para of store.about()?.paragraphs; track $index) {
          <p>{{ para }}</p>
        } @empty {
          @if (store.isLoading()) {
            <p>Loading about section...</p>
          }
        }
      </div>
    </section>
  `,
  styles: []
})
export class AboutComponent {
  readonly store = inject(PortfolioStore);
}
