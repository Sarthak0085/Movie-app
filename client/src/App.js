import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomeScreen from './Screens/HomeScreen';
import NotFound from './Screens/NotFound';
import AboutUs from './Screens/AboutUs';

function App() {
  return (
    <Routes>
      <Route path='/' element={<HomeScreen /> } />
      <Route path='/about-us' element={<AboutUs /> } />
      <Route path='*' element={<NotFound /> } />
    </Routes>
  );
}

export default App;
