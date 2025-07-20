'use client';

import Script from 'next/script';

export default function Analytics() {
  return (
    <>
      {/* Global site tag - SimpleAnalytics */}
      <Script
        strategy="afterInteractive"
        async src="https://scripts.simpleanalyticscdn.com/latest.js"
      />
    </>
  );
}
