import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import firebase from "firebase/compat"

const Settings = () => {
  const navigation = useNavigation()

  const navigateToProfile = () => {
    navigation.navigate("Profile")
  }

  const navigateToOtherSettings = () => {
    navigation.navigate("Other Settings")
  }

  return (
    <View style={styles.container}>
      {/* Profile Card */}
      <TouchableOpacity style={styles.card} onPress={navigateToProfile}>
        <Text style={styles.cardText}>Profile</Text>
      </TouchableOpacity>

      {/* Other Settings Card */}
      {/* <TouchableOpacity style={styles.card} onPress={navigateToOtherSettings}>
        <Text style={styles.cardText}>Other Settings</Text>
      </TouchableOpacity> */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("Reset Password")}
      >
        <Text style={styles.cardText}>Reset Password</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={() => firebase.auth().signOut()}
      >
        <Text style={styles.cardText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2, // Add elevation for Android shadows
    shadowColor: "#000", // Add shadow for iOS shadows
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardText: {
    fontSize: 15,
  },
})

export default Settings
