import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Guests from './pages/Guests';
import Wishlist from './pages/Wishlist';
import Admin from './pages/Admin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/guests" element={<Guests />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
