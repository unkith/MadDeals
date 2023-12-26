import {
  Alert,
  Button,
  TextInput,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native"
import React, { useState } from "react"
import { firebase } from "../../config"
import { useNavigation } from "@react-navigation/native"
import { useEffect } from "react"
import * as Location from "expo-location"

const Registration = () => {
  const navigation = useNavigation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [location, setLocation] = useState()
  const [entryError, setEntryError] = useState("")

  registerUser = async (email, password, firstName, lastName, location) => {
    if (!email || !password || !firstName || !lastName) {
      setEntryError("Error: Please fill in all fields!")
      return
    }

    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .set({
            firstName,
            lastName,
            email,
            location,
          })
      })
      .catch((error) => {
        setEntryError("Please provide a valid email!")
        return
      })
  }

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        console.log("Please Grant Location Permission!")
        return
      }

      let currentLocation = await Location.getCurrentPositionAsync({})
      setLocation(currentLocation)
      console.log("Location: ")
      console.log(currentLocation)
    }
    getPermissions()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 36, marginBottom: 10 }}>
        Sign Up for MadDeals!
      </Text>
      <Text style={styles.inputName}>First Name</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        onChangeText={(text) => setFirstName(text)}
      />
      <Text style={styles.inputName}>Last Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        onChangeText={(text) => setLastName(text)}
      />
      <Text style={styles.inputName}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => {
          setEmail(text)
          setEntryError("")
        }}
        keyboardType="email-address"
      />
      <Text style={styles.inputName}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => {
          setPassword(text)
          setEntryError("")
        }}
        secureTextEntry={true}
      />
      {entryError ? <Text style={styles.errorText}>{entryError}</Text> : null}
      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() =>
          registerUser(email, password, firstName, lastName, location)
        }
      >
        <Text style={[styles.buttonText, { color: "#EAF5EC" }]}>Signup</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.neverMind}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={[styles.buttonText, { color: "#1C251E" }]}>
          Nevermind!
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    width: 200,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    marginTop: 16,
    paddingHorizontal: 10,
  },
  inputName: {
    fontSize: 16,
    marginBottom: 1,
  },
  signUpButton: {
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: "#1C251E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 5,
  },
  neverMind: {
    marginTop: 10,
    backgroundColor: "#EAF5EC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 5,
  },
  grayWhiteButton: {
    backgroundColor: "gray",
    color: "white",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
    fontWeight: "bold",
  },
})
export default Registration
