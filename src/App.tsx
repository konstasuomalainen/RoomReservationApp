import React from 'react';
import { Route, Routes, HashRouter } from 'react-router-dom';
import MainPage from './MainPage.tsx';
import RoomReservation from './roomReservation.tsx';


const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/roomReservation" element={<RoomReservation />} />
    </Routes>
    </HashRouter>
  );
}
export default App;