import { HashRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/CartProvider';
import LandingOrHome from './components/LandingOrHome';
import Login from './components/Login';
import AppContent from './components/AppContent';
import UserProtectedRoute from './components/UserProtectedRoute';
import './App.css';

function AppRoutes() {
    return (
        <>
            <Routes>
                <Route path="/" element={<LandingOrHome />} />
                <Route path="/login/:type" element={<Login />} />
                <Route 
                    path="/*" 
                    element={
                        <UserProtectedRoute>
                            <AppContent />
                        </UserProtectedRoute>
                    } 
                />
            </Routes>
        </>
    );
}

function App() {
    return (
        <CartProvider>
            <HashRouter>
                <AppRoutes />
            </HashRouter>
        </CartProvider>
    );
}

export default App;