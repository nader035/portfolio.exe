import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioStore } from '../../store/portfolio.store';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <h2 class="text-xl font-bold text-foreground mb-5">Skills</h2>
      <div class="space-y-4">
        @for (group of store.skills(); track group.label) {
          <div class="flex gap-4 sm:gap-8 items-start">
            <span class="text-xs text-muted-foreground uppercase tracking-widest w-24 flex-shrink-0 pt-0.5">
              {{ group.label }}
            </span>
            <div class="flex flex-wrap gap-x-3 gap-y-1">
              @for (item of group.items; track item) {
                <span class="text-sm text-foreground">
                  {{ item }}
                </span>
              }
            </div>
          </div>
        } @empty {
          @if (store.isLoading()) {
            <div class="animate-pulse flex items-center space-x-4">
               <div class="w-24 h-4 bg-muted"></div>
               <div class="flex-1 space-x-2 flex">
                  <div class="w-12 h-4 bg-muted"></div>
                  <div class="w-12 h-4 bg-muted"></div>
               </div>
            </div>
          }
        }
      </div>
    </section>
  `,
  styles: []
})
export class SkillsComponent {
  readonly store = inject(PortfolioStore);
}
