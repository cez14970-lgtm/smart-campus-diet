import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Recommendation from './pages/Recommendation';
import Canteen from './pages/Canteen';
import Order from './pages/Order';
import Community from './pages/Community';
import Tech from './pages/Tech';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/recommendation" element={<Recommendation />} />
          <Route path="/canteen" element={<Canteen />} />
          <Route path="/order" element={<Order />} />
          <Route path="/community" element={<Community />} />
          <Route path="/tech" element={<Tech />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
