import { Observable } from 'rxjs';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick, async } from '@angular/core/testing';

import { NewsService } from './news.service';
import { HttpClientModule } from '@angular/common/http';
import { expect, spy } from 'expect';


describe('NewsService', () => {
  let service: NewsService;
  let httpMock: HttpTestingController;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule],
      providers: [NewsService]
    });
    service = TestBed.get(NewsService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should retriev articles from api', fakeAsync(async () => {
    const spy1 = jasmine.createSpy();
    let dummyArticles;
    const n = 2;
    const s = 'new-york-magazine';
    const apiKey = '768c2adc37a143cb8688e12c40382c9f';
    await service.initArticle(s, n).then(data => {
      data.subscribe(articles => {
        expect(articles['articles']).toExist();
        spy1();
        dummyArticles = articles['articles'];
        console.log(dummyArticles);
      });
     // const req = httpMock.expectOne('https://newsapi.org/v2/everything?sources=' + s + '&pageSize=' + n + '&apiKey=' + apiKey);
     // expect(req.request.method).toBe('GET');

     // req.flush(true);
    });
    expect(spy1.calls.count()).toEqual(1);
  }));
});
