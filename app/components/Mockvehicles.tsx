// Mock vehicle data
interface Vehicle {
  id: string;
  name: string;
  seats: number;
  price: string;
  driver: {
    id: string;
    name: string;
    rating: number;
    bio: string;
  };
}

export const vehicles: Vehicle[] = [
  {
    id: "v1",
    name: "Kids Van",
    seats: 6,
    price: "€2.40/ride",
    driver: {
      id: "d1",
      name: "Anil Kumar",
      rating: 4.8,
      bio: "Experienced driver with 5 years of service. Known for punctuality and safe driving.",
    },
  },
  {
    id: "v2",
    name: "Kids Auto",
    seats: 3,
    price: "€3.80/ride",
    driver: {
      id: "d2",
      name: "Rajesh Singh",
      rating: 4.6,
      bio: "Friendly auto driver with excellent knowledge of city routes. 3 years of experience with Uber.",
    },
  },
];
