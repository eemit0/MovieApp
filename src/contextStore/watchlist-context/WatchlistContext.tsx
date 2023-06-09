import { createContext, useState } from "react";
import { fetchWatchlist } from "../../components/utils/handleFunctions";

export interface IInitialState {
  getWatchlistData: () => void;
  watchlistState: TMovieType[];
}
interface IWatchlistProviderProps {
  // define props here
  children?: React.ReactNode;
}

const initialState: IInitialState = {
  watchlistState: [],
  getWatchlistData: () => Promise<void>,
};

export const WatchlistContext = createContext<IInitialState>(initialState);

export const WatchlistProvider = (props: React.PropsWithChildren<IWatchlistProviderProps>) => {
  const [state, setState] = useState(initialState);

  const getWatchlistData = async (): Promise<void> => {
    const responseWatchlist = await fetchWatchlist();
    if (responseWatchlist !== undefined) {
      setState({ ...state, watchlistState: responseWatchlist });
    }
  };
  return (
    <WatchlistContext.Provider
      value={{
        watchlistState: state.watchlistState,
        getWatchlistData,
      }}>
      {props.children}
    </WatchlistContext.Provider>
  );
};
