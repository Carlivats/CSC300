import React from "react";
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
import './css/card.css';
import './index.css';

// We import all the components we need in our app
import Navbar from "./components/navbar";
import LandingPage from "./pages/landingPage";
import HomePage from "./pages/homePage";
import Login from "./pages/loginPage";
import Signup from "./pages/registerPage";
import MbtaAlertsPage from "./components/Alerts";
import PrivateUserProfile from "./pages/privateUserProfilePage";
import { createContext, useState, useEffect } from "react";
import getUserInfo from "./utilities/decodeJwt";
import MbtaVehicles from "./pages/mbtaVehicles"
import TrainInfo from "./pages/trainInfo"
import TrainSelection from './pages/trainSelection';
import TrainSchedule from './pages/trainSchedule';
import TrainTest from './pages/trainTest';
import MbtaLayoutPage from "./pages/MBTALayoutPage";


export const UserContext = createContext();
//test change
//test again
const App = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  return (
    <>
      <Navbar />
      <UserContext.Provider value={user}>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/home" element={<HomePage />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/privateUserProfile" element={<PrivateUserProfile />} />
          <Route exact path="/Alerts" element={<MbtaAlertsPage />} />
          <Route exact path="/mbtaVehicles" element={<MbtaVehicles />} />
          <Route exact path="/trainInfo" element={<TrainInfo />} />
          <Route exact path="/train-selection" element={<TrainSelection />} />
          <Route exact path="/train-schedule/:lineId" element={<TrainSchedule />} />
          <Route exact path="/trainTest" element={<TrainTest />} />
          <Route exact path="/mbtaLayout" element={<MbtaLayoutPage />} />
        </Routes>
      </UserContext.Provider>
    </>
  );
};



export default App
