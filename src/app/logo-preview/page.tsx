'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CebuFurnitureMakerLogo } from '@/components/logo/cebu-furniture-maker-logo';

function LogoPreviewInner() {
  const searchParams = useSearchParams();
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const leadInParam = searchParams.get('leadInMs');
    const LEAD_IN_MS = leadInParam ? Math.max(0, parseInt(leadInParam, 10) || 0) : 170;
    const t = setTimeout(() => setShowLogo(true), LEAD_IN_MS);
    return () => clearTimeout(t);
  }, [searchParams]);

  return (
    <div
      style={{
        width: '1280px',
        height: '720px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        color: '#111111',
      }}
    >
      {showLogo ? <CebuFurnitureMakerLogo width={800} height={480} /> : null}
    </div>
  );
}

export default function LogoPreviewPage() {
  return (
    <Suspense fallback={<div style={{ width: '1280px', height: '720px', background: '#ffffff' }} />} >
      <LogoPreviewInner />
    </Suspense>
  );
}


