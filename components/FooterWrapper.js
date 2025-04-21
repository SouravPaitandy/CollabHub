'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function FooterWrapper() {
  const pathname = usePathname();
  const isChatPage = pathname.startsWith('/chat');

  if (isChatPage) {
    return null;
  }

  return <Footer />;
}