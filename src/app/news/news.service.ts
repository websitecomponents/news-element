import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const apiKey = '24db0625418841a79826649541c0f569';

@Injectable({
  providedIn: 'root'
})
export class NewsService {


  constructor(private http: HttpClient) { }
// calling data from news api
  initArticle(source, size) {
    return this.http.get('https://newsapi.org/v2/everything?sources=' + source + '&pageSize=' + size + '&apiKey=' + apiKey);
  }

  getArticleById(id) {

  }
}
