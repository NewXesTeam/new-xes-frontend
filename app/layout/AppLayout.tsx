import * as React from 'react';
import AppNavbar from '@/layout/AppNavbar';
import AppFooter from '@/layout/AppFooter';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-full">
            <AppNavbar />
            <div className="mt-5 mb-5 flex-1">{children}</div>
            <AppFooter />
        </div>
    );
}
