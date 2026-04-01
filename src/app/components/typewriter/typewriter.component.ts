import { Component, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, map, scan, take, startWith } from 'rxjs';

@Component({
  selector: 'app-typewriter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="font-mono">
      {{ (displayText$ | async) ?? '' }}<span class="animate-pulse border-r-2 border-accent ml-0.5" aria-hidden="true"></span>
    </span>
  `,
  styles: []
})
export class TypewriterComponent implements OnInit {
  text = input.required<string>();
  speed = input<number>(50); // ms per character
  delay = input<number>(500); // ms before starting

  displayText$ = interval(50).pipe(
    take(1), // placeholder for initial delay if needed
    map(() => ''),
    startWith('')
  );

  ngOnInit() {
    this.displayText$ = interval(this.speed()).pipe(
      map(i => this.text()[i]),
      scan((acc, curr) => acc + (curr ?? ''), ''),
      take(this.text().length + 1)
    );
  }
}
