import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  HostListener
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
  /**
   * @param  {string;} source
   * @returns string- Source of news that user decide
   */
  @Input() source: string;
  /**
   * @param  {number;} numberofarticles
   * @returns number - Number of how many news user whant's to fetch at once
   */
  @Input() numberofarticles: number;
/**
 * @param  {boolean;} top
 * @returns boolean - Position of card that show's article name and picture.
 * If user set top="true" position of articles name and picture will be set at the top, default is on bottom
 */
  @Input() top: boolean;

  /**
   * blur it set of how much blur card you want before fully loading news
   */
  blur = [1, 2];

  articles = [];

  // scroll
  trackArticlesCount: number;
  shouldLoad = true;
  allLoaded = false;
  showReload = false;
  loadingSpinner: boolean;
  constructor(
    private newsServie: NewsService,
    private cd: ChangeDetectorRef,
    private el: ElementRef
  ) {}

  ngOnInit() {
    /**
     * if source if define by user then it will call getArticles from service
     * else it will show warrning
     */
    if (this.source) {
      this.getArticles();
    } else {
      console.log('you have to set source');
    }
  }
  /**
   * Calling articles data from service
   */
  async getArticles() {
    this.loadingSpinner = true;
    setTimeout(async () => {
      await this.newsServie
        .initArticle(this.source, this.numberofarticles)
        .then(data => {
          if (!data) {
            this.numberofarticles = 4;
            this.trackArticlesCount = 0;
            this.shouldLoad = true;
            this.allLoaded = false;
            this.loadingSpinner = false;
            console.log('Nothing to Show');
            this.showReload = true;
          } else {
            data.subscribe(articlesData => {
              this.loadingSpinner = false;
              this.trackArticlesCount = 0;
              this.shouldLoad = true;
              this.allLoaded = false;
              // tslint:disable-next-line:no-string-literal
              this.articles = articlesData['articles'];
              this.cd.detectChanges();
              return this.articles;
            });
          }
        });
      return this.articles;
    });
  }


  /**
   * Intinite scrolling
   */
  async scrollHandler(e) {
    if (e === 'bottom') {
      this.cd.detectChanges();
      console.log(e);
      if (this.shouldLoad) {
        this.cd.detectChanges();
        this.numberofarticles += 4;
        await this.newsServie
          .initArticle(this.source, this.numberofarticles)
          .then(articles => {
            this.cd.detectChanges();
            articles.subscribe(articlesDate => {
              // tslint:disable-next-line:no-string-literal
              this.articles = articlesDate['articles'];
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
          });
        // tslint:disable-next-line: no-string-literal
      } else {
        this.allLoaded = true;
        this.cd.detectChanges();
      }
    }
  }
}
