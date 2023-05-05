import { FlatList, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import React, { useContext, useState } from "react";
import { ViewCard } from "./ViewCard";
import { ItemSeparator } from "./ItemSeparator";
import color from "../../constants/Color";
import { setHeight } from "../../constants/style-component/viewComponent";

interface ICard<T> {
  id: string;
  value: T;
}
// const genres: TGenre[] = [];

// const providerCardData: ICard[] = genres.map((eachGenre) => ({ id: eachGenre.id, value: eachGenre.name }));

interface ICardButtons<T> {
  data: ICard<T>[];
  handlePress: (item: T, index: number) => void;
}

export const ListCardButtons = <T extends string>({ data, handlePress }: ICardButtons<T>) => {
  const [active, setActive] = useState<number>(0);
  return (
    <View
      style={{
        marginLeft: 32,
        paddingVertical: 24,
        width: "85%",
        height: setHeight(10),
      }}>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <ItemSeparator width={20} />}
        ListFooterComponent={() => <ItemSeparator width={20} />}
        renderItem={({ item, index }) => {
          const handleActive = () => {
            setActive(index);
            handlePress(item, index);
          };
          const selectedButton: ViewStyle =
            active === index ? { backgroundColor: color.ACTIVE } : { backgroundColor: color.BASIC_BACKGROUND };
          const selectedText: TextStyle = active === index ? { color: color.SECONDARY_COLOR, fontWeight: "800" } : { color: color.BLACK };

          return (
            <TouchableOpacity onPress={handleActive} key={index}>
              <ViewCard genre={item} isSelected={selectedButton} selectedText={selectedText} />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};