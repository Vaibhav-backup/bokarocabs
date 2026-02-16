
export interface RoutePrice {
  destination: string;
  time: string;
  distance: string;
  sedan: number;
  ertiga: number;
}

export type TripType = 'One Way' | 'Round Trip' | 'Local Rental' | 'Event Cabs';

export interface BookingState {
  from: string;
  to: string;
  date: string;
  time: string;
  tripType: TripType;
}
