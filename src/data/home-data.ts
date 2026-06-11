export type Slide = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  route: string;
};

export const heroSlides: Slide[] = [
  {
    id: 'ecosystem',
    title: "South Africa's Complete Automotive Ecosystem",
    subtitle: 'Vehicles, parts, services, insurance, workshops and more — in one trusted platform',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80',
    route: '/category/vehicles',
  },
  {
    id: 'parts',
    title: 'Find Verified Parts, Services & Providers',
    subtitle: 'New and used parts, RMI workshops, mechanics and panelbeaters across South Africa',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1920&q=80',
    route: '/category/parts',
  },
  {
    id: 'insurance',
    title: 'Insurance, Finance & Protection — All in One Place',
    subtitle: 'Compare vehicle insurance options and connect with financial service providers',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80',
    route: '/insurance',
  },
];

export type Category = {
  id: string;
  label: string;
  color: string;
  icon: string;
  emoji: string;
  image: string;
  desc: string;
};

// Unsplash photos — each one chosen to visually represent the category
const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=75`;

export const categories: Category[] = [
  {
    id: 'vehicles', label: 'Vehicles', color: '#0866ff', icon: 'car', emoji: '🚗',
    image: U('1492144534655-ae79c964c9d7'),   // silver sports car on road
    desc: 'Browse verified private and dealer vehicle listings.',
  },
  {
    id: 'trucks-buses', label: 'Trucks & Buses', color: '#40586d', icon: 'truck', emoji: '🚛',
    image: U('1601584115197-04f9838f4bef'),   // truck on highway
    desc: 'Commercial vehicles, bakkies, trucks and buses.',
  },
  {
    id: 'parts', label: 'Parts', color: '#06b351', icon: 'key', emoji: '🔧',
    image: U('1486262715619-67b85e0b08d3'),   // car engine close-up
    desc: 'New and used parts for different makes and models.',
  },
  {
    id: 'spares', label: 'Spares', color: '#ff3d0a', icon: 'package', emoji: '⚙️',
    image: U('1530046339160-ce3e530c7d2f'),   // mechanical components
    desc: 'Spares, components and replacement items.',
  },
  {
    id: 'tyres', label: 'Tyres', color: '#40586d', icon: 'tyre', emoji: '🛞',
    image: U('1558618666-fcd25c85cd64'),      // tyre close-up
    desc: 'Tyres, wheels and fitment services.',
  },
  {
    id: 'panelbeaters', label: 'Panelbeaters', color: '#df8a00', icon: 'wrench', emoji: '🔨',
    image: U('1609521263047-f8f205293f24'),   // car body repair / bodywork
    desc: 'Bodywork, repairs and accident restoration.',
  },
  {
    id: 'tracking', label: 'Vehicle Tracking', color: '#069b83', icon: 'tracking', emoji: '📡',
    image: U('1502920917128-1aa500764cbd'),   // car dashboard / navigation
    desc: 'Tracking and fleet visibility solutions.',
  },
  {
    id: 'dealerships', label: 'Dealerships', color: '#ff0707', icon: 'shop', emoji: '🏢',
    image: U('1560958089-b8a1929cea89'),      // car showroom interior
    desc: 'Registered dealership profiles and stock.',
  },
  {
    id: 'insurance', label: 'Insurance & Finance', color: '#0899b8', icon: 'shield', emoji: '🛡️',
    image: U('1560518883-ce09059eeffa'),      // car keys on document
    desc: 'Insurance, vehicle finance and protection options.',
  },
  {
    id: 'rmi-workshops', label: 'RMI Workshops', color: '#4a35f5', icon: 'hardhat', emoji: '🏅',
    image: U('1565043589221-1a6fd9ae45c7'),   // professional garage / workshop
    desc: 'RMI-aligned workshops and service providers.',
  },
  {
    id: 'mechanics', label: 'Non RMI Mechanic', color: '#069b83', icon: 'settings', emoji: '🪛',
    image: U('1537462715879-360eeb61a0ad'),   // mechanic working on engine
    desc: 'Independent mechanics and repair providers.',
  },
  {
    id: 'towing', label: 'Towing Services', color: '#df8a00', icon: 'tow', emoji: '🪝',
    image: U('1449965408869-eaa3f722e40d'),   // road at night / tow truck
    desc: 'Towing, recovery and roadside support.',
  },
  {
    id: 'emergency-roadside', label: 'Emergency Roadside', color: '#ff003b', icon: 'emergency', emoji: '🚨',
    image: U('1587815073078-f636169821e3'),   // roadside emergency / warning lights
    desc: '24/7 emergency roadside assistance.',
  },
  {
    id: 'accessories', label: 'Accessories', color: '#c2410c', icon: 'package', emoji: '🎨',
    image: U('1503376780353-7e6692767b70'),   // vehicle detail / SUV
    desc: 'Vehicle accessories, modifications and fitment.',
  },
];

export type StatusVariant = 'green' | 'blue' | 'orange' | 'red' | 'purple';

export type Listing = {
  id: string;
  type: string;
  title: string;
  priceDisplay: string;
  location: string;
  seller: string;
  status: string;
  statusVariant: StatusVariant;
  image: string;
  meta: string[];
  desc: string;
};

export const featuredListings: Listing[] = [
  {
    id: 'veh-1',
    type: 'vehicles',
    title: '2021 Toyota Hilux 2.8 GD-6',
    priceDisplay: 'R 429 900',
    location: 'Kimberley',
    seller: 'Verified Dealer',
    status: 'Admin Approved',
    statusVariant: 'green',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=80',
    meta: ['85 000 km', 'Diesel', 'Automatic'],
    desc: 'Clean, verified bakkie with full service history and finance options available.',
  },
  {
    id: 'veh-2',
    type: 'vehicles',
    title: '2020 Volkswagen Polo 1.0 TSI',
    priceDisplay: 'R 239 900',
    location: 'Cape Town',
    seller: 'Private Seller',
    status: 'Verified Seller',
    statusVariant: 'blue',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
    meta: ['62 000 km', 'Petrol', 'Manual'],
    desc: 'Fuel efficient city car with verified ownership details and roadworthy support.',
  },
  {
    id: 'veh-3',
    type: 'trucks-buses',
    title: '2018 Isuzu NPR 400 Truck',
    priceDisplay: 'R 359 000',
    location: 'Johannesburg',
    seller: 'Commercial Dealer',
    status: 'Dealer Verified',
    statusVariant: 'purple',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1000&q=80',
    meta: ['Commercial', 'Diesel', 'Ready for work'],
    desc: 'Reliable commercial truck for delivery and fleet operations.',
  },
  {
    id: 'part-1',
    type: 'parts',
    title: 'Toyota Hilux Front Bumper',
    priceDisplay: 'R 3 250',
    location: 'Pretoria',
    seller: 'Parts Supplier',
    status: 'Supplier Checked',
    statusVariant: 'green',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=80',
    meta: ['Used', 'Hilux 2016–2022', 'Body'],
    desc: 'Second-hand original bumper in good condition.',
  },
  {
    id: 'part-2',
    type: 'spares',
    title: 'Brake Pads Set — Multiple Models',
    priceDisplay: 'R 899',
    location: 'Durban',
    seller: 'Spares Vendor',
    status: 'New Stock',
    statusVariant: 'blue',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1000&q=80',
    meta: ['New', 'OEM Quality', 'Brakes'],
    desc: 'New brake pad set with compatibility confirmed before dispatch.',
  },
  {
    id: 'svc-1',
    type: 'rmi-workshops',
    title: 'RMI Workshop — Service Centre',
    priceDisplay: 'From R 950',
    location: 'Bloemfontein',
    seller: 'Workshop',
    status: 'RMI Listed',
    statusVariant: 'purple',
    image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1000&q=80',
    meta: ['RMI', 'Diagnostics', 'Service'],
    desc: 'Workshop profile preview with service categories and booking request flow planned.',
  },
];

export const tickerItems = [
  "South Africa's Complete Automotive Ecosystem",
  'Vehicles · Parts · Services · Insurance · Finance',
  'Verified Sellers — Admin Approved Listings Only',
  'Find Trusted Workshops, Mechanics and Panelbeaters',
  'Compare Vehicle Insurance and Finance Options',
  'Towing, Roadside and Emergency Support Nationwide',
  'One Platform — Every Part of Vehicle Ownership',
  'Auction Partner Listings Coming Soon',
];

export const trustCards = [
  {
    icon: 'shield',
    title: 'Verified listings',
    desc: 'Every listing is reviewed by our admin team before going live. Seller identity checks and marketplace screening keep buyers protected.',
  },
  {
    icon: 'lock',
    title: 'POPIA-conscious',
    desc: 'Consent-driven registration, restricted access to sensitive documents and privacy-first data handling aligned with South African law.',
  },
  {
    icon: 'layout',
    title: 'Role-based dashboards',
    desc: 'Dedicated portals for buyers, private sellers, dealerships, parts vendors and workshops — each built for how you actually work.',
  },
  {
    icon: 'phone',
    title: 'Secure inquiries',
    desc: 'All buyer–seller communication stays on-platform until both parties are ready. Your contact details remain protected throughout.',
  },
];

export const ecosystemServices = [
  {
    icon: 'shield',
    title: 'Insurance & Finance',
    desc: 'Compare vehicle insurance options and connect with finance and protection providers.',
    route: '/insurance',
  },
  {
    icon: 'emergency',
    title: 'Roadside & Towing',
    desc: 'Access towing and emergency roadside support anywhere in South Africa, 24 hours a day.',
    route: '/roadside',
  },
  {
    icon: 'hardhat',
    title: 'Workshops & Services',
    desc: 'Find RMI-accredited and independent service providers, mechanics and bodyshops near you.',
    route: '/workshops',
  },
  {
    icon: 'car',
    title: 'Auction Partners',
    desc: 'MotorSphere connects buyers with established auction partners. Auction listings coming soon.',
    route: '/auctions',
  },
];

export const howItWorksSteps = [
  {
    step: 1,
    title: 'Create your profile',
    desc: 'Register as a buyer, seller, dealer, parts vendor or workshop. Your role shapes your dashboard and available features.',
  },
  {
    step: 2,
    title: 'List or browse',
    desc: 'Sellers add vehicle details, photos, pricing and location. Buyers search and filter across verified listings nationwide.',
  },
  {
    step: 3,
    title: 'Admin screening',
    desc: 'Every listing is reviewed by our moderation team before it becomes publicly visible. Quality control is built in.',
  },
  {
    step: 4,
    title: 'Connect with confidence',
    desc: 'Buyers inquire, save and compare. Sellers respond through the platform. All interactions stay traceable and secure.',
  },
];

export const roles = [
  { id: 'buyer',    title: 'Buyer',          desc: 'Search verified vehicle listings, save favourites, send inquiries and compare vehicles, parts and services across the ecosystem.', route: '/register' },
  { id: 'seller',   title: 'Private Seller', desc: 'Create listings, upload vehicle details and track your approval status. Reach buyers across South Africa.', route: '/register' },
  { id: 'dealer',   title: 'Dealer',         desc: 'Manage your full stock, leads and dealership profile. Get verified and grow your reach on MotorSphere.', route: '/register' },
  { id: 'vendor',   title: 'Parts Vendor',   desc: 'List parts and spares, manage inventory, set compatibility details and respond to buyer inquiries nationwide.', route: '/register' },
  { id: 'workshop', title: 'Workshop',       desc: 'Advertise your services, display your RMI status, receive booking requests and build your digital presence.', route: '/register' },
];

// More seeded listings for category pages / search
export const allListings: Listing[] = [
  // Vehicles
  {
    id: 'veh-1', type: 'vehicles', title: '2021 Toyota Hilux 2.8 GD-6',
    priceDisplay: 'R 429 900', location: 'Kimberley', seller: 'Verified Dealer',
    status: 'Admin Approved', statusVariant: 'green',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=80',
    meta: ['85 000 km', 'Diesel', 'Automatic'],
    desc: 'Clean, verified bakkie with full service history and finance options available. RMI dealer inspected.',
  },
  {
    id: 'veh-2', type: 'vehicles', title: '2020 Volkswagen Polo 1.0 TSI',
    priceDisplay: 'R 239 900', location: 'Cape Town', seller: 'Private Seller',
    status: 'Verified Seller', statusVariant: 'blue',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
    meta: ['62 000 km', 'Petrol', 'Manual'],
    desc: 'Fuel efficient city car with verified ownership details and roadworthy support.',
  },
  {
    id: 'veh-3', type: 'trucks-buses', title: '2018 Isuzu NPR 400 Truck',
    priceDisplay: 'R 359 000', location: 'Johannesburg', seller: 'Commercial Dealer',
    status: 'Dealer Verified', statusVariant: 'purple',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1000&q=80',
    meta: ['Commercial', 'Diesel', 'Ready for work'],
    desc: 'Reliable commercial truck for delivery and fleet operations.',
  },
  {
    id: 'veh-4', type: 'vehicles', title: '2019 Ford Ranger 2.2 XLS',
    priceDisplay: 'R 349 500', location: 'Durban', seller: 'Verified Dealer',
    status: 'Admin Approved', statusVariant: 'green',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80',
    meta: ['102 000 km', 'Diesel', 'Manual'],
    desc: 'Well-maintained Ranger with tow pack, canopy and service book.',
  },
  {
    id: 'veh-5', type: 'vehicles', title: '2022 Toyota Fortuner 2.8 GD-6',
    priceDisplay: 'R 699 900', location: 'Pretoria', seller: 'Verified Dealer',
    status: 'Admin Approved', statusVariant: 'green',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
    meta: ['28 000 km', 'Diesel', 'Automatic'],
    desc: 'Near-new Fortuner with balance of plan. 7-seater, leather, sunroof.',
  },
  {
    id: 'veh-6', type: 'vehicles', title: '2017 BMW 3 Series 320i',
    priceDisplay: 'R 289 900', location: 'Cape Town', seller: 'Private Seller',
    status: 'Verified Seller', statusVariant: 'blue',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80',
    meta: ['89 000 km', 'Petrol', 'Automatic'],
    desc: 'Sporty 3-series sedan with full BMW service history and recent service.',
  },
  // Parts
  {
    id: 'part-1', type: 'parts', title: 'Toyota Hilux Front Bumper',
    priceDisplay: 'R 3 250', location: 'Pretoria', seller: 'Parts Supplier',
    status: 'Supplier Checked', statusVariant: 'green',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=80',
    meta: ['Used', 'Hilux 2016–2022', 'Body'],
    desc: 'Second-hand original bumper in good condition.',
  },
  {
    id: 'part-2', type: 'spares', title: 'Brake Pads Set — Multiple Models',
    priceDisplay: 'R 899', location: 'Durban', seller: 'Spares Vendor',
    status: 'New Stock', statusVariant: 'blue',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1000&q=80',
    meta: ['New', 'OEM Quality', 'Brakes'],
    desc: 'New brake pad set with compatibility confirmed before dispatch.',
  },
  {
    id: 'part-3', type: 'parts', title: 'VW Polo Engine Cover',
    priceDisplay: 'R 1 200', location: 'Johannesburg', seller: 'Auto Parts Depot',
    status: 'Supplier Checked', statusVariant: 'green',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=80',
    meta: ['Used', 'Polo 2016–2021', 'Engine'],
    desc: 'Original VW engine cover, minor surface marks only.',
  },
  {
    id: 'tyre-1', type: 'tyres', title: 'Michelin Pilot Sport 4 — Set of 4',
    priceDisplay: 'R 12 800', location: 'Cape Town', seller: 'Tyre Fitment Centre',
    status: 'New Stock', statusVariant: 'blue',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80',
    meta: ['New', '225/45 R17', 'Performance'],
    desc: 'Set of 4 Michelin Pilot Sport 4s with fitment and balancing included.',
  },
  // Services
  {
    id: 'svc-1', type: 'rmi-workshops', title: 'RMI Workshop — Full Service Centre',
    priceDisplay: 'From R 950', location: 'Bloemfontein', seller: 'AccuFix Auto',
    status: 'RMI Listed', statusVariant: 'purple',
    image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1000&q=80',
    meta: ['RMI', 'Diagnostics', 'Service'],
    desc: 'Fully equipped RMI workshop with diagnostics, services and accident repairs.',
  },
  {
    id: 'svc-2', type: 'insurance', title: 'Comprehensive Vehicle Insurance',
    priceDisplay: 'Quote Request', location: 'South Africa', seller: 'InsureMatch SA',
    status: 'Lead Flow', statusVariant: 'blue',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80',
    meta: ['Compare', 'Lead Form', 'Partner'],
    desc: 'Insurance quote lead flow for partner integrations.',
  },
  {
    id: 'svc-3', type: 'towing', title: '24/7 Towing & Recovery',
    priceDisplay: 'From R 650', location: 'Nationwide', seller: 'FastTow SA',
    status: 'Available', statusVariant: 'red',
    image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1000&q=80',
    meta: ['Roadside', 'Emergency', 'Nationwide'],
    desc: 'Professional towing and roadside support across all provinces.',
  },
  {
    id: 'svc-4', type: 'mechanics', title: 'Mobile Mechanic — All Makes',
    priceDisplay: 'From R 450', location: 'Johannesburg', seller: 'QuickFix Mobile',
    status: 'Available', statusVariant: 'green',
    image: 'https://images.unsplash.com/photo-1537519646099-335112f03225?auto=format&fit=crop&w=1000&q=80',
    meta: ['Mobile', 'All Makes', 'Diagnostics'],
    desc: 'We come to you. Diagnostics, repairs and service on-site.',
  },
  {
    id: 'svc-5', type: 'panelbeaters', title: 'Premier Panel & Paint',
    priceDisplay: 'From R 2 500', location: 'Cape Town', seller: 'PremierBodyworks',
    status: 'Admin Approved', statusVariant: 'green',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1000&q=80',
    meta: ['Panel', 'Paint', 'Insurance'],
    desc: 'Full bodywork, paint and accident restoration. Insurance-approved.',
  },
  {
    id: 'deal-1', type: 'dealerships', title: 'AutoNation KZN — Certified Dealer',
    priceDisplay: 'See Stock', location: 'Durban', seller: 'AutoNation KZN',
    status: 'Dealer Verified', statusVariant: 'purple',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=80',
    meta: ['Certified', 'Finance', 'Trade-ins'],
    desc: 'Registered dealership with 80+ vehicles in stock. Finance and trade-in options.',
  },
  {
    id: 'track-1', type: 'tracking', title: 'VehicleTrack Pro — Fleet & Personal',
    priceDisplay: 'From R 299/mo', location: 'Nationwide', seller: 'VehicleTrack SA',
    status: 'Admin Approved', statusVariant: 'green',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80',
    meta: ['GPS', 'Fleet', 'Recovery'],
    desc: 'Real-time GPS tracking, stolen vehicle recovery and fleet management.',
  },
];

// Workshop seeded data for /workshops directory
export type Workshop = {
  id: string;
  name: string;
  type: 'RMI' | 'Independent';
  location: string;
  services: string[];
  rating: number;
  reviewCount: number;
  image: string;
  desc: string;
};

export const workshops: Workshop[] = [
  {
    id: 'ws-1', name: 'AccuFix Auto', type: 'RMI', location: 'Bloemfontein',
    services: ['Full Service', 'Diagnostics', 'Brakes', 'Suspension'],
    rating: 4.8, reviewCount: 124,
    image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=800&q=80',
    desc: 'RMI-accredited workshop with 12+ years experience and dealer-level diagnostics.',
  },
  {
    id: 'ws-2', name: 'QuickFix Mobile', type: 'Independent', location: 'Johannesburg',
    services: ['Mobile Service', 'Diagnostics', 'Oil Change', 'Tyres'],
    rating: 4.6, reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1537519646099-335112f03225?auto=format&fit=crop&w=800&q=80',
    desc: 'We come to you. Mobile mechanic covering Joburg, Pretoria and Midrand.',
  },
  {
    id: 'ws-3', name: 'Premier Bodyworks', type: 'RMI', location: 'Cape Town',
    services: ['Panel Beating', 'Paint', 'Accident Repairs', 'Insurance'],
    rating: 4.9, reviewCount: 67,
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80',
    desc: 'Insurance-approved bodyshop with OEM paint matching and full restoration.',
  },
  {
    id: 'ws-4', name: 'SpeedZone Service Centre', type: 'Independent', location: 'Durban',
    services: ['Performance', 'Tune-ups', 'Exhaust', 'Suspension'],
    rating: 4.5, reviewCount: 203,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    desc: 'Specialists in performance vehicles, turbos, exhausts and track prep.',
  },
];
