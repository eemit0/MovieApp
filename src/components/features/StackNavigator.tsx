import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { RootStackParamList } from "../../../types/global";
import DetailsMovieScreen from "../../screens/DetailsMovieScreen";
import HomeScreen from "../../screens/HomeScreen";
import LoginScreen from "../../screens/LoginScreen";
import React, { useContext, useEffect, useState } from "react";
import WatchListScreen from "../../screens/WatchlistScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "./Loader";
import { getGenreMovie } from "../../services/api-services";
import { GlobalContext } from "../../context/GlobalState";
import { Genre } from "src/services";
import { fetchGenreItem } from "./handleFunctions";

export const RootStack = createNativeStackNavigator<RootStackParamList>();

export const StackNavigator = () => {
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { storeGenre } = useContext(GlobalContext);

  const handleLogin = async () => {
    //const authenticationResult = await submitByFaceId();
    const data = await AsyncStorage.getItem("userLoggedIn");
    if (data) {
      const resGenre = await fetchGenreItem();
      storeGenre(resGenre);
      if (data.endsWith("e")) {
        setUserLoggedIn(true);
      }
    } else {
      //const resGenre = await fetchGenreItem();
      // storeGenre(resGenre);
    }
    console.log("userLoggedIn", userLoggedIn);
    try {
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleLogin();
    setTimeout(() => setLoading(false), 1000);
  }, []);
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerShown: false }}>
        <>
          <RootStack.Screen name="HomeScreen" component={HomeScreen} />
          <RootStack.Screen name="DetailScreen" component={DetailsMovieScreen} />
          <RootStack.Screen name="WatchlistScreen" component={WatchListScreen} />
        </>

        <RootStack.Screen name="LoginScreen" component={LoginScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
