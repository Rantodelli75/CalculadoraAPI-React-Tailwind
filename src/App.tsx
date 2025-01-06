import { Routes, Route } from 'react-router-dom';
import Calculator from './app/calculator/page';
import Monitores from './app/price/page';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Monitores />} />
            <Route path="/calculator" element={<Calculator />} />
        </Routes>
    );
}

export default App;
