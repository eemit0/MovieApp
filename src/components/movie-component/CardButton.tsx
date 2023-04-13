import { FlatList, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";
import React, { useContext, useState } from "react";
import { GenreCard } from "./GenreCard";
import { ItemSeparator } from "./ItemSeparator";
import COLORS from "../../constants/color";
import { GlobalContext } from "../../context/GlobalState";

export const CardButtons = ({ Genre }) => {
  const [active, setActive] = useState<number>(0);
  const { filterMovieByGenre } = useContext(GlobalContext);
  return (
    <View style={{ marginLeft: 8 }}>
      <FlatList
        data={Genre}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <ItemSeparator width={20} />}
        ListFooterComponent={() => <ItemSeparator width={20} />}
        renderItem={({ item, index }) => {
          const handleActive = () => {
            setActive(index);
            console.log("genre item", item);
            console.log("genre index", index);
            filterMovieByGenre(item, index);
          };
          const selectedButton: ViewStyle = active === index ? { backgroundColor: COLORS.ACTIVE } : { backgroundColor: COLORS.WHITE };
          const selectedText: TextStyle = active === index ? { color: COLORS.WHITE, fontWeight: "800" } : { color: COLORS.BLACK };

          return (
            <TouchableOpacity onPress={handleActive} key={index}>
              <GenreCard genre={item} isSelected={selectedButton} selectedText={selectedText} />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};
