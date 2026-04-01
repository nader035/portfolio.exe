import { Component, OnInit, inject, ViewChild, ElementRef, computed, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { PortfolioStore, ContributionDay } from '../../store/portfolio.store';

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

interface Repo {
  name: string;
  desc: string;
  lang: string;
  stars: number;
  forks: number;
  url: string;
}

@Component({
  selector: 'app-github-section',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section>
      <h2 class="text-xl font-bold text-foreground mb-5">GitHub Activity</h2>
      
      <!-- Contribution graph -->
      <div 
        #scrollContainer
        class="mb-2 overflow-x-auto custom-scrollbar"
      >
        @if (grid().length > 0) {
          <div class="w-max pb-1">
            <!-- Month row -->
            <div class="flex mb-1" style="padding-left: 24px;">
              @for (wi of weeksArray(); track wi) {
                <div class="w-[11px] mr-[1px] text-[9px] text-muted-foreground leading-none overflow-visible whitespace-nowrap">
                  {{ getMonthLabel(wi) }}
                </div>
              }
            </div>

            <div class="flex">
              <!-- Day labels -->
              <div class="flex flex-col mr-1 mt-0.5">
                @for (day of dayLabels; track $index) {
                  <div class="h-[10px] mb-[1px] text-[9px] text-muted-foreground leading-none w-5 text-right pr-1">
                    {{ day }}
                  </div>
                }
              </div>
              <!-- Cells -->
              @for (week of grid(); track $index) {
                <div class="flex flex-col mr-[1px]">
                  @for (day of week; track day.date) {
                    <div
                      [class]="'w-[10px] h-[10px] mb-[1px] gh-cell-' + mapLevel(day.contributionLevel) + ' cursor-pointer'"
                      [title]="day.contributionCount + ' contributions on ' + day.date"
                    ></div>
                  }
                </div>
              }
            </div>
          </div>
        } @else {
          <div class="h-[100px] flex items-center justify-center border border-dashed border-border text-xs text-muted-foreground">
            Loading contribution stats...
          </div>
        }
      </div>

      <div class="flex items-center justify-between mb-6">
        <p class="text-xs text-muted-foreground">{{ totalContributions() | number }} contributions in the last year on GitHub</p>
        <div class="flex items-center gap-1 text-xs text-muted-foreground">
          <span>Less</span>
          @for (l of [0,1,2,3,4]; track l) {
            <div [class]="'w-3 h-3 gh-cell-' + l"></div>
          }
          <span>More</span>
        </div>
      </div>

      <!-- Repos -->
      <div class="divide-y divide-border border-t border-border">
        @for (repo of repos; track repo.name) {
          <div class="py-3 flex items-start justify-between gap-3 hover:bg-muted/20 transition-colors group">
            <div class="min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <a
                  [href]="repo.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm font-medium text-accent hover:underline"
                >
                  {{ repo.name }}
                </a>
                <i-lucide name="external-link" [size]="11" class="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"></i-lucide>
              </div>
              <p class="text-xs text-muted-foreground leading-relaxed">{{ repo.desc }}</p>
              <div class="flex items-center gap-3 mt-2">
                <span class="flex items-center gap-1 text-xs text-muted-foreground">
                  <span
                    class="w-2.5 h-2.5 rounded-full"
                    [style.backgroundColor]="getLangColor(repo.lang)"
                  ></span>
                  {{ repo.lang }}
                </span>
                <span class="flex items-center gap-1 text-xs text-muted-foreground">
                  <i-lucide name="star" [size]="11"></i-lucide>
                  {{ repo.stars | number }}
                </span>
                <span class="flex items-center gap-1 text-xs text-muted-foreground">
                  <i-lucide name="git-fork" [size]="11"></i-lucide>
                  {{ repo.forks }}
                </span>
              </div>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: []
})
export class GithubSectionComponent implements OnInit {
  readonly store = inject(PortfolioStore);
  
  @ViewChild('scrollContainer') container!: ElementRef;

  grid = computed(() => this.store.githubStats()?.contributions ?? []);
  totalContributions = computed(() => this.store.githubStats()?.totalContributions ?? 0);
  
  weeksArray = computed(() => Array.from({ length: this.grid().length }, (_, i) => i));
  dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];
  
  monthLabels = computed(() => {
    const labels: { label: string; col: number }[] = [];
    const currentGrid = this.grid();
    if (currentGrid.length === 0) return labels;
    
    let lastMonth = -1;
    currentGrid.forEach((week: ContributionDay[], i: number) => {
      const firstDay = new Date(week[0].date);
      const m = firstDay.getMonth();
      if (m !== lastMonth) {
        labels.push({ label: MONTHS[m], col: i });
        lastMonth = m;
      }
    });

    if (labels.length > 1 && labels[1].col - labels[0].col < 2) {
      labels.shift();
    }
    return labels;
  });

  repos: Repo[] = [
    {
      name: "riwaq",
      desc: "A social productivity sanctuary built with Angular and Supabase. Features real-time focus timers and scholarship presence.",
      lang: "Angular",
      stars: 5,
      forks: 2,
      url: "https://github.com/nader035/riwaq",
    },
    {
      name: "marsa-ai",
      desc: "AI engine integration for advanced retrieval and chat capabilities using modern LLMs.",
      lang: "TypeScript",
      stars: 12,
      forks: 3,
      url: "https://github.com/nader035/marsa-ai",
    },
    {
      name: "Cocktail-AngularWithGSAP",
      desc: "Highly interactive cocktail recipe explorer powered by Angular and GSAP animations.",
      lang: "TypeScript",
      stars: 8,
      forks: 1,
      url: "https://github.com/nader035/Cocktail-AngularWithGSAP",
    },
    {
      name: "FlagGuesserV1-AngularProject",
      desc: "Educational game for guessing flags, built with Angular to demonstrate state management.",
      lang: "TypeScript",
      stars: 4,
      forks: 0,
      url: "https://github.com/nader035/FlagGuesserV1-AngularProject",
    },
    {
      name: "Mentor-AngularProject",
      desc: "Comprehensive mentorship platform landing page and dashboard implemented in Angular.",
      lang: "CSS",
      stars: 3,
      forks: 1,
      url: "https://github.com/nader035/Mentor-AngularProject",
    },
    {
      name: "babylove-ecommerce",
      desc: "Modern e-commerce interface for a premium fashion brand, focusing on UI/UX fluidity.",
      lang: "HTML",
      stars: 7,
      forks: 2,
      url: "https://github.com/nader035/babylove-ecommerce",
    },
  ];

  constructor() {
    effect(() => {
      if (this.store.githubStats()) {
        setTimeout(() => this.scrollToEnd(), 100);
      }
    });
  }

  ngOnInit() {}

  scrollToEnd() {
    if (this.container) {
      const el = this.container.nativeElement;
      el.scrollLeft = el.scrollWidth;
    }
  }

  mapLevel(level: string): number {
    const maps: Record<string, number> = {
      'NONE': 0,
      'FIRST_QUARTILE': 1,
      'SECOND_QUARTILE': 2,
      'THIRD_QUARTILE': 3,
      'FOURTH_QUARTILE': 4
    };
    return maps[level] ?? 0;
  }

  getMonthLabel(wi: number): string {
    const found = this.monthLabels().find((m) => m.col === wi);
    return found ? found.label : '';
  }

  getLangColor(lang: string): string {
    const colors: Record<string, string> = {
      TypeScript: "#3178c6",
      JavaScript: "#f1e05a",
      Angular: "#dd0031",
      HTML: "#e34c26",
      CSS: "#563d7c",
      Python: "#3572A5",
      Rust: "#dea584",
      Go: "#00ADD8",
    };
    return colors[lang] ?? "#888";
  }
}
