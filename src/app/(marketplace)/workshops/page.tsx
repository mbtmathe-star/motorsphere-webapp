import Link from 'next/link';
import Breadcrumb from '@/components/shared/Breadcrumb';
import { workshops } from '@/data/home-data';

export default function WorkshopsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Workshops' }]} />

      <div>
        <h1 className="text-3xl font-black text-gray-900">Find a Workshop</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Browse RMI-accredited and independent workshops across South Africa.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['All', 'RMI Accredited', 'Independent'].map(tab => (
          <span
            key={tab}
            className={`px-4 py-1.5 rounded-full text-sm font-bold cursor-pointer transition-colors ${
              tab === 'All' ? 'text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            style={tab === 'All' ? { background: '#0866ff' } : {}}
          >
            {tab}
          </span>
        ))}
      </div>

      {/* Workshop grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {workshops.map(ws => (
          <div key={ws.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ws.image} alt={ws.name} className="w-full h-44 object-cover" />
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-black text-gray-900">{ws.name}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">📍 {ws.location}</p>
                </div>
                <span
                  className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0"
                  style={{
                    background: ws.type === 'RMI' ? '#f3e8ff' : '#f3f4f6',
                    color:      ws.type === 'RMI' ? '#6d28d9'  : '#6b7280',
                  }}
                >
                  {ws.type === 'RMI' ? '🏅 RMI Accredited' : 'Independent'}
                </span>
              </div>

              <p className="text-xs text-gray-600">{ws.desc}</p>

              {/* Services */}
              <div className="flex flex-wrap gap-1">
                {ws.services.map(s => (
                  <span key={s} className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>

              {/* Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-sm">★</span>
                  <span className="text-sm font-black text-gray-900">{ws.rating}</span>
                  <span className="text-xs text-gray-400">({ws.reviewCount} reviews)</span>
                </div>
                <Link
                  href={`/listing/svc-1`}
                  className="text-xs font-black text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                  style={{ background: '#0866ff' }}
                >
                  Book / Enquire
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Register CTA */}
      <div className="bg-gray-900 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white">Are you a workshop owner?</h2>
          <p className="text-sm text-white/60 mt-1">
            List your workshop on MotorSphere and get more bookings.
          </p>
        </div>
        <Link
          href="/register"
          className="shrink-0 px-6 py-3 rounded-xl text-sm font-black text-white hover:opacity-90 transition-opacity"
          style={{ background: '#0866ff' }}
        >
          Register as Workshop
        </Link>
      </div>
    </div>
  );
}
