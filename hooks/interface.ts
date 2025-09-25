export interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}
export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
  provider: string;
  providerId: string;
  role: "USER" | "ADMIN" | string; // thêm các role khác nếu cần
  createdAt: string | null;
  updatedAt: string | null;
}

export interface Suggestion {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}
export interface Trip {
  id: number;
  startAddress: string;
  endAddress: string;
  distance: number;
  duration: number;
  capacity: number;
  status: 0 | 1 | 2 | 3 | 4;
  startTime: string;
  participants: Participant[];
  rideId: number;
  occupied: number;
  routeGeoJson: string;
}

export interface Participant {
  id: number;
  userId: number;
  userName: string;
  avatar: string;
  note: string;
  status: number;
}
export interface CommentFb {
  id: number;
  userName: string;
  comment: string;
  rating: number;
  createdAt: string;
}
export interface FitBoundsProps {
  polyline: [number, number][];
}

export interface CreateTripPayload {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  startAddress: string;
  endAddress: string;
  capacity: number;
  startTime: string;
}
export interface SearchTripPayload {
  startLat: number | null;
  startLng: number | null;
  endLat: number | null;
  endLng: number | null;
  page: number;
  size: number;
}
export interface FeedbackPayload {
  rating: number;
  comment: string;
}
