import type { ReactNode } from 'react';
import SiteFooter from '@/src/components/site-footer';
import SiteNav from '@/src/components/site-nav';

type SiteLayoutProps = {
  children: ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <>
      <SiteNav />
      {children}
      <SiteFooter />
    </>
  );
}