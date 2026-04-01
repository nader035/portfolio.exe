import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="border-t border-border mt-10 mb-0 font-mono">
      <div class="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground/60 border-r border-l border-border">
        <div class="flex items-center gap-2">
          <span class="text-accent underline decoration-accent/30 decoration-2 underline-offset-4">nader035</span>
          <span>&copy; {{ currentYear }}</span>
        </div>
        <div class="flex items-center gap-5">
          <span class="hover:text-foreground transition-colors cursor-default">Angular 21</span>
          <span class="w-1 h-1 rounded-full bg-border"></span>
          <span class="hover:text-foreground transition-colors cursor-default">Tailwind 4</span>
          <span class="w-1 h-1 rounded-full bg-border"></span>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
