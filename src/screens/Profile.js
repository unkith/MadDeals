import { React, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Button } from 'react-native';
import { useNavigation } from "@react-navigation/native"
import { firebase } from "../../config"
import { Alert } from 'react-native';

const Profile = ({ navigation }) => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const handlePress = (field) => {
    // Handle the press event for each field as needed
    console.log(`Pressed ${field}`);
  };


  const handleFirstNameChange = (text) => {
    setUser({ ...user, firstName: text });
  };

  const handleLastNameChange = (text) => {
    setUser({ ...user, lastName: text });
  };

  const handleEmailChange = (text) => {
    setUser({ ...user, email: text });
  };

  const update = () => {
    const { firstName, lastName, email } = user;
    const currentUser = firebase.auth().currentUser;
    const uid = currentUser.uid;
  
    const updateEmailPromise = email !== '' ? currentUser.updateEmail(email) : Promise.resolve();
    // If email is not empty, update it; otherwise, resolve immediately
  
    updateEmailPromise
      .then(() => {
        if (email !== '') {
          Alert.alert('Success', 'Email updated successfully.');
        }
  
        // Update Firestore document only if the fields are not empty
        const updateData = {};
        if (firstName !== '') {
          updateData.firstName = firstName;
        }
        if (lastName !== '') {
          updateData.lastName = lastName;
        }
        if (email !== '') {
          updateData.email = email;
        }
  
        return firebase.firestore()
          .collection('users')
          .doc(uid)
          .update(updateData);
      })
      .then(() => {
        Alert.alert("Success", "Profile updated successfully")
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        if (email !== '') {
          Alert.alert('Error', error.message);
        }
      });
  };
  



  console.log(firebase.auth().currentUser)

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.bubbleContainer}>
          <Text style={styles.bubbleTitle}>First Name</Text>
          <TextInput
            style={styles.profileItem}
            placeholder="John"
            onChangeText={handleFirstNameChange}
            value={user.firstName}
          />
        </View>

        <View style={styles.bubbleContainer}>
          <Text style={styles.bubbleTitle}>Last Name</Text>
          <TextInput
            style={styles.profileItem}
            placeholder="Doe"
            onChangeText={handleLastNameChange}
            value={user.lastName}
          />
        </View>
      </View>

      <View style={styles.bubbleContainer}>
        <Text style={styles.bubbleTitle}>Email</Text>
        <TextInput
          style={styles.profileItem}
          placeholder="johndoe@example.com"
          onChangeText={handleEmailChange}
          value={user.email}
        />
      </View>

      {/* <View style={styles.bubbleContainer}>
        <Text style={styles.bubbleTitle}>Address 1</Text>
        <TextInput
          style={styles.profileItem}
          placeholder="123 Main St"
          onChangeText={(text) => console.log(`Address 1: ${text}`)}
        />
      </View>

      <View style={styles.bubbleContainer}>
        <Text style={styles.bubbleTitle}>Address 2</Text>
        <TextInput
          style={styles.profileItem}
          placeholder="Unit 456"
          onChangeText={(text) => console.log(`Address 2: ${text}`)}
        />
      </View>

      <View style={styles.addressContainer}>
        <View style={styles.bubbleContainer}>
          <Text style={styles.bubbleTitle}>Zip</Text>
          <TextInput
            style={styles.addressItem}
            placeholder="12345"
            onChangeText={(text) => console.log(`Zip: ${text}`)}
          />
        </View>

        <View style={styles.bubbleContainer}>
          <Text style={styles.bubbleTitle}>City</Text>
          <TextInput
            style={styles.addressItem}
            placeholder="Anytown"
            onChangeText={(text) => console.log(`City: ${text}`)}
          />
        </View>

        <View style={styles.bubbleContainer}>
          <Text style={styles.bubbleTitle}>State</Text>
          <TextInput
            style={styles.addressItem}
            placeholder="CA"
            onChangeText={(text) => console.log(`State: ${text}`)}
          />
        </View>
      </View> */}

      <View style={styles.centeredButton}>
        <Button title="Change Password" onPress={() => navigation.navigate("Reset Password")} />
        <Button title="Update" onPress={() => update()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  bubbleContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  bubbleTitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  profileItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    width: '100%',
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addressItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    marginRight: 5,
  },
  centeredButton: {
    alignItems: 'center',
  },
});

export default Profile;

