import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNavigate, useLocation } from 'react-router-dom'

interface NavigationTabsProps {
    defaultValue?: string;
    className?: string;
}

export const NavigationTabs = ({ className = "w-full bg-white rounded-lg shadow-inner" }: NavigationTabsProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    const currentTab = location.pathname;

    return (
        <Tabs 
            defaultValue={currentTab === '/calculator' ? 'calculadora' : 'monitores'} 
            className={className}
            onValueChange={(value) => {
                if (value === 'calculadora') {
                    navigate('/calculator');
                } else if (value === 'monitores') {
                    navigate('/');
                }
            }}
        >
            <TabsList className="flex w-[#fdfefe] bg-white text-black hover:text-black shadow-inner bg-[#1E2329]">
                <TabsTrigger 
                    value="monitores" 
                    className="flex-1 bg-[#1E2329] text-white data-[state=active]:text-black font-semibold data-[state=active]:bg-[#f0b90b]
                     text-center data-[state=active]:shadow-lg"
                >
                    Monitores
                </TabsTrigger>
                <TabsTrigger 
                    value="calculadora" 
                    className="flex-1 bg-[#1E2329] text-white data-[state=active]:text-black font-semibold data-[state=active]:bg-[#f0b90b]
                    text-center data-[state=active]:shadow-lg"
                >
                    Calculadora
                </TabsTrigger>
            </TabsList>
        </Tabs>
    )
}