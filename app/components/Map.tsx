import React, { useEffect, useRef, useState } from 'react';

interface MapProps {
  center: { lat: number; lng: number };
  zoom: number;
  pickupLocation?: { lat: number; lng: number };
  endLocation?: { lat: number; lng: number };
  showRoute: boolean;
  driverLocation?: { lat: number; lng: number };
}

const Map: React.FC<MapProps> = ({ center, zoom, pickupLocation, endLocation, showRoute, driverLocation }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const driverMarkerRef = useRef<google.maps.Marker | null>(null);
  const [routePoints, setRoutePoints] = useState<google.maps.LatLng[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (ref.current && !mapRef.current) {
      mapRef.current = new window.google.maps.Map(ref.current, {
        center,
        zoom,
      });
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        map: mapRef.current,
        suppressMarkers: true,
      });
    }
  }, [center, zoom]);

  useEffect(() => {
    if (mapRef.current && driverLocation) {
      if (!driverMarkerRef.current) {
        driverMarkerRef.current = new google.maps.Marker({
          position: driverLocation,
          map: mapRef.current,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#FF0000",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#FFFFFF",
          },
        });
      } else {
        driverMarkerRef.current.setPosition(driverLocation);
      }
    }
  }, [driverLocation]);

  useEffect(() => {
    if (showRoute && pickupLocation && endLocation && mapRef.current) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: pickupLocation,
          destination: endLocation,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            directionsRendererRef.current?.setDirections(result);
            
            // Extract route points
            const route = result.routes[0];
            const points = route.overview_path.map(point => new google.maps.LatLng(point.lat(), point.lng()));
            setRoutePoints(points);

            // Start animation
            if (driverMarkerRef.current) {
              animateMarker(0);
            }
          }
        }
      );
    } else if (directionsRendererRef.current) {
      directionsRendererRef.current.setDirections({ routes: [] });
      setRoutePoints([]);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [showRoute, pickupLocation, endLocation]);

  const animateMarker = (index: number) => {
    if (index < routePoints.length) {
      if (driverMarkerRef.current) {
        driverMarkerRef.current.setPosition(routePoints[index]);
      }
      animationRef.current = requestAnimationFrame(() => animateMarker(index + 1));
    }
  };

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
};

export default Map;