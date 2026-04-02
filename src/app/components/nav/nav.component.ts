import { Component, inject, OnInit, OnDestroy, signal, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LucideAngularModule, Sun, Moon } from 'lucide-angular';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <header class="fixed top-0 w-full z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div class="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between border-r border-l border-border">
        <a href="#about" class="text-sm text-foreground hover:text-accent transition-colors">
          <span class="text-accent">~</span>/nader035
        </a>

        <nav class="flex items-center gap-1">
          @for (link of navLinks; track link.href) {
            <a
              [href]="link.href"
              [class]="'hidden sm:inline-block text-[10px] uppercase font-bold tracking-tighter px-2.5 py-1 transition-all border ' + 
                (activeSection() === (link.href === '#' ? 'about' : link.href.slice(1)) 
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
  platformId = inject(PLATFORM_ID);
  activeSection = signal<string>('');
  private observer: IntersectionObserver | null = null;
  
  navLinks = [
    { href: "#about", label: "about" },
    { href: "#terminal", label: "terminal" },
    { href: "#github", label: "github" },
    { href: "#projects", label: "projects" },
    { href: "#skills", label: "skills" },
    { href: "#experience", label: "exp" },
    { href: "#education", label: "edu" },
    { href: "#certifications", label: "certs" },
    { href: "#contact", label: "contact" },
  ];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      if (window.scrollY < 100) {
        this.activeSection.set('about');
      }
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Small delay to ensure DOM is ready
      setTimeout(() => this.initIntersectionObserver(), 100);
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  private initIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Target the top part of the viewport
      threshold: 0
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.activeSection.set(entry.target.id);
        }
      });
    }, options);

    // Observe all sections mentioned in navLinks
    this.navLinks.forEach(link => {
      const id = link.href === '#' ? 'about' : link.href.slice(1);
      const el = document.getElementById(id);
      if (el) this.observer?.observe(el);
    });
  }
}
