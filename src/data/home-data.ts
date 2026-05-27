export type Slide = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  route: string;
};

export const heroSlides: Slide[] = [
  {
    id: 'parts',
    title: 'Quality Parts at Unbeatable Prices',
    subtitle: 'Genuine OEM and aftermarket parts for all makes and models',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1920&q=80',
    route: '/category/parts',
  },
  {
    id: 'roadside',
    title: '24/7 Emergency Roadside Assistance',
    subtitle: 'Help is just a call away — anywhere, anytime',
    image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1920&q=80',
    route: '/category/emergency-roadside',
  },
  {
    id: 'insurance',
    title: 'Premium Car Insurance — Save up to 30%',
    subtitle: 'Get comprehensive coverage with the best rates in South Africa',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80',
    route: '/insurance',
  },
];

export type Category = {
  id: string;
  label: string;
  color: string;
  icon: string;
  desc: string;
};

export const categories: Category[] = [
  { id: 'vehicles',           label: 'Vehicle Search',    color: '#0866ff', icon: 'car',       desc: 'Browse verified private and dealer vehicle listings.' },
  { id: 'trucks-buses',       label: 'Trucks & Buses',    color: '#40586d', icon: 'truck',     desc: 'Commercial vehicles, bakkies, trucks and buses.' },
  { id: 'parts',              label: 'Parts',             color: '#06b351', icon: 'key',       desc: 'New and used parts for different makes and models.' },
  { id: 'spares',             label: 'Spares',            color: '#ff3d0a', icon: 'package',   desc: 'Spares, components and replacement items.' },
  { id: 'tyres',              label: 'Tyres',             color: '#40586d', icon: 'tyre',      desc: 'Tyres, wheels and fitment services.' },
  { id: 'panelbeaters',       label: 'Panelbeaters',      color: '#df8a00', icon: 'wrench',    desc: 'Bodywork, repairs and accident restoration.' },
  { id: 'tracking',           label: 'Vehicle Tracking',  color: '#069b83', icon: 'tracking',  desc: 'Tracking and fleet visibility solutions.' },
  { id: 'dealerships',        label: 'Dealerships',       color: '#ff0707', icon: 'shop',      desc: 'Registered dealership profiles and stock.' },
  { id: 'insurance',          label: 'Vehicle Insurance', color: '#0899b8', icon: 'shield',    desc: 'Quote requests and policy comparison.' },
  { id: 'rmi-workshops',      label: 'RMI Workshops',     color: '#4a35f5', icon: 'hardhat',   desc: 'RMI-aligned workshops and service providers.' },
  { id: 'mechanics',          label: 'Non RMI Mechanic',  color: '#069b83', icon: 'settings',  desc: 'Independent mechanics and repair providers.' },
  { id: 'towing',             label: 'Towing Services',   color: '#df8a00', icon: 'tow',       desc: 'Towing, recovery and roadside support.' },
  { id: 'emergency-roadside', label: 'Emergency Roadside',color: '#ff003b', icon: 'emergency', desc: '24/7 emergency roadside assistance.' },
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
  'Quality Parts at Competitive Prices',
  '24/7 Emergency Roadside Assistance Available',
  'Certified RMI Workshops in Your Area',
  'Get Instant Vehicle Insurance Quotes',
  'Secure Listings and Verified Sellers',
  'Admin Approved Listings Only',
  "South Africa's Trusted Automotive Marketplace",
];

export const trustCards = [
  {
    icon: 'shield',
    title: 'Verified listings',
    desc: 'Admin approval, seller checks and safer marketplace visibility baked in from day one.',
  },
  {
    icon: 'lock',
    title: 'POPIA-conscious',
    desc: 'Consent-driven flows, restricted document access and privacy-first user journeys.',
  },
  {
    icon: 'layout',
    title: 'Role dashboards',
    desc: 'Different starting points for buyers, sellers, dealers, vendors and workshops.',
  },
  {
    icon: 'phone',
    title: 'Lead flow ready',
    desc: 'Inquiries, insurance quote requests and service bookings prepared for Firebase.',
  },
];

export const ecosystemServices = [
  {
    icon: 'shield',
    title: 'Insurance quotes',
    desc: 'Lead flow for policy comparison and partner routing.',
    route: '/insurance',
  },
  {
    icon: 'emergency',
    title: 'Roadside help',
    desc: 'Towing and emergency assistance entry points.',
    route: '/roadside',
  },
  {
    icon: 'hardhat',
    title: 'Workshops',
    desc: 'RMI and independent service provider directory.',
    route: '/workshops',
  },
  {
    icon: 'car',
    title: 'Auctions',
    desc: 'Future auction flow for vehicles, parts and spares.',
    route: '/auctions',
  },
];

export const howItWorksSteps = [
  {
    step: 1,
    title: 'Create profile',
    desc: 'Register by role: buyer, seller, dealer, vendor, workshop or admin.',
  },
  {
    step: 2,
    title: 'Submit listing',
    desc: 'Add details, photos, location, pricing and compatibility information.',
  },
  {
    step: 3,
    title: 'Admin review',
    desc: 'Listings move through pending, approved, rejected, sold or expired states.',
  },
  {
    step: 4,
    title: 'Connect safely',
    desc: 'Buyers inquire, save, report or compare through tracked platform flows.',
  },
];

export const roles = [
  { id: 'buyer',    title: 'Buyer',          desc: 'Save, inquire, compare and browse.', route: '/register' },
  { id: 'seller',   title: 'Private seller', desc: 'Create listings and track approval.', route: '/register' },
  { id: 'dealer',   title: 'Dealer',         desc: 'Manage stock, business profile and leads.', route: '/register' },
  { id: 'vendor',   title: 'Parts vendor',   desc: 'Manage parts inventory and compatibility.', route: '/register' },
  { id: 'workshop', title: 'Workshop',       desc: 'Service directory, quote and booking leads.', route: '/register' },
];
