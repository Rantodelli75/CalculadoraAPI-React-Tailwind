import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNavigate, useLocation } from 'react-router-dom'

interface NavigationTabsProps {
    defaultValue?: string;
    className?: string;
}

export const NavigationTabs = ({ className = "w-full" }: NavigationTabsProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Tabs 
            defaultValue={location.pathname === '/calculator' ? 'calculadora' : 'monitores'} 
            className={className}
            onValueChange={(value) => {
                if (value === 'calculadora') {
                    navigate('/calculator');
                } else if (value === 'monitores') {
                    navigate('/');
                }
            }}
        >
            <TabsList className="flex w-[#fdfefe] bg-white text-black hover:text-black shadow-inner">
                <TabsTrigger 
                    value="monitores" 
                    className="flex-1 bg-white data-[state=active]:text-white font-semibold data-[state=active]:bg-black
                     text-center data-[state=active]:shadow-lg"
                >
                    Monitores
                </TabsTrigger>
                <TabsTrigger 
                    value="calculadora" 
                    className="flex-1 bg-white data-[state=active]:text-white font-semibold data-[state=active]:bg-black 
                    text-center data-[state=active]:shadow-lg"
                >
                    Calculadora
                </TabsTrigger>
            </TabsList>
        </Tabs>
    )
}