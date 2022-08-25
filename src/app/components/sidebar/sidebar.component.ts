import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';
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

  @Input() toggleSidebar: boolean = false;

  @Output() typeToFilter = new EventEmitter();
  @Output() resetFilters = new EventEmitter();

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
    this.getActors();
    this.getDirectors();
  }

  ngDoCheck(): void {
    this.genres = this.uniqBykeepLast(this.genres, (it: any) => it.id);
    this.years = this.uniqBykeepLast(this.years, (it: any) => it.year);
    this.directors = this.uniqBykeepLast(this.directors, (it: any) => it.id);
    this.actors = this.uniqBykeepLast(this.actors, (it: any) => it.id);

    this.isMobileWidth =
      (window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth) < 480
        ? true
        : false;

    this.getActors();
    this.getDirectors();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getDates();
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
            checked: true,
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
            checked: true,
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
        checked: true,
      };
      this.years.push(object);
    });
    this.series.forEach((series: any) => {
      const object = {
        year: series.releaseYear,
        checked: true,
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
      movie.actors.forEach((actor: any) => {
        this.actors.push(actor);
      });
    });

    this.series.forEach((series: any) => {
      series.actors.forEach((actor: any) => {
        this.actors.push(actor);
      });
    });
    this.actors = this.uniqBykeepLast(this.actors, (it: any) => it.id);
  }

  getDirectors() {
    this.movies.forEach((movie: any) => {
      movie.directors.forEach((director: any) => {
        this.directors.push(director);
      });
    });

    this.series.forEach((series: any) => {
      series.directors.forEach((director: any) => {
        this.directors.push(director);
      });
    });
    this.directors = this.uniqBykeepLast(this.directors, (it: any) => it.id);
  }
  closeFitlers() {
    this.toggleSidebar = !this.toggleSidebar;
  }
  resetFilter() {
    this.filterForm.setValue({
      movie: true,
      series: true,
      watched: true,
      notWatched: true,
      ratingsArray: {
        ratingLess60: true,
        rating60To80: true,
        rating80To90: true,
        ratingMore90: true,
      },
    });
    this.genres.forEach((g: any) => {
      g.checked = true;
    });
    this.years.forEach((year: any) => {
      year.checked = true;
    });
    this.actors.forEach((actor: any) => {
      actor.checked = true;
    });
    this.directors.forEach((director: any) => {
      director.checked = true;
    });
    this.resetFilters.emit();
  }
  valueChanges(arr: any, el: any, $event: any, type: string) {
    arr.map((id: any) => {
      if (id === el) {
        id.checked = $event.checked;
        this.typeToFilter.emit({ id, type });
      }
    });
  }
}
