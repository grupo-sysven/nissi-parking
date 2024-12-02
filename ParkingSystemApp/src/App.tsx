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
        <div className="fixed flex w-full" style={{backgroundColor:"#060062"}}>
          <Link to="/coins" className="my-auto ml-10">
            <img src="./coins.png" className="w-7"/>
          </Link>
          <Link to="/" className="py-2 text-center text-xs w-full text-white">
            <b>Centro Civico San Cristobal</b>
          </Link>
          <img src="./logo-nissi-white.png" className="w-16 mr-5"/>
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
