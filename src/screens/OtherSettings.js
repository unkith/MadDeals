import React, { useState } from 'react';
import { View, Switch, Text, StyleSheet } from 'react-native';

const OtherSettings = () => {
  const [locationServicesEnabled, setLocationServicesEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const toggleLocationServices = () => {
    setLocationServicesEnabled(!locationServicesEnabled);
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingContainer}>
        <Text style={styles.settingTitle}>Location Services</Text>
        <Text style={styles.settingDescription}>
          Allow MadDeals to use location services
        </Text>
        <Switch
          value={locationServicesEnabled}
          onValueChange={toggleLocationServices}
        />
      </View>

      <View style={styles.settingContainer}>
        <Text style={styles.settingTitle}>Notifications</Text>
        <Text style={styles.settingDescription}>
          Allow MadDeals to enable Notifications
        </Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  settingContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  settingTitle: {
    fontSize: 18,
    marginBottom: 5,
  },
  settingDescription: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
});

export default OtherSettings;
