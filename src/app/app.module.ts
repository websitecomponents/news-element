
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { from } from 'rxjs';
import { NewsComponent } from './news/news.component';
import {
  MatButtonModule,
  MatCardModule,
  MatMenuModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule
} from '@angular/material';
import {MatIconModule} from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { ScrollableDirective } from './scrollable.directive';
import { createCustomElement } from '@angular/elements';
@NgModule({
  declarations: [ NewsComponent, ScrollableDirective],
  imports: [
    BrowserModule,
    ScrollingModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    VirtualScrollerModule
  ],
  providers: [],
  bootstrap: [],
  entryComponents: [NewsComponent]
})
export class AppModule {
  constructor(private injector: Injector) {}
  ngDoBootstrap() {
    const elements: any[] = [
      [NewsComponent, 'news-wc']
    ];
    for (const [component, name] of elements) {
      const el = createCustomElement(component, {injector: this.injector});
      customElements.define(name, el);
    }

  }
}
