import { NavigationTabs } from '@/components/global/tabs';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
    return (
        <div className="flex flex-col h-screen w-full mx-auto p-4 space-y-4 bg-[#0B0E11]">
            <NavigationTabs />
            <Outlet />
        </div>
    );
};