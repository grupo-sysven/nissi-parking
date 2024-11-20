import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Price from "./components/Price";

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
  return (
    <div className="flex flex-col mt-10">
      <div className="flex justify-evenly">
        {tick.map((tic) =>
          tic.status == false ? (
            <div className="my-auto">
              <b className="">nocheck</b>
              <span className="my-auto">
                {tic.count}
              </span>
            </div>
          ) : (
            <div className="my-auto">
              {/* <img src="./check.png" className="w-10 h-auto"/> */}
              <b className="">check</b>
              <span className="my-auto">
                {tic.count}
              </span>
            </div>
          )
        )}
        <Link to="/cars" className="my-auto">
          <img src="./eye.png" className="w-10 my-auto" />
        </Link>
      </div>
      <table className="bg-white shadow-lg mx-10">
        <thead className="bg-blue-300 p-2 ">
          <tr>
            <th className="border border-separate">
              <b></b>
            </th>
            <th className="border border-separate">
              <b>DLS</b>
            </th>
            <th className="border border-separate">
              <b>BS</b>
            </th>
            <th className="border border-separate">
              <b>PESOS</b>
            </th>
            <th className="border border-separate">
              <b></b>
            </th>
          </tr>
        </thead>
        <tbody>
          {pric.map((p)=>(
              <Price type={p.type_code} pricebs={p.bs}  pricedls={p.dls} pricepsos={p.psos}/>
          ))
          }
        </tbody>
      </table>
    </div>
  );
}
