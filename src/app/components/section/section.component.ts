import { Component, input } from '@angular/core';

@Component({
  selector: 'app-section',
  standalone: true,
  template: `
    <div [id]="id()" class="border-b border-border w-full px-6 scroll-mt-12">
      <div class="max-w-5xl mx-auto px-6 py-10 border-r border-l border-border">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: []
})
export class SectionComponent {
  id = input<string | undefined>();
}
