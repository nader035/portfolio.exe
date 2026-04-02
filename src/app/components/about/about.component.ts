import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioStore } from '../../store/portfolio.store';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="about" class="scroll-mt-20">
      <h2 class="text-xl font-bold text-foreground mb-6 uppercase tracking-widest flex items-center gap-2">
        <span class="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
        About
      </h2>
      
      <div class="space-y-4 text-sm text-muted-foreground leading-relaxed font-mono">
        @if (store.isLoading()) {
          <!-- Skeleton Loading -->
          @for (i of [1, 2, 3]; track i) {
            <div class="w-full h-4 bg-muted animate-pulse rounded-none opacity-20"></div>
            <div class="w-3/4 h-4 bg-muted animate-pulse rounded-none opacity-20"></div>
          }
        } @else {
          @for (para of store.about()?.paragraphs; track $index) {
            <p class="animate-in fade-in slide-in-from-left duration-500" [style.animationDelay]="$index * 100 + 'ms'">
              {{ para }}
            </p>
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
