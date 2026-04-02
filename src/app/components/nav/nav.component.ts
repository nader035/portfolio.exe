import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Sun, Moon } from 'lucide-angular';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <header class="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div class="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between border-r border-l border-border">
        <span class="text-sm text-foreground">
          <span class="text-accent">~</span>/nader035
        </span>

        <nav class="flex items-center gap-1">
          @for (link of navLinks; track link.href) {
            <a
              [href]="link.href"
              [class]="'hidden sm:inline-block text-xs px-2.5 py-1 transition-all border ' + 
                (activeSection() === link.href.slice(1) 
                ? 'text-foreground bg-muted border-border' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 border-transparent hover:border-border')"
            >
              {{ link.label }}
            </a>
          }

          <button
            (click)="themeService.toggleTheme()"
            aria-label="Toggle theme"
            class="w-8 h-8 flex items-center justify-center border border-border hover:border-accent text-muted-foreground hover:text-foreground transition-all ml-2"
          >
            <i-lucide [name]="themeService.darkMode() ? 'sun' : 'moon'" [size]="14"></i-lucide>
          </button>
        </nav>
      </div>
    </header>
  `,
  styles: []
})
export class NavComponent implements OnInit, OnDestroy {
  themeService = inject(ThemeService);
  activeSection = signal<string>('');
  private observer: IntersectionObserver | null = null;
  
  navLinks = [
    { href: "#about", label: "about" },
    { href: "#terminal", label: "terminal" },
    { href: "#github", label: "github" },
    { href: "#projects", label: "projects" },
    { href: "#experience", label: "experience" },
    { href: "#education", label: "edu" },
    { href: "#certifications", label: "certs" },
  ];

  ngOnInit() {
    this.initIntersectionObserver();
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  private initIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '-50% 0px -40% 0px',
      threshold: 0
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.activeSection.set(entry.target.id);
        }
      });
    }, options);

    this.navLinks.forEach(link => {
      const el = document.getElementById(link.href.slice(1));
      if (el) this.observer?.observe(el);
    });
  }
}
