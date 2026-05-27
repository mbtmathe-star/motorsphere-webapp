// src/components/home/AnnouncementTicker.tsx
import { tickerItems } from '@/data/home-data';

export default function AnnouncementTicker() {
  // Duplicate items so the marquee loops seamlessly
  const doubled = [...tickerItems, ...tickerItems];

  return (
    <div
      className="relative z-10 h-12 flex items-center overflow-hidden font-bold whitespace-nowrap text-white"
      style={{
        background: '#2f238b',
        borderTop: '1px solid rgba(255,255,255,.12)',
        borderBottom: '1px solid rgba(255,255,255,.12)',
      }}
      aria-label="MotorSphere announcements"
    >
      <div className="flex gap-6 marquee-track" style={{ paddingLeft: '100%' }}>
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-4">
            {item}
            <span className="text-[#ffd400] text-lg">★</span>
          </span>
        ))}
      </div>
    </div>
  );
}
