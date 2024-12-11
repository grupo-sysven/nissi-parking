import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

import Coins from "./pages/Coins";
import Dashboard from "./pages/Dashboard";
import InCar from "./pages/InCar";
import OutCar from "./pages/OutCar";
import Cars from "./pages/Cars";
import ParkingCars from "./pages/ParkingCars";
import { useEffect, useState } from "react";
import TicketDetailComponent from "./pages/components/TicketDetailComponent";

function App() {
  const [time,setTime]=useState("")
  const clock=()=>{
    const date= new Date().toLocaleString()
    setTime(date)
  }
  useEffect(()=>{
    setInterval (clock, 1000);
  })
  return (
    <>
      <BrowserRouter>
        <div className="fixed flex w-full justify-between" style={{backgroundColor:"#060062"}}>
          <Link to="/coins" className="my-auto ml-10">
            <span className="text-xs text-amber-300 hover:bg-amber-300 p-2 rounded-sm hover:text-black">
              INFORMACIÓN
            </span>
            {/* <img src="./coins.png" className="w-7"/> */}
          </Link>
          <Link to="/" className="py-2 text-center text-sm text-white my-auto">
            <b>Centro Civico San Cristobal</b>
          </Link>
          <div className="">
            <img src="./logo-nissi-white.png" className="w-16 mx-5 my-1"/>
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
          </Routes>
        </div>
        <div className="fixed bottom-5 right-0 px-2 text-sm text-nowrap mx-auto bg-[#060062] text-[#ffffff] rounded-l-sm">
            {time}
        </div>
      </BrowserRouter>
    </>
  );
}
export default App;
