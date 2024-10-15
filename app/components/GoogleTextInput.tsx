import React, { useRef, useEffect } from 'react';
import Image from 'next/image';

interface GoogleTextInputProps {
  icon?: string;
  containerStyle?: string;
  handlePress: (location: { latitude: number; longitude: number; address: string }) => void;
  placeholder?: string;
}

const GoogleTextInput: React.FC<GoogleTextInputProps> = ({
  icon,
  containerStyle,
  handlePress,
  placeholder,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google && inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current);
      autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
    }

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place && place.geometry && place.geometry.location) {
      const location = {
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        address: place.formatted_address || '',
      };
      handlePress(location);
    }
  };

  return (
    <div className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle}`}>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        {icon && <Image src={icon} alt="Search icon" width={24} height={24} />}
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder || "Search"}
        className="w-full py-2 pl-10 pr-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default GoogleTextInput;