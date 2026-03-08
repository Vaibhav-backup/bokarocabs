export interface Lead {
  id: string;
  name: string;
  phone: string;
  address: string;
  vehicleType: string;
  status: 'new' | 'contacted' | 'booked' | 'cancelled';
  createdAt: string;
  bookingDetails: {
    from: string;
    to: string;
    date: string;
    time: string;
    tripType: string;
    event?: string;
  };
}

export interface RoutePrice {
  id: string;
  destination: string;
  time: string;
  distance: string;
  sedan: number;
  ertiga: number;
}

export interface Car {
  id: string;
  name: string;
  models: string;
  capacity: string;
  type: string;
}

export interface TourPackage {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  image_url?: string;
  created_at?: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
