import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppConstants } from '../app.constant';

const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public result: any;
  private baseApiUrl = AppConstants.tmdbUrl;

  constructor(private http: HttpClient) {}

  public getMovies(): Observable<any> {
    return this.http.get(
      this.baseApiUrl + `/trending/all/week?api_key=${environment.apiKey}`,
      { headers }
    );
  }
}
