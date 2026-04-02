import { Directive, ElementRef, OnInit, OnDestroy, inject, input } from '@angular/core';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  
  delay = input<number>(0);
  threshold = input<number>(0.1);
  direction = input<'up' | 'down' | 'left' | 'right'>('up');

  private observer: IntersectionObserver | null = null;

  ngOnInit() {
    // Initial styles
    const element = this.el.nativeElement;
    element.style.opacity = '0';
    element.style.transition = `all 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${this.delay()}ms`;
    
    const translateValue = '30px';
    switch (this.direction()) {
      case 'up': element.style.transform = `translateY(${translateValue})`; break;
      case 'down': element.style.transform = `translateY(-${translateValue})`; break;
      case 'left': element.style.transform = `translateX(${translateValue})`; break;
      case 'right': element.style.transform = `translateX(-${translateValue})`; break;
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          element.style.opacity = '1';
          element.style.transform = 'translate(0, 0)';
          this.observer?.unobserve(element);
        }
      });
    }, {
      threshold: this.threshold()
    });

    this.observer.observe(element);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
