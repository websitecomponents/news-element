import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const apiKey = '24db0625418841a79826649541c0f569';

@Injectable({
  providedIn: 'root'
})

export class NewsService {
  API_URL = 'https://newsapi.org/v2/everything?sources=new-york-magazine&apiKey=24db0625418841a79826649541c0f569';


  constructor(private http: HttpClient) { }

 /**
  * Callin data from the newsAPI
  * @param  {} source - Source of news that user define
  * @param  {} size - Number of how many news user whant's to fetch at once
  */
 initArticle(source, size) {
    return  this.http.get('https://newsapi.org/v2/everything?sources=' + source + '&pageSize=' + size + '&apiKey=' + apiKey);
  }

  getArticles() {
    return  this.http.get(this.API_URL);
  }

}
