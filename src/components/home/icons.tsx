// src/components/home/icons.tsx
// SVG icon components mirroring the prototype's icon set exactly.

type IconProps = {
  className?: string;
};

const iconStyle = "w-full h-full stroke-current fill-none stroke-[2.3] [stroke-linecap:round] [stroke-linejoin:round]";

export function CarIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${iconStyle} ${className}`}>
      <path d="M3 13l2-5.5A3 3 0 0 1 7.8 5.5h8.4A3 3 0 0 1 19 7.5L21 13" />
      <path d="M5 13h14a2 2 0 0 1 2 2v3h-3" />
      <path d="M6 18H3v-3a2 2 0 0 1 2-2" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
      <path d="M8 9h8" />
    </svg>
  );
}

export function TruckIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${iconStyle} ${className}`}>
      <path d="M3 6h11v12H3z" />
      <path d="M14 10h4l3 3v5h-7z" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
      <path d="M6 9h5" />
      <path d="M17 13h4" />
    </svg>
  );
}

export function KeyIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${iconStyle} ${className}`}>
      <circle cx="8" cy="8" r="3" />
      <path d="M10.2 10.2L20 20" />
      <path d="M15 5l4 4" />
      <path d="M16.8 3.2l4 4" />
      <path d="M4 20l5.5-5.5" />
      <path d="M3 17l4 4" />
    </svg>
  );
}

export function PackageIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${iconStyle} ${className}`}>
      <path d="M21 16V8l-9-5-9 5v8l9 5z" />
      <path d="M3.4 8.5L12 13l8.6-4.5" />
      <path d="M12 13v8" />
      <path d="M7.5 6.2l9 5" />
    </svg>
  );
}

export function TyreIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${iconStyle} ${className}`}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 4v3" />
      <path d="M12 17v3" />
      <path d="M4 12h3" />
      <path d="M17 12h3" />
      <path d="M6.3 6.3l2.1 2.1" />
      <path d="M15.6 15.6l2.1 2.1" />
    </svg>
  );
}

export function WrenchIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${iconStyle} ${className}`}>
      <path d="M14 5l5 5" />
      <path d="M13 6l-8.5 8.5a2.1 2.1 0 0 0 0 3l2 2a2.1 2.1 0 0 0 3 0L18 11" />
      <path d="M16 3l5 5" />
      <path d="M4 20l4-4" />
      <path d="M9 10l5 5" />
    </svg>
  );
}

export function TrackingIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${iconStyle} ${className}`}>
      <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11z" />
      <circle cx="12" cy="10" r="2" />
      <path d="M3 8a9 9 0 0 1 3-5" />
      <path d="M21 8a9 9 0 0 0-3-5" />
    </svg>
  );
}

export function ShopIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${iconStyle} ${className}`}>
      <path d="M4 10h16" />
      <path d="M5 10l1.3-5h11.4L19 10" />
      <path d="M6 10v9h12v-9" />
      <path d="M9 19v-5h6v5" />
      <path d="M3 19h18" />
      <path d="M8 5V3h8v2" />
    </svg>
  );
}

export function ShieldIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${iconStyle} ${className}`}>
      <path d="M12 3l8 3v5c0 5.2-3.3 8.6-8 10-4.7-1.4-8-4.8-8-10V6z" />
      <path d="M9 12l2 2 4-5" />
    </svg>
  );
}

export function HardhatIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${iconStyle} ${className}`}>
      <path d="M4 20h16" />
      <path d="M6 20v-8a6 6 0 0 1 12 0v8" />
      <path d="M8 12h8" />
      <path d="M12 6v6" />
      <path d="M3 15h18" />
    </svg>
  );
}

export function SettingsIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${iconStyle} ${className}`}>
      <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5z" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 0 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 0 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 0 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1a2 2 0 0 1 0 4H21a1.7 1.7 0 0 0-1.6 1z" />
    </svg>
  );
}

export function TowIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${iconStyle} ${className}`}>
      <path d="M5 7h8l3 4h3a2 2 0 0 1 2 2v4h-3" />
      <path d="M5 17H3v-6h10" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

export function EmergencyIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${iconStyle} ${className}`}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v5l3 2" />
      <path d="M4 4l3 3" />
      <path d="M20 4l-3 3" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  );
}

export function MenuIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${iconStyle} ${className}`}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

export function GlobeIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${iconStyle} ${className}`}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18" />
      <path d="M12 3a15 15 0 0 0 0 18" />
    </svg>
  );
}

export function SearchIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${iconStyle} ${className}`}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export function MapPinIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${iconStyle} ${className}`}>
      <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11z" />
      <circle cx="12" cy="10" r="2" />
    </svg>
  );
}

export function LockIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${iconStyle} ${className}`}>
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function LayoutIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${iconStyle} ${className}`}>
      <path d="M3 3h18v18H3z" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}

export function PhoneIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${iconStyle} ${className}`}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.4 2.1L8 9.6a16 16 0 0 0 6.4 6.4l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.6.5 2.5.6A2 2 0 0 1 22 16.9z" />
    </svg>
  );
}

export function PlusIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${iconStyle} ${className}`}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function ImageIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${iconStyle} ${className}`}>
      <path d="M4 5h16v14H4z" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="M21 16l-5-5L5 22" />
    </svg>
  );
}

export function XIcon({ className = '' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${iconStyle} ${className}`}>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

// Icon resolver — maps icon name string to component
const iconMap: Record<string, React.FC<IconProps>> = {
  car:       CarIcon,
  truck:     TruckIcon,
  key:       KeyIcon,
  package:   PackageIcon,
  tyre:      TyreIcon,
  wrench:    WrenchIcon,
  tracking:  TrackingIcon,
  shop:      ShopIcon,
  shield:    ShieldIcon,
  hardhat:   HardhatIcon,
  settings:  SettingsIcon,
  tow:       TowIcon,
  emergency: EmergencyIcon,
  menu:      MenuIcon,
  globe:     GlobeIcon,
  search:    SearchIcon,
  'map-pin': MapPinIcon,
  lock:      LockIcon,
  layout:    LayoutIcon,
  phone:     PhoneIcon,
  plus:      PlusIcon,
  image:     ImageIcon,
  x:         XIcon,
};

export function Icon({ name, className = '' }: { name: string; className?: string }) {
  const Component = iconMap[name];
  if (!Component) return null;
  return <Component className={className} />;
}
