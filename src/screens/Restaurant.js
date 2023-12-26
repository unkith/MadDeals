import { React, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import * as SecureStore from "expo-secure-store"

const Restaurant = (props) => {
  const navigation = useNavigation()
  const restaurant = props.route.params.rest

  const [restName, setRestname] = useState(
    props.route.params.rest.properties.name
  )

  const [address, setAddress] = useState(
    props.route.params.rest.properties.address_line2
  )
  const [distance, setDistance] = useState(
    props.route.params.rest.properties.distance
  )
  const [hours, setHours] = useState(
    props.route.params.rest.properties.datasource.raw.opening_hours
  )

  const initialCuisine =
    props.route.params.rest.properties.datasource.raw.cuisine

  const cuisineFormatted1 = initialCuisine
    ? initialCuisine[0].toUpperCase() + initialCuisine.slice(1)
    : "No info available"

  const cuisineFormatted = cuisineFormatted1.replace(";", ", ").toUpperCase()

  const [cuisine, setCuisine] = useState(cuisineFormatted)

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 26, marginBottom: 10, alignSelf: "center" }}>
        {restName}
      </Text>
      <View style={styles.row}>
        <Text style={styles.label}>Cuisine:</Text>
        {cuisine === null ? (
          <Text style={styles.info}>No info available</Text>
        ) : (
          <Text style={styles.info}>{cuisine}</Text>
        )}
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Coupons:</Text>
        {
  restName === 'Subway' ? (
    <View>
      <Text style={styles.info}>FTL1299</Text>
      <Text style={styles.info}>6FOR9MEAL</Text>
      <Text style={styles.info}>BOGO50</Text>
    </View>
  ) : restName === 'Toppers Pizza' ? (
    <View>
       <Text style={styles.info}>PROMOTION3517</Text>
       <Text style={styles.info}>PROMO4512</Text>
    </View>
  ) : (
    <Text style={styles.info}></Text>
  )
}

        
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Distance:</Text>
        <Text style={styles.info}>{distance} meters</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Hours:</Text>
        {hours === undefined ? (
          <Text style={styles.info}>No info available</Text>
        ) : (
          <Text style={styles.info}>{hours}</Text>
        )}
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Address:</Text>
        <Text style={styles.info}>{address}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Map", {
            location: props.route.params.rest.properties,
          })
        }}
      >
        <Text style={styles.mapLink}>View on map</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 20,
  },
  label: {
    fontWeight: "bold",
    fontSize: 15,
    width: "40%",
  },
  info: {
    width: "60%",
  },
  mapLink: {
    marginTop: 10,
    backgroundColor: "blue",
    alignSelf: "center",
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "blue",
    color: "white",
  },
})

export default Restaurant
