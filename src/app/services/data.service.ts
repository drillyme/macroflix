import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppConstants } from '../app.constant';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private baseApiUrl = AppConstants.tmdbUrl;

  // TODO: add more dynamic controls or formArray
  filterForm = new FormGroup({
    movie: new FormControl(true),
    series: new FormControl(true),
    watched: new FormControl(true),
    notWatched: new FormControl(true),
    ratingsArray: new FormGroup({
      ratingLess60: new FormControl(false),
      rating60To80: new FormControl(false),
      rating80To90: new FormControl(false),
      ratingMore90: new FormControl(false),
    }),
  });

  constructor(private http: HttpClient) {}

  public getData(type: string): Observable<any> {
    return this.http.get(
      this.baseApiUrl +
        `discover/${type}?api_key=${environment.apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`,
      { headers }
    );
  }

  public getGenres(type: string): Observable<any> {
    return this.http.get<any>(
      this.baseApiUrl + `genre/${type}/list?api_key=${environment.apiKey}`,
      { headers }
    );
  }

  public getDetails(type: string, id: string): Observable<any> {
    return this.http.get<any>(
      this.baseApiUrl +
        `/${type}/${id}//credits?api_key=${environment.apiKey}&language=en-US`,
      { headers }
    );
  }
}
