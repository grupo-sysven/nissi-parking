import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { TbParkingCircle } from "react-icons/tb";

import Price from "./components/Price";
import GoHome from "./components/GoHome";

interface Ticket {
  count: string;
  status: boolean;
}
interface Prices {
  bs:number;
  dls:number;
  psos:number;
  type_code:string;
}

export default function Coins() {
  const [tick, setTick] = useState<Ticket[]>([]);
  const [pric, setPric] = useState<Prices[]>([]);
  const [apearInfo,setApearInfo]= useState(false);

  const getTickets = async () => {
    try {
      const tick = await fetch(`${import.meta.env.VITE_BASE_URL}getAllTickets`);
      const data = await tick.json();
      setTick(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getPrices = async () => {
    try {
      const prices = await fetch(`${import.meta.env.VITE_BASE_URL}getPrices`);
      const data = await prices.json();
      setPric(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTickets();
    getPrices();
  }, []);
  useEffect(() => {
    if(apearInfo){
      alert("MONEDA ACTUALIZADA CORRECTAMENTE")
    }
    // if (apearInfo) {
    //   const timer = setTimeout(() => {
    //     setApearInfo(false);
    //   }, 2000);

    //   // Limpieza del temporizador si el componente se desmonta antes de que se cumpla el tiempo
    //   return () => clearTimeout(timer);
    // }
  }, [apearInfo]);
  return (
    <div className="flex flex-col my-auto text-center">
      <div className="flex justify-evenly mb-4">
        {tick.map((tic, index) =>
          tic.status == true ? (
            <div key={index} className="p-4 w-1/2 ml-2 rounded-md border border-gray-500 bg-gray-100  font-bold">
              <b>SALIDAS</b>
              <div className="text-2xl">
                {tic.count}
              </div>
            </div>
          ) : (
            <div key={index} className="p-4 w-1/2 mr-2 rounded-md border border-gray-500 bg-gray-100  font-bold">
              {/* <img src="./check.png" className="w-10 h-auto"/> */}
              <b>ENTRADAS</b>
              <div className="text-2xl">
                {tic.count}
              </div>
            </div>
          )
        )}
        {/* <Link to="/cars" className="my-auto">
          <img src="./eye.png" className="w-10 my-auto" />
        </Link> */}
      </div>
      <div className="bg-gray-400 text-lg rounded-t-sm p-2 font-bold">
        PRECIOS
      </div>
      <table className="bg-white shadow-lg mb-4">
        <thead className="bg-blue-300">
          <tr>
            <th className="p-2 border-b border-separate">
              <b></b>
            </th>
            <th className="p-2 border-b border-separate">
              <b>USD</b>
            </th>
            <th className="p-2 border-b border-separate">
              <b>VES</b>
            </th>
            <th className="p-2 border-b border-separate">
              <b>COP</b>
            </th>
            <th className="p-2 border-b border-separate">
              <b></b>
            </th>
          </tr>
        </thead>
        <tbody>
          {pric.map((p)=>(
              <Price type={p.type_code} pricebs={p.bs}  pricedls={p.dls} pricepsos={p.psos} key={p.type_code} setApearModal={setApearInfo}/>
          ))
          }
        </tbody>
      </table>
      <Link to="/dailyreport" className="flex items-center justify-center gap-4 p-3 mb-4 bg-[#060062] shadow-md text-lg hover:bg-orange-600 rounded-md text-[#EAEAEA]">
        <RiMoneyDollarCircleLine size={25} />
        INGRESOS DEL DÍA
      </Link>
      <Link to="/parkingCars" className="flex items-center justify-center gap-4 p-3 bg-[#060062] shadow-md text-lg hover:bg-orange-600 rounded-md text-[#EAEAEA]">
        <TbParkingCircle size={25} />
        VEHÍCULOS ESTACIONADOS
      </Link>
      <GoHome place="/"/>
    </div>
  );
}
