import React from "react";
import { StackNavigator } from "./src/components/features//StackNavigator";
import { GlobalProvider } from "./src/context/GlobalState";
import { WatchlistProvider } from "./src/context/WatchlistContext/WatchlistContext";
import { MovieProvider } from "./src/context/movieContext/MovieContext";

import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { DetailProvider } from "./src/context/detail-context/DetailContext";

function App() {
  return (
    <React.Fragment>
      <GlobalProvider>
        <MovieProvider>
          <DetailProvider>
            <WatchlistProvider>
              <SafeAreaView>
                <StatusBar barStyle={"light-content"} translucent={true} />
              </SafeAreaView>
              <StackNavigator />
            </WatchlistProvider>
          </DetailProvider>
        </MovieProvider>
      </GlobalProvider>
    </React.Fragment>
  );
}

export default App;
