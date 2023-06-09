import { createContext, useState } from "react";

export interface IInitialState {
  filteredMovieState: TMovieType[];
  filterMovieByGenre: (item: TGenre, index: number) => void;
  handleMovies: (movie: TMovieType[], item: TGenre) => void;
  movieState: TMovieType[];
  activeGenreId: number;
}

interface IMovieContextProviderProps {
  // define props here
  children: JSX.Element;
}

const initialState: IInitialState = {
  filteredMovieState: [],
  activeGenreId: 0,

  handleMovies: () => Promise<void>,
  movieState: [],
  filterMovieByGenre: () => Promise<void>,
};

export const MovieContext = createContext<IInitialState>(initialState);
export const MovieProvider = (props: React.PropsWithChildren<IMovieContextProviderProps>) => {
  const [state, setState] = useState(initialState);

  const filterMovieByGenre = (item: TGenre, index: number): void => {
    // check if the selected item is already in active filter in the state
    if (item.id === state.activeGenreId) {
      return;
    }
    const currentFilter = state.movieState.filter((element) => {
      return element.genre_ids.includes(item.id);
    });
    setState({ ...state, filteredMovieState: currentFilter, activeGenreId: item.id });
    // console.log(state.activeGenreId);
  };

  const handleMovies = async (movies: TMovieType[], item: TGenre): Promise<void> => {
    // check if the selected item is already in active filter in the state
    // let currentFilter: TMovieType[] = [];

    const currentFilter = movies.filter((element) => {
      return element.genre_ids.includes(item.id);
    });
    setState({ ...state, movieState: movies, filteredMovieState: currentFilter, activeGenreId: item.id });

    // call the function
  };
  return (
    <MovieContext.Provider
      value={{
        activeGenreId: state.activeGenreId,
        handleMovies: handleMovies,
        filteredMovieState: state.filteredMovieState,
        filterMovieByGenre,
        movieState: state.movieState,
      }}>
      {props.children}
    </MovieContext.Provider>
  );
};
