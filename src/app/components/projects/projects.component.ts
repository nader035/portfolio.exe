import { Component, inject, ChangeDetectionStrategy, signal, computed } from '@angular/core';
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
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 class="text-xl font-bold text-foreground">Projects</h2>
        
        <!-- Tag Filters -->
        <div class="flex flex-wrap gap-2 items-center">
          <button 
            (click)="selectedTag.set(null)"
            [class]="'text-[10px] px-2 py-0.5 border transition-all ' + (!selectedTag() ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-accent hover:text-foreground')"
          >
            ALL
          </button>
          @for (tag of allTags(); track tag) {
            <button 
              (click)="selectedTag.set(tag)"
              [class]="'text-[10px] px-2 py-0.5 border uppercase transition-all ' + (selectedTag() === tag ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-accent hover:text-foreground')"
            >
              {{ tag }}
            </button>
          }
        </div>
      </div>

      <div class="divide-y divide-border border-t border-border">
        @for (p of filteredProjects(); track p.name) {
          <div class="py-5 group">
            <div class="flex items-start justify-between gap-3 mb-2">
              <div class="flex items-center gap-3 flex-wrap">
                <span class="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">{{ p.name }}</span>
                <span [class]="'text-[10px] px-1.5 border border-current ' + getStatusColor(p.status)">
                  {{ p.status }}
                </span>
                <span class="text-[10px] text-muted-foreground">{{ p.year }}</span>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                @if (p.repo) {
                  <a [href]="p.repo" target="_blank" rel="noopener noreferrer"
                    class="text-muted-foreground hover:text-foreground transition-all hover:scale-110" aria-label="repo">
                    <i-lucide name="github" [size]="14"></i-lucide>
                  </a>
                }
                @if (p.live) {
                  <a [href]="p.live" target="_blank" rel="noopener noreferrer"
                    class="text-muted-foreground hover:text-foreground transition-all hover:scale-110" aria-label="live">
                    <i-lucide name="external-link" [size]="14"></i-lucide>
                  </a>
                }
              </div>
            </div>
            <p class="text-xs text-muted-foreground leading-relaxed mb-3">{{ p.desc }}</p>
            <div class="flex flex-wrap gap-1.5">
              @for (t of p.tags; track t) {
                <span 
                  (click)="selectedTag.set(t)"
                  [class]="'text-[10px] px-1.5 py-0.5 border transition-all cursor-pointer ' + (selectedTag() === t ? 'border-primary text-primary' : 'border-border text-muted-foreground hover:border-accent hover:text-foreground')"
                >
                  {{ t }}
                </span>
              }
            </div>
          </div>
        } @empty {
          @if (store.isLoading()) {
            <div class="py-10 text-center text-muted-foreground text-sm flex flex-col items-center gap-4">
              <span class="animate-pulse">Loading projects...</span>
            </div>
          } @else {
            <div class="py-10 text-center text-muted-foreground text-sm">
              No projects found for tag: {{ selectedTag() }}
            </div>
          }
        }
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ProjectsComponent {
  readonly store = inject(PortfolioStore);
  
  selectedTag = signal<string | null>(null);

  allTags = computed(() => {
    const tags = this.store.projects().flatMap(p => p.tags);
    return Array.from(new Set(tags)).sort();
  });

  filteredProjects = computed(() => {
    const projects = this.store.projects();
    const tag = this.selectedTag();
    if (!tag) return projects;
    return projects.filter(p => p.tags.includes(tag));
  });

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      Live: 'text-green-500',
      Beta: 'text-yellow-500',
      'Open source': 'text-accent',
    };
    return colors[status] ?? 'text-muted-foreground';
  }
}
