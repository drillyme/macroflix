import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AppConstants } from '../../app.constant';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  movies: any = [];
  yetToWatchMovies: any = [];
  watchedMovies: any = [];
  imageUrl = AppConstants.tmdbImage300;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getMovies();
  }

  ngDoCheck(): void {
    if (this.movies.length && !this.watchedMovies.length) {
      this.yetToWatchMovies = this.movies.filter(
        (m: any) => !m.isFav && !m.isWatched
      );
      this.watchedMovies = this.movies.filter((m: any) => m.isWatched);
    }
    console.log(this.movies);
  }

  getMovies() {
    this.dataService.getMovies().subscribe({
      next: (result) => {
        let data = result.results;
        this.movies = data.map((movie: any) => {
          var ratingsArray = Array.apply(null, Array(5).fill(0));
          let i;
          for (i = 0; i < Math.floor(movie.vote_average / 2); i++) {
            ratingsArray[i] = 1;
          }
          let x = movie.vote_average / 2;
          let y = Math.floor(movie.vote_average / 2);
          if (x - y > 0) {
            if (x - y <= 0.25) {
              ratingsArray[i] = 0;
            } else if (x - y > 0.25 && x - y <= 0.75) {
              ratingsArray[i] = 0.5;
            } else {
              ratingsArray[i] = 1;
            }
          }

          const splicedMovies = {
            id: movie.id,
            genreIds: [...movie.genre_ids],
            title: movie.title,
            poster: `${this.imageUrl}${movie.poster_path}`,
            ratings: ratingsArray,
            releaseYear: String(movie.release_date).substring(0, 4),
            type: movie.media_type,
            isWatched: false,
            isFav: false,
          };

          return splicedMovies;
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getClassOfMovie(movie: any) {
    if (movie.isWatched && movie.isFav) {
      return 'state1';
    } else if (!movie.isWatched && movie.isFav) {
      return 'state2';
    } else if (!movie.isWatched && !movie.isFav) {
      return 'state3';
    } else {
      return 'state4';
    }
  }

  onFavClick(movie: any) {
    movie.isFav = !movie.isFav;
    movie.isWatched = movie.isFav ? true : movie.isWatched;
    if (movie.isWatched) {
      const alreadyWatched = this.watchedMovies.find(
        (m: any) => m.id === movie.id
      );
      if (alreadyWatched) {
        alreadyWatched.isFav = movie.isFav;
        this.watchedMovies = this.watchedMovies.map((m: any) => {
          if (m.id === movie.id) {
            return movie;
          }
          return m;
        });
      } else {
        this.watchedMovies.push(movie);
      }
      this.yetToWatchMovies = this.yetToWatchMovies.filter(
        (m: any) => m.id !== movie.id
      );
    } else {
      this.watchedMovies = this.watchedMovies.filter(
        (m: any) => m.id !== movie.id
      );
      this.yetToWatchMovies.push(movie);
    }
  }
  onWatchedClick(movie: any) {
    movie.isWatched = !movie.isWatched;
    movie.isFav = movie.isWatched ? movie.isFav : false;
    if (movie.isWatched) {
      this.watchedMovies.push(movie);
      this.yetToWatchMovies = this.yetToWatchMovies.filter(
        (m: any) => m.id !== movie.id
      );
    } else {
      this.yetToWatchMovies.push(movie);
      this.watchedMovies = this.watchedMovies.filter(
        (m: any) => m.id !== movie.id
      );
    }
  }
}
