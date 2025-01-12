import { NavigationTabs } from '@/components/global/tabs';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
    return (
        <div className="flex flex-col h-screen w-full mx-auto p-4 space-y-4 bg-[#f5f5f5]">
            <NavigationTabs />
            <Outlet />
        </div>
    );
};
