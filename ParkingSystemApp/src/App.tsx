import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { useEffect, useState } from "react";

import Coins from "./pages/Coins";
import Dashboard from "./pages/Dashboard";
import InCar from "./pages/InCar";
import OutCar from "./pages/OutCar";
import Cars from "./pages/Cars";
import ParkingCars from "./pages/ParkingCars";
import TicketDetailComponent from "./pages/components/TicketDetailComponent";
import DailyReport from "./pages/DailyReport";

const options: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric" ,
  second: "numeric",
  dayPeriod:"narrow",
};
function App() {
  const [time,setTime]=useState("")
  
  const clock=()=>{
    const date= new Date().toLocaleString('es-ES',options)
    setTime(date)
  }
  useEffect(() => {
    const intervalId = setInterval(clock, 1000);
    return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente.
  }, []);
  return (
    <>
      <BrowserRouter>
        <div className="fixed w-full text-center justify-center" style={{backgroundColor:"#060062"}}>
          <div className="py-2">
            <Link to="/" className="py-2 text-lg text-white my-auto">
              <b>CENTRO CÍVICO SAN CRISTÓBAL</b>
            </Link>
          </div>
          <div className="text-sm text-[#ffffff] bg-[#191270]">
            {time}
          </div>
        </div>
        <div className="flex justify-center h-[100vh]">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/in" element={<InCar />} />
            <Route path="/out" element={<OutCar />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/coins" element={<Coins/>} />
            <Route path="/parkingCars" element={<ParkingCars/>}/>
            <Route path="/parkingCars/ticketDetail/:correlative" element={<TicketDetailComponent/>}/>
            <Route path="/dailyreport" element={<DailyReport/>}/>
          </Routes>
        </div>
          {/* <img src="/logo-nissi-white.png" className="w-[10px] fixed bottom-0 bg-blue-400"/> */}
      </BrowserRouter>
    </>
  );
}
export default App;
