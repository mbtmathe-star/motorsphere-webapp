/**
 * src/app/page.tsx
 *
 * MotorSphere Landing Page — placeholder for Base 3 scaffold.
 * The full homepage (HeroSection, CategoryGrid, MarqueeTicker) is built in Base 4.
 *
 * Design reference: docs/BASE-2B-FIGMA-SCREEN-MAPPING.md
 */

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen page-container">
      <div className="flex flex-col items-center gap-8 text-center max-w-2xl mx-auto py-24">

        {/* Brand mark */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl"
            style={{ backgroundColor: 'var(--color-brand-primary)' }}
          >
            M
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">
            MotorSphere
          </span>
        </div>

        {/* Headline */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            South Africa&rsquo;s Automotive Marketplace
          </h1>
          <p className="text-lg" style={{ color: 'var(--color-foreground-muted)' }}>
            Buy and sell vehicles, parts, and accessories across South Africa.
            Coming soon.
          </p>
        </div>

        {/* Status badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
          style={{
            backgroundColor: 'var(--color-surface-muted)',
            color:            'var(--color-foreground-muted)',
            border:           '1px solid var(--color-border)',
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--color-warning-fg)' }}
          />
          Base 3 Scaffold — Environment setup in progress
        </div>

        {/* Quick links for development */}
        <nav className="flex flex-wrap gap-3 justify-center" aria-label="Development navigation">
          <Link
            href="/vehicles"
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
            style={{
              backgroundColor: 'var(--color-brand-primary)',
              color:            'var(--color-brand-primary-fg)',
            }}
          >
            Browse Vehicles
          </Link>
          <Link
            href="/parts"
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
            style={{
              backgroundColor: 'var(--color-surface-muted)',
              color:            'var(--color-foreground)',
              border:           '1px solid var(--color-border)',
            }}
          >
            Browse Parts
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
            style={{
              backgroundColor: 'var(--color-surface-muted)',
              color:            'var(--color-foreground)',
              border:           '1px solid var(--color-border)',
            }}
          >
            Sign In
          </Link>
        </nav>

        {/* Design token smoke test — dev only */}
        {process.env.NEXT_PUBLIC_APP_ENV === 'development' && (
          <details className="text-left w-full max-w-md">
            <summary
              className="text-xs cursor-pointer"
              style={{ color: 'var(--color-foreground-subtle)' }}
            >
              Design token smoke test (dev only)
            </summary>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {[
                ['background',    'var(--color-background)'],
                ['surface',       'var(--color-surface)'],
                ['surface-muted', 'var(--color-surface-muted)'],
                ['brand-primary', 'var(--color-brand-primary)'],
                ['ticker-bg',     'var(--color-ticker-bg)'],
                ['ticker-star',   'var(--color-ticker-star)'],
                ['success',       'var(--color-success)'],
                ['destructive',   'var(--color-destructive)'],
              ].map(([name, value]) => (
                <div key={name} className="flex flex-col items-center gap-1">
                  <div
                    className="w-8 h-8 rounded"
                    style={{
                      backgroundColor: value,
                      border:          '1px solid var(--color-border)',
                    }}
                  />
                  <span
                    className="text-[9px] text-center leading-tight"
                    style={{ color: 'var(--color-foreground-subtle)' }}
                  >
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </details>
        )}

      </div>
    </main>
  );
}
