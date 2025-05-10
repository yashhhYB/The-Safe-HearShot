import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import Breadcrumb from "../components/Breadcrumb";
import Input from "../components/Input";
import { useState } from "react";
import Tag from "../components/Tag";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FilterScreen({ navigation }) {
  const [radius, setRadius] = useState("");
  const [filters, setFilters] = useState(["Stabbing", "Suicide"]);

  const handleDelete = (filterToDelete) => {
    const updatedFilters = filters.filter(
      (filter) => filter !== filterToDelete
    );
    setFilters(updatedFilters);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Breadcrumb navigation={navigation} pageName={"Filters"} />
      <Text style={styles.title}>Settings</Text>
      <Input
        caption={"Enter radius in miles"}
        onChange={(number) => setRadius(number)}
        contentType={"none"}
        keyboardType={"numeric"}
        placeholder={"10"}
        state={radius}
      />
      <Text style={styles.title}>Filters</Text>
      <Input
        caption={"Add filtered words"}
        contentType={"none"}
        keyboardType={"default"}
        autoCorrect={false}
        placeholder={"Fire"}
        state={filters}
        blurOnSubmit={true}
        returnKeyType="done"
        onSubmitEditing={(filter) => {
          const newFilter = filter.nativeEvent.text.trim().toLowerCase();
          if (newFilter && !filters.includes(newFilter)) {
            setFilters([...filters, newFilter]);
          }
        }}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          marginVertical: 16,
          flexWrap: "wrap",
        }}
      >
        {filters.map((filter) => (
          <Tag key={filter} filter={filter} onDelete={handleDelete} />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 16,
    backgroundColor: "#1C1C1E",
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
});
