import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { NewsService } from './news.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { map, tap, scan, mergeMap, throttleTime } from 'rxjs/operators';
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsComponent implements OnInit {
  @ViewChild('scrollMe') private myScroller: ElementRef;
  @Input() source: string;
  @Input() numberofarticles: number;

  articles = [];
  offset = new BehaviorSubject(null);
  infinite: Observable<any[]>;

  // scroll
  trackArticlesCount;
  shouldLoad = true;
  allLoaded = false;
  showReload = false;
  constructor(private newsServie: NewsService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.getBatch();
  }
  // calling data from News Service
  getBatch() {
    return this.newsServie
      .initArticle(this.source, this.numberofarticles)
      .subscribe(data => {
        this.cd.detectChanges();
        if (!data) {
          this.numberofarticles = 4;
          this.trackArticlesCount = 0;
          this.shouldLoad = true;
          this.allLoaded = false;
          console.log('Nothing to Show');
          this.showReload = true;
        } else {
          this.trackArticlesCount = 0;
          this.shouldLoad = true;
          this.allLoaded = false;
          // tslint:disable-next-line:no-string-literal
          this.articles = data['articles'];
          this.cd.detectChanges();
        }
      });
  }

  // Infinite scrolling.
  scrollHandler(e) {
    if (e === 'bottom') {
      this.cd.detectChanges();
      console.log(e);
      if (this.shouldLoad) {
        this.cd.detectChanges();
        this.numberofarticles += 4;
        this.newsServie
          .initArticle(this.source, this.numberofarticles)
          .subscribe(articles => {
            this.cd.detectChanges();
            this.articles = [];
            // tslint:disable-next-line: no-string-literal
            this.articles = articles['articles'];
            this.cd.detectChanges();
            // little tweak for optimization after scroll 4+ time to load more aricles
            if (this.articles.length === this.trackArticlesCount) {
              this.shouldLoad = false;
              this.cd.detectChanges();
            } else {
              this.trackArticlesCount = this.articles.length;
              this.cd.detectChanges();
            }
          });
      } else {
        this.allLoaded = true;
        this.cd.detectChanges();
      }
    }
  }
}
