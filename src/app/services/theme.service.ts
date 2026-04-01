import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  darkMode = signal<boolean>(true);

  constructor() {
    // Only run theme initialization in the browser
    if (isPlatformBrowser(this.platformId)) {
      // Load from localStorage if available
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.darkMode.set(savedTheme === 'dark');
      }

      // Effect to apply theme to document element
      effect(() => {
        const isDark = this.darkMode();
        if (isDark) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        }
      });
    }
  }

  toggleTheme() {
    this.darkMode.update(v => !v);
  }
}
