export interface genre {
  id: string;
  name: string;
  size: number;
}

export interface splicedData {
  id: number;
  genreIds: Array<number>;
  title: string;
  actors: Array<number>;
  directors: Array<number>;
  poster: string;
  ratings: Array<any>;
  ratingValue: number;
  releaseYear: string;
  type: string;
  isWatched: Boolean;
  isFav: Boolean;
}

export interface rating {
  lowerBound: number;
  upperBound: number;
}
