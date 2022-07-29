import { Component, OnInit, Input } from '@angular/core';
import { genre } from 'src/app/model/genres';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Input() movies: any = [];
  genres: Set<genre> = new Set();
  moviesSize: number = 0;
  seriesSize: number = 0;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getGenre();
  }

  getGenre() {
    this.dataService.getMovieGenres().subscribe({
      next: (result) => {
        this.movies.map((movie: any) => {
          movie.type === 'movie' ? this.moviesSize++ : this.seriesSize++;
          movie.genreIds.map((id: number) => {
            result.genres.map((genre: any) => {
              if (id === genre.id) {
                if (this.genres.has(genre)) {
                  genre.size = 2;
                  this.genres.add(genre);
                } else {
                  genre.size = 0;
                  this.genres.add(genre);
                }
              }
            });
          });
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.dataService.getSeriesGenres().subscribe({
      next: (result) => {
        this.movies.map((movie: any) => {
          movie.genreIds.map((id: number) => {
            result.genres.map((genre: any) => {
              if (id === genre.id) {
                if (this.genres.has(genre)) {
                } else {
                  genre.size = 0;
                  this.genres.add(genre);
                }
              }
            });
          });
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
