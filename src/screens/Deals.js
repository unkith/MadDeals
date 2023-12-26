// Deals Screen Outline

import { React } from "react"
import { View, Text } from "react-native"
import { useRoute } from '@react-navigation/native';

const Deals = () => {
  const route = useRoute();
  const { dealDetails } = route.params; 

  return (
    <View>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Deal: {dealDetails.title}</Text>
      <Text style={{ fontSize: 16 }}>Description: {dealDetails.description}</Text>
    </View>
  );
};

export default Deals;
