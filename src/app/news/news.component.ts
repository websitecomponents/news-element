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
  HostListener,
  Directive
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
  constructor(
    private newsServie: NewsService,
    private cd: ChangeDetectorRef,
    private el: ElementRef
  ) {}
  @ViewChild('scrollMe') private myScroller: ElementRef;
  /**
   * Input  sourcepic
   * @returns link of source picture that users wants
   */
  @Input() sourcepic;
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
  blur = [{ title: 'loading' }, { title: 'loading' }];

  articles = [];
  /**
   * card customization
   * backgroundcolor set's background color of card
   * fontsize set's font size in the card
   */
  @Input() backgroundcolor;
  @Input() fontsize;

  /**
   * paragraph customization
   * pcolor set's paragraph color
   * pfontsize set's paragraph font size
   * pfontweight set's paragraph font weight
   */
  @Input() pcolor;
  @Input() pfontsize: any;
  @Input() pfontweight;

  // scroll
  trackArticlesCount: number;
  shouldLoad = true;
  allLoaded = false;
  showReload = false;
  loadingSpinner: boolean;
  articlesize = 5;

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
   * Cards style
   * @returns  returns new style of card
   */
  cardStyle() {
    const styles = {
      'background-color': this.backgroundcolor,
      'font-size': this.fontsize
    };
    return styles;
  }
  /**
   * paragraph style
   * @returns returns new style for paragraph
   */
  pStyle() {
    const style = {
      // tslint:disable-next-line: object-literal-key-quotes
      color: this.pcolor,
      'font-size': this.pfontsize,
      'font-weight': this.pfontweight
    };
    return style;
  }
  /**
   * Calling articles data from service
   */
  async getArticles() {
    this.loadingSpinner = true;
    setTimeout(async () => {
      await this.newsServie
        .initArticle(this.source, this.articlesize)
        .then(data => {
          if (!data) {
            // tslint:disable-next-line:no-unused-expression
            this.articlesize = 5;
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
    }, 2000);
  }

  /**
   * Intinite scrolling
   */
  async scrollHandler(e) {
    console.log(e);
    if (e === 'bottom') {
      if (this.shouldLoad) {
        this.articlesize += 5;
        await this.newsServie
          .initArticle(this.source, this.articlesize)
          .then(articles => {
            articles.subscribe(articlesDate => {
              // tslint:disable-next-line:no-string-literal
              this.articles = articlesDate['articles'];
              this.cd.detectChanges();
              // little tweak for optimization after scroll 4+ time to load more aricles
              if (this.articles.length === this.trackArticlesCount) {
                this.shouldLoad = false;
              } else {
                this.trackArticlesCount = this.articles.length;
              }
            });
          });
        // tslint:disable-next-line: no-string-literal
      } else {
        this.allLoaded = true;
      }
    }
  }
}


@Directive({
  selector: '[appScrollable]'
})
export class ScrollableDirective {

  @Output() scrollPosition = new EventEmitter();

  constructor(public ell: ElementRef) { }

  @HostListener('scroll', ['$event'])
  onScroll(event) {
    try {

      const top = event.target.scrollTop;
      const height = this.ell.nativeElement.scrollHeight;
      const offset = this.ell.nativeElement.offsetHeight;

       // emit top event
      if (top === 0) {
        this.scrollPosition.emit('top');
      }

      // emit bottom event
      if (top > height - offset - 1) {
        this.scrollPosition.emit('bottom');
      }

    } catch (err) {}
  }

}

