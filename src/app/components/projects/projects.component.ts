import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioStore } from '../../store/portfolio.store';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <h2 class="text-xl font-bold text-foreground mb-5">Projects</h2>
      <div class="divide-y divide-border border-t border-border">
        @for (p of store.projects(); track p.name) {
          <div class="py-5">
            <div class="flex items-start justify-between gap-3 mb-2">
              <div class="flex items-center gap-3 flex-wrap">
                <span class="text-sm font-semibold text-foreground">{{ p.name }}</span>
                <span [class]="'text-xs ' + getStatusColor(p.status)">
                  {{ p.status }}
                </span>
                <span class="text-xs text-muted-foreground">{{ p.year }}</span>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                @if (p.repo) {
                  <a [href]="p.repo" target="_blank" rel="noopener noreferrer"
                    class="text-muted-foreground hover:text-foreground transition-colors" aria-label="repo">
                    <i-lucide name="github" [size]="14"></i-lucide>
                  </a>
                }
                @if (p.live) {
                  <a [href]="p.live" target="_blank" rel="noopener noreferrer"
                    class="text-muted-foreground hover:text-foreground transition-colors" aria-label="live">
                    <i-lucide name="external-link" [size]="14"></i-lucide>
                  </a>
                }
              </div>
            </div>
            <p class="text-xs text-muted-foreground leading-relaxed mb-3">{{ p.desc }}</p>
            <div class="flex flex-wrap gap-1.5">
              @for (t of p.tags; track t) {
                <span class="text-xs px-1.5 py-0.5 border border-border text-muted-foreground">
                  {{ t }}
                </span>
              }
            </div>
          </div>
        } @empty {
          @if (store.isLoading()) {
            <div class="py-10 text-center text-muted-foreground text-sm">
              Loading projects...
            </div>
          }
        }
      </div>
    </section>
  `,
  styles: []
})
export class ProjectsComponent {
  readonly store = inject(PortfolioStore);

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      Live: 'text-green-400',
      Beta: 'text-yellow-400',
      'Open source': 'text-accent',
    };
    return colors[status] ?? 'text-muted-foreground';
  }
}
