import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import { ToastProvider } from './context/ToastContext';
import Home from './pages/Home';
import Explore from './pages/Explore';
import PlanMyTrip from './pages/PlanMyTrip';
import RecommendationResults from './pages/RecommendationResults';
import DestinationDetails from './pages/DestinationDetails';
import TripBuilder from './pages/TripBuilder';
import Saved from './pages/Saved';
import About from './pages/About';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/plan" element={<PlanMyTrip />} />
        <Route path="/results" element={<RecommendationResults />} />
        <Route path="/destination/:id" element={<DestinationDetails />} />
        <Route path="/trip-builder" element={<TripBuilder />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </Router>
    </ToastProvider>
  );
}

export default App;
