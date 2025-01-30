import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Login from './screens/login';
import Dashboard from './screens/dashboard';
import Navbar from './components/NavBar';
import PrivateRoute from './components/PrivateRoute';
import Look from './screens/look';
function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

function Main() {
  const location = useLocation();  // Aquí usamos useLocation

  return (
    <div className="flex">
      {/* Solo mostramos el Navbar si no estamos en la ruta '/' */}
      {location.pathname !== '/' && <Navbar />}

      <div className="w-full">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/look" element={<PrivateRoute element={<Look />} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

