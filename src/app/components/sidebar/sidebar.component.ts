import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
  years: any = [];
  actors: any = [];
  directors: any = [];

  moviesSize: number = 0;
  seriesSize: number = 0;

  @Input() toggleSidebar: boolean = false;

  isMobileWidth: boolean =
    (window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth) < 480
      ? true
      : false;

  filterForm!: FormGroup;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getGenre();
    this.filterForm = this.dataService.filterForm;
  }

  ngDoCheck(): void {
    this.moviesSize = this.movies.length;
    this.seriesSize = this.series.length;
    this.genres = this.uniqBykeepLast(this.genres, (it: any) => it.id);
    this.years = this.uniqBykeepLast(this.years, (it: any) => it.year);
    this.actors = this.uniqBykeepLast(this.actors, (it: any) => it.id);
    this.directors = this.uniqBykeepLast(this.directors, (it: any) => it.id);

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
          const object = {
            id: g.id,
            name: g.name,
            checked: false,
          };
          this.genres.push(object);
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.dataService.getGenres('tv').subscribe({
      next: (result) => {
        result.genres.forEach((g: any) => {
          const object = {
            id: g.id,
            name: g.name,
            checked: false,
          };
          this.genres.push(object);
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getDates() {
    this.movies.forEach((movie: any) => {
      const object = {
        year: movie.releaseYear,
        checked: false,
      };
      this.years.push(object);
    });
    this.series.forEach((series: any) => {
      const object = {
        year: series.releaseYear,
        checked: false,
      };
      this.years.push(object);
    });
    let sortedDate = Array.from(this.years).sort(
      (a: any, b: any) => a.year - b.year
    );
    this.years = sortedDate;
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
              const object = {
                id: cast.id,
                name: cast.name,
              };
              this.actors.push(object);
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
              const object = {
                id: cast.id,
                name: cast.name,
              };
              this.actors.push(object);
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
              const object = {
                id: crew.id,
                name: crew.name,
              };
              this.directors.push(object);
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
              const object = {
                id: crew.id,
                name: crew.name,
              };
              this.directors.push(object);
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
  resetFilter() {}
  valueChanges(arr: any, el: any, $event: any) {
    arr.map((id: any) => {
      if (id === el) {
        id.checked = $event.checked;
        console.log(arr);
      }
    });
  }
}
