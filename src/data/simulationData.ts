import { Rider, Restaurant, Customer, Order, OrderPriority } from '../types';
import { calculateHaversineDistance } from '../utils/geo';

export const HYDERABAD_CENTER = {
  lat: 17.4435,
  lng: 78.3872,
  zoom: 12.8
};

export const RIDER_COLORS = [
  { code: '#ef4444', name: 'Red' },     // R1 = Red
  { code: '#3b82f6', name: 'Blue' },    // R2 = Blue
  { code: '#10b981', name: 'Green' },   // R3 = Green
  { code: '#eab308', name: 'Yellow' },  // R4 = Yellow
  { code: '#a855f7', name: 'Purple' },  // R5 = Purple
  { code: '#f97316', name: 'Orange' },  // R6 = Orange
];

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'REST-01',
    name: 'Bawarchi Biryani Hub',
    cuisine: 'Dum Biryani & Kebabs',
    lat: 17.4520,
    lng: 78.3890,
    prepTimeMin: 10,
    rating: 4.8
  },
  {
    id: 'REST-02',
    name: 'Cyber Pizza Craft',
    cuisine: 'Woodfire Gourmet Pizza',
    lat: 17.4504,
    lng: 78.3808,
    prepTimeMin: 8,
    rating: 4.7
  },
  {
    id: 'REST-03',
    name: 'Botanical Bistro',
    cuisine: 'Healthy Salads & Bowls',
    lat: 17.4664,
    lng: 78.3582,
    prepTimeMin: 6,
    rating: 4.6
  },
  {
    id: 'REST-04',
    name: 'Rolls & Bowls',
    cuisine: 'Asian Noodles & Wraps',
    lat: 17.4401,
    lng: 78.3489,
    prepTimeMin: 7,
    rating: 4.5
  },
  {
    id: 'REST-05',
    name: 'Heritage Tiffin Center',
    cuisine: 'Authentic Dosa & Coffee',
    lat: 17.4156,
    lng: 78.4357,
    prepTimeMin: 5,
    rating: 4.9
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  // North Area Customers (Heavy Demand Cluster)
  { id: 'CUST-01', name: 'Rahul Sharma (#101)', address: 'Fortune Towers, Kondapur', lat: 17.4685, lng: 78.3610 },
  { id: 'CUST-02', name: 'Priya Venkat (#102)', address: 'Silicon Enclave, Kondapur', lat: 17.4640, lng: 78.3670 },
  { id: 'CUST-03', name: 'Aditya Rao (#103)', address: 'Whitefield Villas, Kondapur', lat: 17.4610, lng: 78.3540 },
  { id: 'CUST-04', name: 'Meera Iyer (#104)', address: 'Cyber Gateway, Madhapur North', lat: 17.4560, lng: 78.3850 },
  { id: 'CUST-05', name: 'Sanjay Gupta (#105)', address: 'Kavuri Hills Phase 2, Madhapur', lat: 17.4490, lng: 78.3960 },

  // Central Area Customers (Medium Demand Cluster)
  { id: 'CUST-06', name: 'Sneha Kulkarni (#106)', address: 'Mindspace SEZ, Hitec City', lat: 17.4452, lng: 78.3768 },
  { id: 'CUST-07', name: 'Rohit Joshi (#107)', address: 'DLF Cybercity, Gachibowli', lat: 17.4420, lng: 78.3580 },
  { id: 'CUST-08', name: 'Vikram Reddy (#108)', address: 'Rolling Hills, Gachibowli', lat: 17.4360, lng: 78.3520 },

  // South Area Customers (Low Demand Cluster)
  { id: 'CUST-09', name: 'Ananya Nair (#109)', address: 'Road No 36, Jubilee Hills', lat: 17.4310, lng: 78.4090 },
  { id: 'CUST-10', name: 'Arjun Verma (#110)', address: 'Green Heights, Banjara Hills', lat: 17.4190, lng: 78.4320 },
];

export const INITIAL_RIDERS: Rider[] = [
  {
    id: 'R1',
    name: 'Harsh',
    lat: 17.4540,
    lng: 78.3940,
    status: 'AVAILABLE',
    capacity: 2,
    currentOrders: 0,
    color: RIDER_COLORS[0].code, // Red
    colorName: 'Red',
    speedKmh: 28,
    efficiencyScore: 92,
    vehicle: 'Ather EV',
    rating: 4.9,
    assignedOrderIds: []
  },
  {
    id: 'R2',
    name: 'Siddhartha',
    lat: 17.4485,
    lng: 78.3820,
    status: 'AVAILABLE',
    capacity: 2,
    currentOrders: 0,
    color: RIDER_COLORS[1].code, // Blue
    colorName: 'Blue',
    speedKmh: 30,
    efficiencyScore: 96,
    vehicle: 'Ola S1 Pro',
    rating: 5.0,
    assignedOrderIds: []
  },
  {
    id: 'R3',
    name: 'Anirudh',
    lat: 17.4390,
    lng: 78.3510,
    status: 'AVAILABLE',
    capacity: 2,
    currentOrders: 0,
    color: RIDER_COLORS[2].code, // Green
    colorName: 'Green',
    speedKmh: 26,
    efficiencyScore: 88,
    vehicle: 'TVS iQube',
    rating: 4.8,
    assignedOrderIds: []
  },
  {
    id: 'R4',
    name: 'Ganesh',
    lat: 17.4645,
    lng: 78.3620,
    status: 'AVAILABLE',
    capacity: 2,
    currentOrders: 0,
    color: RIDER_COLORS[3].code, // Yellow
    colorName: 'Yellow',
    speedKmh: 29,
    efficiencyScore: 94,
    vehicle: 'Hero Vida',
    rating: 4.9,
    assignedOrderIds: []
  },
  {
    id: 'R5',
    name: 'Bharath',
    lat: 17.4180,
    lng: 78.4330,
    status: 'AVAILABLE',
    capacity: 2,
    currentOrders: 0,
    color: RIDER_COLORS[4].code, // Purple
    colorName: 'Purple',
    speedKmh: 27,
    efficiencyScore: 89,
    vehicle: 'Chetak EV',
    rating: 4.7,
    assignedOrderIds: []
  },
  {
    id: 'R6',
    name: 'Kiran',
    lat: 17.4320,
    lng: 78.4060,
    status: 'AVAILABLE',
    capacity: 2,
    currentOrders: 0,
    color: RIDER_COLORS[5].code, // Orange
    colorName: 'Orange',
    speedKmh: 28,
    efficiencyScore: 91,
    vehicle: 'Revolt RV400',
    rating: 4.9,
    assignedOrderIds: []
  }
];

export const INITIAL_ORDERS: Order[] = [
  // 1. North Demand Orders
  {
    id: 'O101',
    restaurantId: 'REST-03',
    restaurantName: 'Botanical Bistro',
    restaurantLocation: { lat: 17.4664, lng: 78.3582 },
    customerId: 'CUST-01',
    customerName: 'Customer #101 (Rahul)',
    customerLocation: { lat: 17.4685, lng: 78.3610 },
    items: ['Quinoa Salad Bowl', 'Iced Matcha'],
    priority: 'HIGH',
    status: 'PENDING',
    distanceKm: calculateHaversineDistance(17.4664, 78.3582, 17.4685, 78.3610),
    createdAt: '12:30'
  },
  {
    id: 'O102',
    restaurantId: 'REST-03',
    restaurantName: 'Botanical Bistro',
    restaurantLocation: { lat: 17.4664, lng: 78.3582 },
    customerId: 'CUST-02',
    customerName: 'Customer #102 (Priya)',
    customerLocation: { lat: 17.4640, lng: 78.3670 },
    items: ['Avocado Smash Bowl'],
    priority: 'MEDIUM',
    status: 'PENDING',
    distanceKm: calculateHaversineDistance(17.4664, 78.3582, 17.4640, 78.3670),
    createdAt: '12:31'
  },
  {
    id: 'O103',
    restaurantId: 'REST-03',
    restaurantName: 'Botanical Bistro',
    restaurantLocation: { lat: 17.4664, lng: 78.3582 },
    customerId: 'CUST-03',
    customerName: 'Customer #103 (Aditya)',
    customerLocation: { lat: 17.4610, lng: 78.3540 },
    items: ['Berry Protein Smoothie'],
    priority: 'LOW',
    status: 'PENDING',
    distanceKm: calculateHaversineDistance(17.4664, 78.3582, 17.4610, 78.3540),
    createdAt: '12:32'
  },
  {
    id: 'O104',
    restaurantId: 'REST-02',
    restaurantName: 'Cyber Pizza Craft',
    restaurantLocation: { lat: 17.4504, lng: 78.3808 },
    customerId: 'CUST-04',
    customerName: 'Customer #104 (Meera)',
    customerLocation: { lat: 17.4560, lng: 78.3850 },
    items: ['Truffle Mushroom Pizza', 'Garlic Bread'],
    priority: 'HIGH',
    status: 'PENDING',
    distanceKm: calculateHaversineDistance(17.4504, 78.3808, 17.4560, 78.3850),
    createdAt: '12:33'
  },
  {
    id: 'O105',
    restaurantId: 'REST-01',
    restaurantName: 'Bawarchi Biryani Hub',
    restaurantLocation: { lat: 17.4520, lng: 78.3890 },
    customerId: 'CUST-05',
    customerName: 'Customer #105 (Sanjay)',
    customerLocation: { lat: 17.4490, lng: 78.3960 },
    items: ['Special Mutton Biryani', 'Mirchi Salan'],
    priority: 'CRITICAL',
    status: 'PENDING',
    distanceKm: calculateHaversineDistance(17.4520, 78.3890, 17.4490, 78.3960),
    createdAt: '12:34'
  },

  // 2. Central Demand Orders
  {
    id: 'O106',
    restaurantId: 'REST-02',
    restaurantName: 'Cyber Pizza Craft',
    restaurantLocation: { lat: 17.4504, lng: 78.3808 },
    customerId: 'CUST-06',
    customerName: 'Customer #106 (Sneha)',
    customerLocation: { lat: 17.4452, lng: 78.3768 },
    items: ['Farmhouse Pizza', 'Peri Peri Fries'],
    priority: 'HIGH',
    status: 'PENDING',
    distanceKm: calculateHaversineDistance(17.4504, 78.3808, 17.4452, 78.3768),
    createdAt: '12:35'
  },
  {
    id: 'O107',
    restaurantId: 'REST-04',
    restaurantName: 'Rolls & Bowls',
    restaurantLocation: { lat: 17.4401, lng: 78.3489 },
    customerId: 'CUST-07',
    customerName: 'Customer #107 (Rohit)',
    customerLocation: { lat: 17.4420, lng: 78.3580 },
    items: ['Paneer Tikka Roll', 'Lemon Iced Tea'],
    priority: 'MEDIUM',
    status: 'PENDING',
    distanceKm: calculateHaversineDistance(17.4401, 78.3489, 17.4420, 78.3580),
    createdAt: '12:36'
  },
  {
    id: 'O108',
    restaurantId: 'REST-04',
    restaurantName: 'Rolls & Bowls',
    restaurantLocation: { lat: 17.4401, lng: 78.3489 },
    customerId: 'CUST-08',
    customerName: 'Customer #108 (Vikram)',
    customerLocation: { lat: 17.4360, lng: 78.3520 },
    items: ['Double Egg Chicken Roll'],
    priority: 'LOW',
    status: 'PENDING',
    distanceKm: calculateHaversineDistance(17.4401, 78.3489, 17.4360, 78.3520),
    createdAt: '12:37'
  },

  // 3. South Demand Orders
  {
    id: 'O109',
    restaurantId: 'REST-05',
    restaurantName: 'Heritage Tiffin Center',
    restaurantLocation: { lat: 17.4156, lng: 78.4357 },
    customerId: 'CUST-09',
    customerName: 'Customer #109 (Ananya)',
    customerLocation: { lat: 17.4310, lng: 78.4090 },
    items: ['Ghee Roast Dosa', 'Filter Coffee'],
    priority: 'MEDIUM',
    status: 'PENDING',
    distanceKm: calculateHaversineDistance(17.4156, 78.4357, 17.4310, 78.4090),
    createdAt: '12:38'
  },
  {
    id: 'O110',
    restaurantId: 'REST-05',
    restaurantName: 'Heritage Tiffin Center',
    restaurantLocation: { lat: 17.4156, lng: 78.4357 },
    customerId: 'CUST-10',
    customerName: 'Customer #110 (Arjun)',
    customerLocation: { lat: 17.4190, lng: 78.4320 },
    items: ['3x Ghee Podi Idli'],
    priority: 'HIGH',
    status: 'PENDING',
    distanceKm: calculateHaversineDistance(17.4156, 78.4357, 17.4190, 78.4320),
    createdAt: '12:39'
  }
];

export function generateRiders(count: number): Rider[] {
  return INITIAL_RIDERS.slice(0, Math.min(count, INITIAL_RIDERS.length));
}

export function generateOrders(count: number): Order[] {
  return INITIAL_ORDERS.slice(0, Math.min(count, INITIAL_ORDERS.length));
}
