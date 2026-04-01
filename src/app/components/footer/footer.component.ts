import { Component, inject } from '@angular/core';
import { PortfolioStore } from '../../store/portfolio.store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="border-t border-border mt-10 mb-0 font-mono px-6">
      <div class="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-muted-foreground/60 border-r border-l border-border">
        <div class="flex items-center gap-3">
          <span class="text-accent underline decoration-accent/30 decoration-2 underline-offset-4 font-bold text-[13px]">nader035</span>
          <span class="opacity-40">&copy; {{ currentYear }}</span>
        </div>

        <div class="flex items-center gap-6">
          <a [href]="'mailto:' + store.profile()?.email" class="hover:text-accent transition-colors flex items-center gap-2 group">
            <span class="w-1.5 h-1.5 rounded-full bg-accent group-hover:animate-ping"></span>
            get in touch: <span class="text-foreground/80 font-medium group-hover:text-accent">{{ store.profile()?.email || 'naderas109@gmail.com' }}</span>
          </a>
          
          <div class="hidden md:flex items-center gap-4 opacity-40">
             <span>Angular 21</span>
             <span>Tailwind 4</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent {
  readonly store = inject(PortfolioStore);
  currentYear = new Date().getFullYear();
}
