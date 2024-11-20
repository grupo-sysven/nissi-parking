import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

import Coins from "./pages/Coins";
import Dashboard from "./pages/Dashboard";
import InCar from "./pages/InCar";
import OutCar from "./pages/OutCar";
import Cars from "./pages/Cars";


function App() {
  return (
    <>
      <BrowserRouter>
        <div className="bg-blue-500 fixed flex w-full">
          <Link to="/coins" className="my-auto ml-10">
            <img src="./coins.webp" className="w-7"/>
          </Link>
          <Link to="/" className=" py-2 text-center text-xs w-full">
            <b>Centro Civico San Cristobal</b>
          </Link>
          <img src="./logo-nissi-black.png" className="w-16 mr-5"/>
        </div>
        <div className="flex justify-center h-[100vh]">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/in" element={<InCar />} />
            <Route path="/out" element={<OutCar />} />
            <Route path="/cars" element={<Cars />} />
            <Route path="/coins" element={<Coins/>} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}
export default App;
