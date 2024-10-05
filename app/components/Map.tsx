import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { useLocationStore } from "@/store"; // Assuming you have a location store

const Map = () => {
  const { userLongitude, userLatitude } = useLocationStore();

  // Default region if user location is not available
  const region = {
    latitude: userLatitude || 37.78825,
    longitude: userLongitude || -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  if (!userLatitude && !userLongitude) {
    return (
      <View className="flex justify-between items-center w-full h-full">
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  }

  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      className="w-full h-full rounded-2xl"
      initialRegion={region}
      showsUserLocation={true}
      userInterfaceStyle="light"
    >
      {/* You can add Markers here */}
    </MapView>
  );
};

export default Map;
