import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layouts/MainLayout.tsx';
import Monitores from './app/price/page';
import Calculator from './app/calculator/page';

function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Monitores />} />
                <Route path="/calculator" element={<Calculator />} />
            </Route>
        </Routes>
    );
}

export default App;
