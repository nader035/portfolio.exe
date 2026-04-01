import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioStore } from '../../store/portfolio.store';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <h2 class="text-xl font-bold text-foreground mb-5">Experience</h2>
      <div class="divide-y divide-border border-t border-border ">
        @for (exp of store.experience(); track exp.company + exp.role) {
          <div class="py-6 grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-4">
            <div class="flex flex-col gap-0.5">
              <span class="text-xs font-medium text-foreground">{{ exp.period }}</span>
              <span class="text-xs text-muted-foreground">{{ exp.location }}</span>
            </div>
            <div>
              <div class="flex items-baseline gap-2 mb-3 flex-wrap">
                <span class="text-sm font-semibold text-foreground">{{ exp.role }}</span>
                <span class="text-xs text-accent">@ {{ exp.company }}</span>
              </div>
              <ul class="space-y-1.5 mb-3">
                @for (bullet of exp.bullets; track bullet) {
                  <li class="text-xs text-muted-foreground leading-relaxed flex gap-2">
                    <span class="text-accent flex-shrink-0 mt-0.5">›</span>
                    <span>{{ bullet }}</span>
                  </li>
                }
              </ul>
              <div class="flex flex-wrap gap-1.5">
                @for (tag of exp.tags; track tag) {
                  <span class="text-xs px-1.5 py-0.5 border border-border text-muted-foreground">
                    {{ tag }}
                  </span>
                }
              </div>
            </div>
          </div>
        } @empty {
          @if (store.isLoading()) {
            <div class="py-10 text-center text-muted-foreground text-sm">
              Loading experience...
            </div>
          }
        }
      </div>
    </section>
  `,
  styles: []
})
export class ExperienceComponent {
  readonly store = inject(PortfolioStore);
}
