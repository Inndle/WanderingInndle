'use client';

import Script from 'next/script';

export default function Analytics() {
  return (
    <>
      {/* Global site tag - Umami Analytics */}
      <Script
        strategy="afterInteractive"
        defer src="https://cloud.umami.is/script.js" data-website-id="23e3e698-8c3a-47b9-b771-6d08476309dc"
      />
    </>
  );
}
