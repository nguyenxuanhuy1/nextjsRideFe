import { useEffect, useState } from "react";
import axios from "axios";
import { ENV } from "@/api/urlApi";

export function useCurrentLocation() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    const fallbackPosition: [number, number] = [21.03, 105.85];
    const fallbackAddress = "Hà Nội, Việt Nam";

    if (!navigator.geolocation) {
      setPosition(fallbackPosition);
      setAddress(fallbackAddress);
      return;
    }

    let canceled = false; // tránh setState khi component unmount

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (canceled) return;

        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);

        try {
          const res = await axios.get(
            `${ENV.MAP_URL}/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );

          if (!canceled) setAddress(res.data.display_name || fallbackAddress);
        } catch (err) {
          console.error(err);
          if (!canceled) setAddress(fallbackAddress);
        }
      },
      (err) => {
        console.error(err);
        if (!canceled) {
          setPosition(fallbackPosition);
          setAddress(fallbackAddress);
        }
      },
    );

    return () => {
      canceled = true;
    };
  }, []);

  return { position, address };
}
