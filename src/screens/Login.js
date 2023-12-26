import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert
} from "react-native"
import React, { useState } from "react"
import { firebase } from "../../config"
import { useNavigation } from "@react-navigation/native"

const Login = () => {
  const navigation = useNavigation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [entryError, setEntryError] = useState("")

  loginUser = async (email, user) => {
    if (!email || !password) {
      setEntryError("Error: You must provide an email and password")
      return
    }

    try {
      await firebase.auth().signInWithEmailAndPassword(email, password)
    } catch (error) {
      setEntryError("Error: Invalid email or password")
    }
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 36, marginBottom: 10 }}>MadDeals</Text>
      <Text style={styles.inputName}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
      />
      <Text style={styles.inputName}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
      />
      {entryError ? <Text style={styles.errorText}>{entryError}</Text> : null}
      <TouchableOpacity
        onPress={() => loginUser(email, password)}
        style={styles.loginButton}
      >
        <Text style={[styles.buttonText, { color: "#EAF5EC" }]}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.newHere}>New Here?</Text>

      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => navigation.navigate("Registration")}
      >
        <Text style={[styles.buttonText, { color: "#1C251E" }]}>Sign Up</Text>
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
  signUpandGuest: {
    flexDirection: "row",
  },
  newHere: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginButton: {
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
  signUpButton: {
    backgroundColor: "#EAF5EC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 5,
  },

  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 5,
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
    marginTop: 5,
    marginBottom: 5,
  },
})
export default Login
