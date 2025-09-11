import { useEffect, useState } from "react";

declare global {
  interface Window {
    google: any;
  }
}

export function useCurrentLocation() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setPosition([21.03, 105.85]);
      setAddress("Hà Nội, Việt Nam");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);

        if (window.google && window.google.maps) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode(
            { location: { lat: latitude, lng: longitude } },
            (results: any, status: any) => {
              if (status === "OK" && results[0]) {
                setAddress(results[0].formatted_address);
              } else {
                setAddress("Không tìm thấy địa chỉ");
              }
            }
          );
        } else {
          setAddress("Không thể kết nối Google Maps");
        }
      },
      () => {
        setPosition([21.03, 105.85]);
        setAddress("Hà Nội, Việt Nam");
      }
    );
  }, []);

  return { position, address };
}
