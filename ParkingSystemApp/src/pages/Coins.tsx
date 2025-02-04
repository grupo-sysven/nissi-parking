import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
      <div className="flex justify-evenly">
        {tick.map((tic, index) =>
          tic.status == true ? (
            <div key={index} className="my-auto mx-auto">
              <b className="">SALIDAS: </b>
              <span className="my-auto">
                {tic.count}
              </span>
            </div>
          ) : (
            <div key={index} className="my-auto mx-auto">
              {/* <img src="./check.png" className="w-10 h-auto"/> */}
              <b className="">ENTRADAS: </b>
              <span className="my-auto">
                {tic.count}
              </span>
            </div>
          )
        )}
        {/* <Link to="/cars" className="my-auto">
          <img src="./eye.png" className="w-10 my-auto" />
        </Link> */}
      </div>
      <div className="bg-gray-400 text-lg rounded-t-sm">
        PRECIOS
      </div>
      <table className="bg-white shadow-lg">
        <thead className="bg-blue-300 p-2 ">
          <tr>
            <th className="border border-separate">
              <b></b>
            </th>
            <th className="border border-separate">
              <b>USD</b>
            </th>
            <th className="border border-separate">
              <b>Bs</b>
            </th>
            <th className="border border-separate">
              <b>COP</b>
            </th>
            <th className="border border-separate">
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
      <Link to="/dailyreport" className="my-2 p-3 bg-[#060062] shadow-md text-xl hover:bg-orange-600 rounded-sm text-[#EAEAEA]">
        $ INGRESOS DEL DIA
      </Link>
      <Link to="/parkingCars" className=" p-3 bg-[#060062] shadow-md text-xl hover:bg-orange-600 rounded-sm text-[#EAEAEA]">
        <span className="">VEHÍCULOS EN EL ESTACIONAMIENTO</span>
      </Link>
      <GoHome place="/"/>
    </div>
  );
}
