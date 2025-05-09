import React from "react";
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
import './css/card.css';
import './index.css';

// We import all the components we need in our app
import Navbar from "./components/navbar";
import LandingPage from "./components/pages/landingPage";
import HomePage from "./components/pages/homePage";
import Login from "./components/pages/loginPage";
import Signup from "./components/pages/registerPage";
import MbtaAlertsPage from "./components/pages/mbtaAlerts";
import PrivateUserProfile from "./components/pages/privateUserProfilePage";
import { createContext, useState, useEffect } from "react";
import getUserInfo from "./utilities/decodeJwt";
import MbtaVehicles from "./components/pages/mbtaVehicles"
import TrainInfo from "./components/pages/trainInfo"
import TrainSelection from './components/pages/trainSelection';
import TrainSchedule from './components/pages/trainSchedule';
import TrainTest from './components/pages/trainTest';
import MbtaLayoutPage from "./components/pages/MBTALayoutPage";


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
          <Route exact path="/mbtaAlerts" element={<MbtaAlertsPage />} />
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
