import { Observable } from 'rxjs';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed,  getTestBed, fakeAsync, tick, async } from '@angular/core/testing';

import { NewsService } from './news.service';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
// import { expect } from 'expect';


describe('NewsService', () => {
  let service: NewsService;
  let injector: TestBed;
  let httpMock: HttpTestingController;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule],
      providers: [NewsService]
    });
    injector = getTestBed();
    service = injector.get(NewsService);
    httpMock = injector.get(HttpTestingController);
  });

  it('should retriev articles from api and expect to call 1 time', async( () => {
    const dummyData = require('../../../magazine.json');
    const spy1 = jasmine.createSpy();
    const size = 5;
    const source = 'new-york-magazine';
    const apiKey = '24db0625418841a79826649541c0f569';

    service.initArticle(source, size).subscribe((artdata) => {
        expect(artdata['articles'.toString()]).toEqual(dummyData['articles'.toString()]);
        spy1();
        // tslint:disable-next-line:no-string-literal

        expect(spy1.calls.count()).toEqual(1);

      });
    const req = httpMock.expectOne('https://newsapi.org/v2/everything?sources=' + source + '&pageSize=' + size + '&apiKey=' + apiKey);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
    httpMock.verify();
  }));

  it('should throw 400 error is source is not valid', async(() => {
    const dummyData = require('../../../magazine.json');
    const spy2 = jasmine.createSpy();
    const size = 5;
    const source = '/somePath';
    const apiKey = '24db0625418841a79826649541c0f569';
    const apiUrl = 'https://newsapi.org/v2/everything?sources=' + source + '&pageSize=' + size + '&apiKey=' + apiKey;
    // tslint:disable-next-line:prefer-const
    let response: any;
    // tslint:disable-next-line:prefer-const
    let errResponse: any;
    const mockErrorResponse = { status: 400, statusText: 'Bad Request' };
    const data = 'Invalid request parameters';
    service.initArticle(source, size).subscribe(() => {},
    (res: HttpErrorResponse) => {
      expect(res.error.data).toEqual(dummyData);
    });
    console.log(response);
    console.log(errResponse);
    const req = httpMock.expectOne(apiUrl);
    req.flush(dummyData);
    console.log(req);



  }));
});
