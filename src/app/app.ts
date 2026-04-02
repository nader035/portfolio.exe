import { Component, signal, inject, HostListener, ElementRef, ViewChild, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { ThemeService } from './services/theme.service';
import { BootingScreenComponent } from './components/booting-screen/booting-screen.component';
import { Title } from '@angular/platform-browser';
import { PortfolioStore } from './store/portfolio.store';
import { effect } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, FooterComponent, BootingScreenComponent, CommonModule],
  template: `
    <div class="min-h-screen relative overflow-x-hidden" [class.pt-12]="!isBooting()">
      
      @if (isBooting()) {
        <app-booting-screen (completed)="onBootComplete()"></app-booting-screen>
      }

      <!-- Custom Block Cursor -->
      <div #cursor class="custom-cursor"></div>

      @if (!isBooting()) {
        <app-nav></app-nav>

        <!-- Content will be injected here -->
        <main>
          <router-outlet></router-outlet>
        </main>

        <app-footer></app-footer>
      }
    </div>
  `,
  styleUrl: './app.css'
})
export class App implements OnInit {
  @ViewChild('cursor') cursor!: ElementRef;
  isBooting = signal(true);
  themeService = inject(ThemeService);
  private platformId = inject(PLATFORM_ID);
  private store = inject(PortfolioStore);
  private titleService = inject(Title);

  constructor() {
    effect(() => {
      const profile = this.store.profile();
      if (profile) {
        this.titleService.setTitle(`${profile.name} | Portfolio`);
      }
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  onBootComplete() {
    this.isBooting.set(false);
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
