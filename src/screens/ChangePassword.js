import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import firebase from "firebase/compat"

const ChangePassword = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [entryError, setEntryError] = useState("")

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      setEntryError("Passwords do not match!")
      return
    }

    const user = firebase.auth().currentUser

    user
      .updatePassword(newPassword)
      .then(() => {
        Alert.alert("Success", "Password updated successfully.")
      })
      .catch((error) => {
        Alert.alert("Error", error.message)
      })
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 26, marginBottom: 30 }}>Reset Password</Text>
      <View style={styles.bubbleContainer}>
        <Text style={styles.bubbleTitle}>New Password</Text>
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter new password"
          secureTextEntry
          value={newPassword}
          onChangeText={(text) => {
            setNewPassword(text)
            setEntryError("")
          }}
        />
      </View>

      <View style={styles.bubbleContainer}>
        <Text style={styles.bubbleTitle}>Confirm Password</Text>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm new password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text)
            setEntryError("")
          }}
        />
        {entryError ? <Text style={styles.errorText}>{entryError}</Text> : null}
      </View>

      <View style={styles.centeredButton}>
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={handleChangePassword}
        >
          <Text style={[styles.buttonText, { color: "#EAF5EC" }]}>
            Reset Password
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  bubbleContainer: {
    marginBottom: 20,
    width: "80%",
  },
  bubbleTitle: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333", // Adjust color based on your design
  },
  passwordInput: {
    height: 40,
    borderColor: "#ccc", // Adjust border color based on your design
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 5,
    alignSelf: "center",
    marginTop: 10,
  },
  centeredButton: {
    width: "50%", // Adjust width based on your design
  },
  signUpButton: {
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: "#1C251E",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 5,
  },
})

export default ChangePassword
