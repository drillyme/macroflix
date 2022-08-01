import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Input() movies: any = [];
  @Input() series: any = [];
  genres: any = [];
  year: Set<String> = new Set();
  actors: Set<String> = new Set();
  directors: Set<String> = new Set();

  moviesSize: number = 0;
  seriesSize: number = 0;

  @Input() toggleSidebar: boolean = false;

  isMobileWidth: boolean =
    (window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth) < 480
      ? true
      : false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getGenre();
  }

  ngDoCheck(): void {
    this.moviesSize = this.movies.length;
    this.seriesSize = this.series.length;
    this.genres = this.uniqBykeepLast(this.genres, (it: any) => it.id);
    this.isMobileWidth =
      (window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth) < 480
        ? true
        : false;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getDates();
    this.getActors();
    this.getDirectors();
  }

  uniqBykeepLast(data: any, key: any) {
    return [...new Map(data.map((x: any) => [key(x), x])).values()];
  }

  getGenre() {
    this.dataService.getGenres('movie').subscribe({
      next: (result) => {
        result.genres.forEach((g: any) => {
          this.genres.push(g);
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.dataService.getGenres('tv').subscribe({
      next: (result) => {
        result.genres.forEach((g: any) => {
          this.genres.push(g);
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getDates() {
    this.movies.forEach((movie: any) => {
      this.year.add(movie.releaseYear);
    });
    this.series.forEach((series: any) => {
      this.year.add(series.releaseYear);
    });
    let sortedDate = Array.from(this.year).sort((a: any, b: any) => a - b);
    this.year = new Set(sortedDate);
  }

  getActors() {
    this.movies.forEach((movie: any) => {
      this.dataService.getDetails('movie', movie.id).subscribe({
        next: (result: any) => {
          result.cast.forEach((cast: any) => {
            if (
              cast.known_for_department === 'Acting' &&
              cast.popularity >= 50
            ) {
              this.actors.add(cast.name);
            }
          });
        },
        error: (error: any) => {
          console.log(error);
        },
      });
    });

    this.series.forEach((series: any) => {
      this.dataService.getDetails('tv', series.id).subscribe({
        next: (result: any) => {
          result.cast.forEach((cast: any) => {
            if (
              cast.known_for_department === 'Acting' &&
              cast.popularity >= 80
            ) {
              this.actors.add(cast.name);
            }
          });
        },
        error: (error: any) => {
          console.log(error);
        },
      });
    });
  }

  getDirectors() {
    this.movies.forEach((movie: any) => {
      this.dataService.getDetails('movie', movie.id).subscribe({
        next: (result: any) => {
          result.crew.forEach((crew: any) => {
            if (
              crew.known_for_department === 'Directing' &&
              crew.popularity >= 4
            ) {
              this.directors.add(crew.name);
            }
          });
        },
        error: (error: any) => {
          console.log(error);
        },
      });
    });

    this.series.forEach((series: any) => {
      this.dataService.getDetails('tv', series.id).subscribe({
        next: (result: any) => {
          result.crew.forEach((crew: any) => {
            if (
              crew.known_for_department === 'Directing' &&
              crew.popularity >= 4
            ) {
              this.directors.add(crew.name);
            }
          });
        },
        error: (error: any) => {
          console.log(error);
        },
      });
    });
  }
  closeFitlers() {
    this.toggleSidebar = !this.toggleSidebar;
  }
}
