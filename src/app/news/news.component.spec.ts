import { MatCardModule } from '@angular/material';
import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';

import { NewsComponent } from './news.component';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { NewsService } from './news.service';
import { of, BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('NewsComponent', async () => {
  let component: NewsComponent;
  let fixture: ComponentFixture<NewsComponent>;
  let service: NewsService;
  let spy: jasmine.Spy;

  let debugArticlesTitle: DebugElement[];
  let debugArticlesDescription: DebugElement[];
  const data = require('../../../magazine.json');
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        // tslint:disable-next-line: deprecation
        ScrollDispatchModule,
        HttpClientTestingModule
      ],
      declarations: [NewsComponent],
      providers: [NewsService]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NewsComponent);

    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(NewsService);

    spy = spyOn(service, 'initArticle').and.returnValue(of<any[]>(data));
    fixture.detectChanges();
  }));

  it('should create', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should had same articles title and description from API data and loaded data in html', async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      debugArticlesTitle = fixture.debugElement.queryAll(By.css('.title'));
      console.log('magazine data', data['articles'.toString()]);
      console.log('debugTaskTitle ', debugArticlesTitle);

      debugArticlesDescription = fixture.debugElement.queryAll(
        By.css('.p-style')
      );
      console.log('content', debugArticlesDescription);
      fixture.detectChanges();
      let counter = 0;

      for (counter = 0; counter < 2; counter++) {
        expect(debugArticlesTitle[counter].nativeElement.innerText).toEqual(
          data['articles'.toString()][counter].title
        );
      }

      for (counter = 0; counter < 2; counter++) {
        expect(
          debugArticlesDescription[counter].nativeElement.innerText
        ).toEqual(data['articles'.toString()][counter].description);
      }
    });
  }));

  it('should called service once', async(() => {
    expect(spy).toHaveBeenCalled();
    expect(spy.calls.all().length).toEqual(1);
  }));
  it('should load 2 articles', async(() => {
    expect(2).toBe(component.articles.length);
  }));
});
