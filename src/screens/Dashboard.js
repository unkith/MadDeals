import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Modal,
  Button,
  // Picker
} from "react-native"
import { useState, useEffect, useRef } from "react"
import { firebase } from "../../config"
import React from "react"
import { useNavigation } from "@react-navigation/native"
import * as Location from "expo-location"
import { Feather } from "@expo/vector-icons"

const Dashboard = () => {
  const navigation = useNavigation()
  const textInputRef = useRef(null)
  const [name, setName] = useState("")
  const [user, setUser] = useState("")
  const [street, setStreet] = useState("")
  const [pCode, setPcode] = useState("")
  const [address, setAddress] = useState("")
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [radius, setRadius] = useState("1000")
  const [popular, setPopular] = useState([])
  const [topPick, setTopPicks] = useState([])
  const [location, setLocation] = useState(null)
  const [addr, setAddr] = useState("")
  const [currentLocation, setCurrentLocation] = useState(null)
  const [todaysPick, setTodaysPick] = useState(null)
  const [selectedCategories, setSelectedCategories] = useState([ "restaurant, fast_food"])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [deals, setDeals] = useState([]);

  // Takes the users current location
  useEffect(() => {
    ;(async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied")
        return
      }

      let currentLocation = await Location.getCurrentPositionAsync({})
      setCurrentLocation(currentLocation)
    })()
  }, [])

  // Takes in the users address and geocodes it to get the coordinates
  useEffect(() => {
    const addressToCoordinates = async () => {
      try {
        let location = await Location.geocodeAsync(address)
        if (location.length > 0) {
          setLatitude(location[0].latitude)
          setLongitude(location[0].longitude)
        } else {
          setLatitude(null)
          setLongitude(null)
        }
      } catch (error) {
        console.error("Error geocoding address:", error)
        setLatitude(null)
        setLongitude(null)
      }
    }

    addressToCoordinates()
  }, [address])

  // Reinitialize fields 
  const clearAddress = () => {
    setLatitude(null)
    setLongitude(null)
    if (textInputRef.current) {
      textInputRef.current.clear()
    }
  }

  // Current Date to randomize Todays pick
  const currentDate = new Date()
  const dayOfMonth = currentDate.getDate()
  const randomNum = (dayOfMonth % 10) + 6

  
  // Toggles categories based on users choice
  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((item) => item !== category)
      )
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }


  var requestOptions = {
    method: "GET",
  }

  // Creates URL for custom search
  const generateUrl = () => {
    let categories = ""

    if (selectedCategories.includes("restaurant")) {
      categories += "catering.restaurant,"
    }

    if (selectedCategories.includes("fast_food")) {
      categories += "catering.fast_food,"
    }

    categories = categories.replace(/,$/, "")

    const lat =
      latitude !== null
        ? parseFloat(latitude).toFixed(6)
        : currentLocation && currentLocation.coords.latitude
        ? parseFloat(currentLocation.coords.latitude).toFixed(6)
        : 0.0

    const lon =
      longitude !== null
        ? parseFloat(longitude).toFixed(6)
        : currentLocation && currentLocation.coords.longitude
        ? parseFloat(currentLocation.coords.longitude).toFixed(6)
        : 0.0

    const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lon},${lat},${radius}&bias=proximity:${lon},${lat}&limit=10&apiKey=54e1a62e66a34d32a0f17b1de7af1121`
    // const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:,${radius}&bias=proximity:&limit=10&apiKey=54e1a62e66a34d32a0f17b1de7af1121`
    return url
  }

  // API requests
  useEffect(() => {
    const lat =
      currentLocation && currentLocation.coords.latitude
        ? parseFloat(currentLocation.coords.latitude).toFixed(6)
        : 0.0

    const lon =
      currentLocation && currentLocation.coords.longitude
        ? parseFloat(currentLocation.coords.longitude).toFixed(6)
        : 0.0

    fetch(
      `https://api.geoapify.com/v2/places?categories=catering.restaurant,catering.fast_food&filter=circle:${lon},${lat},1000&bias=proximity:${lon},${lat}&limit=20&apiKey=54e1a62e66a34d32a0f17b1de7af1121`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        setPopular(data.features.slice(0, 5))
        setTodaysPick(data.features[randomNum])
      })
      .catch((error) => {
        console.log("error", error)
      })

    const url = generateUrl()

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setTopPicks(data.features)
      })
      .catch((error) => {
        console.log("error", error)
      })
  }, [
    radius,
    selectedCategories,
    latitude,
    longitude,
    address,
    currentLocation,
  ])

  // Toggle Modal open and close
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userSnapshot = await firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .get()

        if (userSnapshot.exists) {
          const userData = userSnapshot.data()
          setUser(userData)

          const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
            longitude: userData.location.coords.longitude,
            latitude: userData.location.coords.latitude,
          })

          const { name, postalCode } = reverseGeocodedAddress[0]
          setStreet(name)
          setPcode(postalCode)
        } else {
          console.log("User Does Not Exist")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  // COUPONS
  // -- Web scraping logic -- not functioning
  // useEffect(() => {
  //   const fetchDeals = async (latitude, longitude) => {
  //     try {
  //       const response = await axios.get('http://localhost:5001//api/deals', {
  //         params: {
  //           latitude,
  //           longitude,
  //         },
  //       });
    
  //       const deals = response.data;
  //       console.log(deals);
  //     } catch (error) {
  //       console.error('Error fetching deals:', error);
  //     }
  //   };

  //   fetchDeals();
  // }, []);

  /* Coupoins -- API LOGIC --

  useEffect(() => {
    const lat =
      currentLocation && currentLocation.coords.latitude
        ? parseFloat(currentLocation.coords.latitude).toFixed(6)
        : 0.0

    const lon =
      currentLocation && currentLocation.coords.longitude
        ? parseFloat(currentLocation.coords.longitude).toFixed(6)
        : 0.0

    fetch(
      `INSERT_API_URL_WITH_LOCATION`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        setDeals(data)
      })
      .catch((error) => {
        console.log("error", error)
      })
  }, []);

  */

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 26 }}>Hello, {user.firstName}</Text>
      <View style={styles.locationContainer}>
        <TouchableOpacity onPress={() => clearAddress()}>
          <Feather
            style={{ margin: 3 }}
            name="map-pin"
            size={20}
            color="blue"
          />
        </TouchableOpacity>
        <TextInput
          ref={textInputRef}
          style={{
            fontSize: 18,
            padding: 10,
          }}
          placeholder={`${street}, ${pCode}`}
          onChangeText={setAddr}
        />
        <TouchableOpacity onPress={() => setAddress(addr)}>
          <Feather
            style={{ margin: 3 }}
            name="search"
            size={20}
            color="black"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={toggleModal} style={styles.openModalButton}>
        <Text style={styles.openModalButtonText}>Filters</Text>
      </TouchableOpacity>
      <ScrollView>
        <Text style={{ fontWeight: "bold", marginBottom: 5, fontSize: 29 }}>
          Today's Pick
        </Text>
        <View>
          <View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Restaurant", { rest: todaysPick })
              }
            >
              {todaysPick ? (
                <View style={styles.card}>
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    {todaysPick.properties.name}
                  </Text>
                  <Text style={{ color: "white" }}>
                    {todaysPick.properties.distance} meters away
                  </Text>
                </View>
              ) : (
                <Text>Loading...</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Text style={{ fontWeight: "bold" }}>Popular Restaurants</Text>
          <Text style={{ marginBottom: 5 }}>
            Check out what people around you have been trying:
          </Text>
          <ScrollView vertical style={{ width: "100%" }}>
            {Object.values(popular).map((restaurant, index) => (
              <View key={index}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Restaurant", { rest: restaurant })
                  }
                >
                  <View style={styles.card}>
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      {restaurant.properties.name}
                    </Text>
                    <Text style={{ color: "white" }}>
                      {restaurant.properties.distance} meters away
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            toggleModal()
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text
                style={{ marginTop: 10, marginBottom: 10, fontWeight: "bold" }}
              >
                Choose Radius (feet):
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "gray",
                  margin: 10,
                  padding: 5,
                }}
                placeholder="Enter radius"
                keyboardType="number-pad"
                value={radius}
                onChangeText={(text) => setRadius(text)}
              />

              <Text
                style={{ marginTop: 10, marginBottom: 10, fontWeight: "bold" }}
              >
                Choose Restaurant Type:
              </Text>
              <TouchableOpacity
                onPress={() => toggleCategory("restaurant")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    height: 24,
                    width: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: selectedCategories.includes("restaurant")
                      ? "blue"
                      : "black",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {selectedCategories.includes("restaurant") && (
                    <View
                      style={{
                        height: 12,
                        width: 12,
                        borderRadius: 6,
                        backgroundColor: "blue",
                      }}
                    />
                  )}
                </View>
                <Text style={{ marginLeft: 10 }}>Restaurant</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => toggleCategory("fast_food")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    height: 24,
                    width: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: selectedCategories.includes("fast_food")
                      ? "blue"
                      : "black",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {selectedCategories.includes("fast_food") && (
                    <View
                      style={{
                        height: 12,
                        width: 12,
                        borderRadius: 6,
                        backgroundColor: "blue",
                      }}
                    />
                  )}
                </View>
                <Text style={{ marginLeft: 10 }}>Fast Food</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.openModalButton}>
                <Text style={styles.openModalButtonText} onPress={toggleModal}>
                  See Results
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View>
          <Text style={{ fontWeight: "bold" }}>
            Top picks based on your preferences:
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <ScrollView vertical>
              {topPick !== undefined ? (
                Object.values(topPick).map((restaurant, index) => (
                  <View key={index}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("Restaurant", { rest: restaurant })
                      }
                    >
                      <View style={styles.card}>
                        <Text style={{ color: "white", fontWeight: "bold" }}>{restaurant.properties.name}</Text>
                        <Text style={{ color: "white" }}>{restaurant.properties.distance} meters</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text>Please expand search criteria</Text>
              )}
            </ScrollView>
          </View>
        </View>
        
        {/* Coupon display logic - Not properly functioning */}
        <View>
          <Text style={{ fontWeight: "bold" }}>
            Top deals in your location:
          </Text>
          <ScrollView>
            {deals.map((deal, index) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  navigation.navigate("Deals", { rest: deal })
                }
              >
                <View style={styles.card}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    {deal.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start", 
    paddingTop: 20, 
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 20,
  },
  locationContainer: {
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    width: 325,
    marginTop: 10,
  },
  card: {
    padding: 16,
    elevation: 5,
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: "#232b2b",
    bordercolor: "#ddd",
    elevation: 2, 
    shadowColor: "#414a4c", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    margin: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  openModalButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
    marginBottom: 10,
  },
  openModalButtonText: {
    color: "black",
    fontSize: 16,
  },
  checkbox: {
    alignSelf: "center",
  },
})

export default Dashboard;
