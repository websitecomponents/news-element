import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick, async } from '@angular/core/testing';

import { NewsService } from './news.service';
import { HttpClientModule } from '@angular/common/http';

describe('NewsService',  () => {
  let service: NewsService;
  let httpMock: HttpTestingController;
  beforeEach(async(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule,
    HttpClientModule],
    providers: [NewsService]
  })));
  service = TestBed.get(NewsService);
  httpMock = TestBed.get(HttpTestingController);

  it('should retriev articles from api', async( () => {
    const dummyArticles = [
      {id: 1,
      title: 'hello world',
      contnet: 'testing'
      },
      {id: 2,
        title: 'hello world2',
        contnet: 'testing2'
        },
    ];
    const n = Number;
    const s = String;

    service.initArticle(s, n).then((data) => {
      data.subscribe((articles) => {
        expect(articles).toEqual(dummyArticles);
      });
      const req = httpMock.expectOne(`${service.initArticle(s, n)}`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyArticles);
    });

  }));

});
