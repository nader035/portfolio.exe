import { Component, signal, inject, HostListener, ElementRef, ViewChild, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, FooterComponent],
  template: `
    <div class="min-h-screen relative overflow-x-hidden pt-12">

      <!-- Custom Block Cursor -->
      <div #cursor class="custom-cursor"></div>

      <app-nav></app-nav>

      <!-- Content will be injected here -->
      <main>
        <router-outlet></router-outlet>
      </main>

      <app-footer></app-footer>
    </div>
  `,
  styleUrl: './app.css'
})
export class App implements OnInit {
  @ViewChild('cursor') cursor!: ElementRef;
  protected readonly title = signal('portfolio-angular');
  themeService = inject(ThemeService);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (this.cursor) {
      this.cursor.nativeElement.style.left = e.clientX + 'px';
      this.cursor.nativeElement.style.top = e.clientY + 'px';
    }
  }

  @HostListener('document:mousedown')
  onMouseDown() {
    if (this.cursor) this.cursor.nativeElement.style.transform = 'scale(0.8)';
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    if (this.cursor) this.cursor.nativeElement.style.transform = 'scale(1)';
  }
}
