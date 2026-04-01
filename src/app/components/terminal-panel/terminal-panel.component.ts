import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terminal-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [id]="id()" [class]="'border border-border ' + className()">
      <!-- Title bar -->
      <div class="flex items-center gap-2 border-b border-border px-4 py-2 bg-muted/40">
        <span [class]="'w-2 h-2 rounded-full ' + getDotColor() + ' flex-shrink-0'"></span>
        <span class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {{ label() }}
        </span>
      </div>
      <!-- Content -->
      <div class="px-5 py-5">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: []
})
export class TerminalPanelComponent {
  id = input<string | undefined>();
  label = input.required<string>();
  statusDot = input<"green" | "amber" | "red" | undefined>();
  className = input<string>("");

  getDotColor(): string {
    switch (this.statusDot()) {
      case "green": return "bg-green-500";
      case "amber": return "bg-yellow-500";
      case "red": return "bg-red-500";
      default: return "bg-muted-foreground/30";
    }
  }
}
