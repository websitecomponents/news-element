import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const apiKey = '768c2adc37a143cb8688e12c40382c9f';

@Injectable({
  providedIn: 'root'
})

export class NewsService {
  API_URL = 'https://newsapi.org/v2/everything?sources=new-york-magazine';


  constructor(private http: HttpClient) { }

 /**
  * Callin data from the newsAPI
  * @param  {} source - Source of news that user define
  * @param  {} size - Number of how many news user whant's to fetch at once
  */
 async initArticle(source, size) {
    return await this.http.get('https://newsapi.org/v2/everything?sources=' + source + '&pageSize=' + size + '&apiKey=' + apiKey);
  }

 async getArticles() {
    return await this.http.get(this.API_URL);
  }

  getArticleById(id) {

  }
}
