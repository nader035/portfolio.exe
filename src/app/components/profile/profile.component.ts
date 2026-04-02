import { Component, inject, ChangeDetectionStrategy, signal, computed, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PortfolioStore } from '../../store/portfolio.store';
import { LucideAngularModule } from 'lucide-angular';
import { SectionComponent } from '../section/section.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, SectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (store.profile()) {
      @let p = store.profile()!;
      <app-section>
        <div class="flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
          
          <!-- Progressive Tech Avatar -->
          <div class="relative group">
            <!-- Animated Progress Border -->
            <div 
              class="absolute -inset-1.5 border border-accent/20 rounded-none -z-10 transition-all duration-1000"
              [style.transform]="'rotate(' + (loadingProgress() * 3.6) + 'deg)'"
              [class.opacity-0]="isLoaded()"
            ></div>

            <div class="relative w-32 h-32 border-2 border-accent bg-muted/20 shadow-[0_0_20px_rgba(var(--accent-rgb),0.1)] overflow-hidden">
              <!-- Grid Overlay (Tech look) -->
              <div class="absolute inset-0 z-10 bg-[linear-gradient(rgba(28,80,52,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(28,80,52,0.05)_1px,transparent_1px)] bg-[size:8px_8px] pointer-events-none"></div>

              <img 
                src="/assets/nader.jpg" 
                alt="Avatar"
                class="w-full h-full object-cover grayscale-[0.3] brightness-110 transition-all duration-1000"
                [style.filter]="blurFilter()"
                [class.grayscale-0]="isLoaded()"
              />
              
              <!-- Simulation Status Overlay -->
              @if (!isLoaded()) {
                <div class="absolute inset-x-0 bottom-0 py-1 bg-accent/90 text-accent-foreground text-[7px] font-mono text-center uppercase tracking-[0.2em] font-bold z-20">
                  Buffer_{{ Math.round(loadingProgress()) }}%
                </div>
              } @else {
                <!-- Clean "Online" Indicator -->
                <div class="absolute top-2 right-2 z-20 flex items-center gap-1.5 px-1.5 py-0.5 bg-background/80 backdrop-blur-sm border border-green-500/30">
                  <span class="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse"></span>
                  <span class="text-[7px] font-mono text-green-500 font-bold uppercase tracking-tighter">System_Online</span>
                </div>
              }
            </div>
          </div>

          <div>
            <h1 class="text-4xl sm:text-6xl font-black text-foreground tracking-tighter uppercase mb-2 animate-in slide-in-from-left duration-500 text-glow">
              {{ p.name }}
            </h1>
            <p class="text-lg sm:text-2xl text-muted-foreground font-mono tracking-wide">
              <span class="text-accent underline decoration-accent/30 underline-offset-8 decoration-2">{{ p.role }}</span>
            </p>
          </div>
        </div>
      </app-section>

      <app-section>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="flex items-center gap-4 group cursor-pointer">
            <div class="w-10 h-10 border border-border flex items-center justify-center text-accent group-hover:border-accent group-hover:bg-accent/5 transition-all">
              <i-lucide name="map-pin" [size]="18"></i-lucide>
            </div>
            <span class="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{{ p.location }}</span>
          </div>

          <a [href]="'tel:' + p.phone" class="flex items-center gap-4 group">
            <div class="w-10 h-10 border border-border flex items-center justify-center text-accent group-hover:border-accent group-hover:bg-accent/5 transition-all">
              <i-lucide name="phone" [size]="18"></i-lucide>
            </div>
            <span class="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{{ p.phone }}</span>
          </a>

          <a [href]="'mailto:' + p.email" class="flex items-center gap-4 group">
            <div class="w-10 h-10 border border-border flex items-center justify-center text-accent group-hover:border-accent group-hover:bg-accent/5 transition-all">
              <i-lucide name="mail" [size]="18"></i-lucide>
            </div>
            <span class="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors truncate">{{ p.email }}</span>
          </a>

          <a [href]="p.github" target="_blank" class="flex items-center gap-4 group">
            <div class="w-10 h-10 border border-border flex items-center justify-center text-accent group-hover:border-accent group-hover:bg-accent/5 transition-all">
              <i-lucide name="github" [size]="18"></i-lucide>
            </div>
            <span class="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors truncate">github.com/nader035</span>
          </a>

          <a [href]="p.linkedin" target="_blank" class="flex items-center gap-4 group">
            <div class="w-10 h-10 border border-border flex items-center justify-center text-accent group-hover:border-accent group-hover:bg-accent/5 transition-all">
              <i-lucide name="linkedin" [size]="18"></i-lucide>
            </div>
            <span class="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors truncate">linkedin.com/in/nader0305</span>
          </a>
          
        </div>
      </app-section>
    } @else if (store.isLoading()) {
      <app-section>
        <div class="flex flex-col sm:flex-row items-center gap-8 animate-pulse opacity-50">
          <!-- Avatar Skeleton -->
          <div class="relative w-32 h-32 bg-muted/40 border-2 border-border/50 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent"></div>
          </div>

          <!-- Text Skeleton -->
          <div class="space-y-4 w-full max-w-md">
            <div class="h-10 sm:h-14 bg-muted/60 w-3/4"></div>
            <div class="h-6 bg-muted/40 w-1/2"></div>
          </div>
        </div>
      </app-section>

      <!-- Contact Info Skeleton -->
      <app-section>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-30">
          @for (i of [1, 2, 3, 4, 5]; track i) {
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-muted/40"></div>
              <div class="h-4 bg-muted/30 w-32"></div>
            </div>
          }
        </div>
      </app-section>
    }
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class ProfileComponent implements OnInit, OnDestroy {
  readonly store = inject(PortfolioStore);
  protected readonly Math = Math;
  private platformId = inject(PLATFORM_ID);
  
  loadingProgress = signal<number>(0);
  isLoaded = signal<boolean>(false);
  
  blurFilter = computed(() => {
    const progress = this.loadingProgress();
    const blurValue = Math.max(0, 16 - (progress / 100) * 16);
    return `blur(${blurValue}px)`;
  });

  private interval: any;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startSimulation();
    }
  }

  ngOnDestroy() {
    if (this.interval) clearInterval(this.interval);
  }

  private startSimulation() {
    const duration = 3000; // 3 seconds
    const interval = 30;
    const steps = duration / interval;
    const increment = 100 / steps;

    this.interval = setInterval(() => {
      this.loadingProgress.update(p => {
        if (p >= 100) {
          this.isLoaded.set(true);
          clearInterval(this.interval);
          return 100;
        }
        return p + increment;
      });
    }, interval);
  }
}
