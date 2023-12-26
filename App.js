import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import React, { useState, useEffect } from "react"
import { firebase } from "./config"
import Login from "./src/screens/Login"
import Registration from "./src/screens/Registration"
import Settings from "./src/screens/Settings"
import Map from "./src/screens/Map"
import Ionicons from "react-native-vector-icons/Ionicons"
import NavigateStack from "./src/screens/NavigateStack"
import SettingsStack from "./src/screens/SettingsStack"

const Tab = createBottomTabNavigator()

function App() {
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState()

  function onAuthStateChanged(user) {
    setUser(user)
    if (initializing) {
      setInitializing(false)
    }
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber
  }, [])

  if (initializing) return null

  return (
    <NavigationContainer>
      {!user ? (
        <Tab.Navigator>
          <Tab.Screen
            name="Login"
            component={Login}
            options={{
              tabBarVisible: false,
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons
                  name={focused ? "ios-person" : "ios-person-outline"}
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Registration"
            component={Registration}
            options={{
              tabBarVisible: false,
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons
                  name={focused ? "ios-person" : "ios-person-outline"}
                  size={size}
                  color={color}
                />
              ),
            }}
          />
        </Tab.Navigator>
      ) : (
        <Tab.Navigator>
          {/* <Tab.Screen
            name="Dashboard"
            component={Dashboard}
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  size={size}
                  color={color}
                />
              ),
            }}
          /> */}
          <Tab.Screen
            name="Home"
            component={NavigateStack}
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  size={size}
                  color={color}
                />
              ),
              headerShown: false
            }}
          />
          <Tab.Screen
            name="Map"
            component={Map}
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons
                  name={focused ? "ios-map" : "ios-map-outline"}
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          {/* <Tab.Screen
            name="Settings"
            component={Settings}
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons
                  name={focused ? "ios-settings" : "ios-settings-outline"}
                  size={size}
                  color={color}
                />
              ),
            }}
          /> */}
          <Tab.Screen
            name="Settings"
            component={SettingsStack}
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons
                  name={focused ? "ios-settings" : "ios-settings-outline"}
                  size={size}
                  color={color}
                />
              ),
              headerShown: false
            }}
          />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  )
}

export default () => {
  return <App />
}
