import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
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
          <div class="w-24 h-24 border-2 border-accent flex items-center justify-center text-3xl font-bold text-accent bg-accent/5 rounded-none rotate-3 hover:rotate-0 transition-transform duration-500 flex-shrink-0">
            {{ p.initials }}
          </div>
          <div>
            <h1 class="text-4xl sm:text-6xl font-black text-foreground tracking-tighter uppercase mb-2 animate-in slide-in-from-left duration-500">
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
          <div class="flex items-center gap-4 group">
            <div class="w-10 h-10 border border-border flex items-center justify-center text-accent group-hover:border-accent transition-colors">
              <i-lucide name="map-pin" [size]="18"></i-lucide>
            </div>
            <span class="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{{ p.location }}</span>
          </div>

          <a [href]="'tel:' + p.phone" class="flex items-center gap-4 group">
            <div class="w-10 h-10 border border-border flex items-center justify-center text-accent group-hover:border-accent transition-colors">
              <i-lucide name="phone" [size]="18"></i-lucide>
            </div>
            <span class="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{{ p.phone }}</span>
          </a>

          <a [href]="'mailto:' + p.email" class="flex items-center gap-4 group">
            <div class="w-10 h-10 border border-border flex items-center justify-center text-accent group-hover:border-accent transition-colors">
              <i-lucide name="mail" [size]="18"></i-lucide>
            </div>
            <span class="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors truncate">{{ p.email }}</span>
          </a>

          <a [href]="p.github" target="_blank" class="flex items-center gap-4 group">
            <div class="w-10 h-10 border border-border flex items-center justify-center text-accent group-hover:border-accent transition-colors">
              <i-lucide name="github" [size]="18"></i-lucide>
            </div>
            <span class="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors truncate">github.com/nader035</span>
          </a>

          <a [href]="p.linkedin" target="_blank" class="flex items-center gap-4 group">
            <div class="w-10 h-10 border border-border flex items-center justify-center text-accent group-hover:border-accent transition-colors">
              <i-lucide name="linkedin" [size]="18"></i-lucide>
            </div>
            <span class="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors truncate">linkedin.com/in/nader0305</span>
          </a>
          
        </div>
      </app-section>
    } @else if (store.isLoading()) {
      <div class="animate-pulse">
        <div class="h-48 border-b border-border bg-muted/20"></div>
        <div class="h-32 border-b border-border bg-muted/10"></div>
      </div>
    }
  `,
  styles: []
})
export class ProfileComponent {
  readonly store = inject(PortfolioStore);
}
