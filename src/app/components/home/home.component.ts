import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AppConstants } from '../../app.constant';
import { FormGroup } from '@angular/forms';
import { splicedData } from 'src/app/model/genres';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  movies: any = [];
  series: any = [];
  filteredSet: any = [];
  varType: string = 'Movies&Series';

  filteredType: Set<string> = new Set();
  filteredWatched: Set<string> = new Set();
  filteredRating: Set<number> = new Set();
  filteredYear: Set<string> = new Set();
  filteredGenre: Set<number> = new Set();
  filteredActor: Set<number> = new Set();
  filteredDirector: Set<number> = new Set();

  imageUrl = AppConstants.tmdbImage300;
  movieSize: number = 0;
  seriesSize: number = 0;

  sidebarToggle: boolean = false;

  filterForm!: FormGroup;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getMoviesAndSeries();
    this.filterMovies();
  }

  private filterMovies() {
    this.dataService.filterForm?.valueChanges.subscribe((data) => {
      if (data.movie === true && data.series === true) {
        this.varType = 'Movies&Series';
      } else if (data.movie === true && data.series === false) {
        this.varType = 'Movies';
      } else if (data.movie === false && data.series === true) {
        this.varType = 'Series';
      } else {
        this.varType = '';
      }

      if (data.movie === true) {
        this.filteredType.add('movie');
      } else if (data.movie === false) {
        this.filteredType.delete('movie');
      }

      if (data.watched === true) {
        this.filteredWatched.add('watched');
      } else if (data.watched === false) {
        this.filteredWatched.delete('watched');
      }

      if (data.notWatched === true) {
        this.filteredWatched.add('notWatched');
      } else if (data.notWatched === false) {
        this.filteredWatched.delete('notWatched');
      }

      if (data.series === true) {
        this.filteredType.add('tv');
      } else if (data.series === false) {
        this.filteredType.delete('tv');
      }

      if (data['ratingsArray']!.ratingLess60 === true) {
        this.filteredRating.add(0);
        this.filteredRating.add(60);
      } else if (data['ratingsArray']!.ratingLess60 === false) {
        this.filteredRating.delete(0);
        this.filteredRating.delete(60);
      }

      if (data['ratingsArray']!.rating60To80) {
        this.filteredRating.add(61);
        this.filteredRating.add(80);
      } else if (data['ratingsArray']!.rating60To80 === false) {
        this.filteredRating.delete(61);
        this.filteredRating.delete(80);
      }

      if (data['ratingsArray']!.rating80To90 === true) {
        this.filteredRating.add(81);
        this.filteredRating.add(90);
      } else if (data['ratingsArray']!.rating80To90 === false) {
        this.filteredRating.delete(81);
        this.filteredRating.delete(90);
      }

      if (data['ratingsArray']!.ratingMore90) {
        this.filteredRating.add(91);
        this.filteredRating.add(100);
      } else if (data['ratingsArray']!.ratingMore90 === false) {
        this.filteredRating.delete(91);
        this.filteredRating.delete(100);
      }
      this.filterData();
    });
  }

  /*
   * TODO: why u are using do check ?
   * it will impact performance, use another lifecycle hook
   *
   */
  /**
   * TODO: move tranformation code in the service using pipe(map())
   */
  getMoviesAndSeries() {
    this.filteredType.add('movie');
    this.filteredType.add('tv');
    this.filteredWatched.add('watched');
    this.filteredWatched.add('notWatched');
    this.filteredRating.add(0);
    this.filteredRating.add(60);
    this.filteredRating.add(61);
    this.filteredRating.add(80);
    this.filteredRating.add(81);
    this.filteredRating.add(90);
    this.filteredRating.add(91);
    this.filteredRating.add(100);

    this.dataService.getData('movie').subscribe({
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

          const splicedMovies: splicedData = {
            id: movie.id,
            genreIds: [...movie.genre_ids],
            title: movie.title,
            actors: [],
            directors: [],
            poster: `${this.imageUrl}${movie.poster_path}`,
            ratingValue: movie.vote_average * 10,
            ratings: ratingsArray,
            releaseYear: String(movie.release_date).substring(0, 4),
            type: 'movie',
            isWatched: false,
            isFav: false,
          };
          this.filteredYear.add(splicedMovies.releaseYear);
          splicedMovies.genreIds.forEach((id: any) => {
            this.filteredGenre.add(id);
          });
          this.dataService.getDetails('movie', movie.id).subscribe({
            next: (result) => {
              result.cast.forEach((cast: any) => {
                if (cast.known_for_department === 'Acting') {
                  const object = {
                    id: cast.id,
                    name: cast.name,
                    checked: true,
                  };
                  splicedMovies.actors.push(object);
                  this.filteredActor.add(cast.id);
                }
              });

              result.crew.forEach((crew: any) => {
                if (crew.known_for_department === 'Directing') {
                  const object = {
                    id: crew.id,
                    name: crew.name,
                    checked: true,
                  };
                  splicedMovies.directors.push(object);
                  this.filteredDirector.add(crew.id);
                }
              });
            },
            error: (error: any) => {
              console.log(error);
            },
          });
          return splicedMovies;
        });
        this.filteredSet = this.movies;
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.dataService.getData('tv').subscribe({
      next: (result) => {
        let data = result.results;
        this.series = data.map((movie: any) => {
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

          const splicedSeries: splicedData = {
            id: movie.id,
            genreIds: [...movie.genre_ids],
            title: movie.name,
            actors: [],
            directors: [],
            poster: `${this.imageUrl}${movie.poster_path}`,
            ratings: ratingsArray,
            ratingValue: movie.vote_average * 10,
            releaseYear: String(movie.first_air_date).substring(0, 4),
            type: 'tv',
            isWatched: false,
            isFav: false,
          };
          this.filteredYear.add(splicedSeries.releaseYear);
          splicedSeries.genreIds.forEach((id: any) => {
            this.filteredGenre.add(id);
          });
          this.dataService.getDetails('tv', movie.id).subscribe({
            next: (result: any) => {
              result.cast.forEach((cast: any) => {
                if (cast.known_for_department === 'Acting') {
                  const object = {
                    id: cast.id,
                    name: cast.name,
                    checked: true,
                  };
                  splicedSeries.actors.push(object);
                  this.filteredActor.add(cast.id);
                }
              });

              result.crew.forEach((crew: any) => {
                if (crew.known_for_department === 'Directing') {
                  const object = {
                    id: crew.id,
                    name: crew.name,
                    checked: true,
                  };
                  splicedSeries.directors.push(object);
                  this.filteredDirector.add(crew.id);
                }
              });
            },
            error: (error: any) => {
              console.log(error);
            },
          });
          return splicedSeries;
        });
        this.series.map((m: any) => {
          this.filteredSet.push(m);
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
  }
  onWatchedClick(movie: any) {
    movie.isWatched = !movie.isWatched;
  }

  arrowDown() {
    this.sidebarToggle = !this.sidebarToggle;
  }

  filterHandler(valueEmiited: any) {
    // console.log(valueEmiited);
    const { id, type } = valueEmiited;
    if (type === 'year') {
      if (id.checked === true) {
        this.filteredYear.add(id.year);
      } else if (id.checked === false) {
        this.filteredYear.delete(id.year);
      }
    }
    if (type === 'genre') {
      if (id.checked === true) {
        this.filteredGenre.add(id.id);
      } else if (id.checked === false) {
        this.filteredGenre.delete(id.id);
      }
    }
    if (type === 'actor') {
      if (id.checked === true) {
        this.filteredActor.add(id.id);
      } else if (id.checked === false) {
        this.filteredActor.delete(id.id);
      }
    }
    if (type === 'director') {
      if (id.checked === true) {
        this.filteredDirector.add(id.id);
      } else if (id.checked === false) {
        this.filteredDirector.delete(id.id);
      }
    }
    this.filterData();
  }
  filterData() {
    this.filteredSet = this.movies.filter((m: any) => {
      if (
        this.filteredType.has(m.type) &&
        this.filteredYear.has(m.releaseYear) &&
        this.haveGenre(m.genreIds) &&
        this.isWatched(m.isWatched) &&
        this.haveRating(m.ratingValue) &&
        this.haveActors(m.actors) &&
        this.haveDirectors(m.directors)
      ) {
        return m;
      }
    });
    this.series.map((m: any) => {
      if (
        this.filteredType.has(m.type) &&
        this.filteredYear.has(m.releaseYear) &&
        this.haveGenre(m.genreIds) &&
        this.isWatched(m.isWatched) &&
        this.haveRating(m.ratingValue) &&
        this.haveActors(m.actors) &&
        this.haveDirectors(m.directors)
      ) {
        const series = this.filteredSet.find((m1: any) => m1.id === m.id);
        if (!series) {
          this.filteredSet.push(m);
        }
      }
    });
  }

  haveGenre(genreIds: Array<number>): any {
    let genrePreset = false;
    genreIds.forEach((genreId: number) => {
      if (this.filteredGenre.has(genreId)) {
        genrePreset = true;
      }
    });
    return genrePreset;
  }

  isWatched(watched: Boolean): Boolean {
    if (this.filteredWatched.size === 2) {
      return true;
    } else if (this.filteredWatched.has('watched') && watched === true) {
      return true;
    } else if (this.filteredWatched.has('notWatched') && watched === false) {
      return true;
    }
    return false;
  }

  haveRating(ratingValue: number): Boolean {
    if (
      Math.min(...this.filteredRating) <= ratingValue &&
      Math.max(...this.filteredRating) >= ratingValue
    ) {
      return true;
    } else {
      return false;
    }
  }

  haveActors(actors: Array<any>): boolean {
    let present = false;
    actors.forEach((actor: any) => {
      if (this.filteredActor.has(actor.id)) {
        present = true;
      }
    });
    return present;
  }

  haveDirectors(directors: Array<any>): boolean {
    let present = false;
    directors.forEach((director: any) => {
      if (this.filteredDirector.has(director.id)) {
        present = true;
      }
    });

    return present;
  }
}
