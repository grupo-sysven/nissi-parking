import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GoInfo from "./components/GoInfo";
import { IoArrowRedo } from "react-icons/io5";

interface Ticket {
  count: string;
  status: boolean;
}

export default function Dashboard() {
    const [tick, setTick] = useState<Ticket[]>([]);
    const getTickets = async () => {
      try {
        const tick = await fetch(`${import.meta.env.VITE_BASE_URL}getAllTickets`);
        const data = await tick.json();
        setTick(data);
        console.log(data)
      } catch (error) {
        console.log(error);
      }
    };
    useEffect(() => {
        getTickets();
      }, []);
    return(
        <div className="flex flex-col justify-center rounded-lg my-auto">
          <Link
            to="/in"
            className="px-8 py-4 bg-green-400 rounded-t-lg hover:bg-green-600 shadow-lg text-center text-xl font-bold"
          >
            ENTRADA
            <div className="flex justify-center mt-4">
              <IoArrowRedo size={200} />
            </div>
          </Link>

          <Link
            to="/out"
            className="px-8 py-4 mb-4 bg-red-400 rounded-b-lg hover:bg-red-600 shadow-lg text-center text-xl font-bold"
          >
            SALIDA
            <div className="flex justify-center mt-4">
              <IoArrowRedo className="rotate-180" size={200} />
            </div>
          </Link>
          <div className="flex text-center">  
            {tick.map((tic, index) =>
            tic.status == true ? (
              <div key={index} className="p-4 w-1/2 ml-2 rounded-md border border-gray-500 bg-gray-100 font-bold">
                SALIDAS
                <div className="text-2xl">
                  {tic.count}
                </div>
              </div>
            ) : (
              <div key={index} className="p-4 w-1/2 mr-2 rounded-md border border-gray-500 bg-gray-100 font-bold">
                {/* <img src="./check.png" className="w-10 h-auto"/> */}
                ENTRADAS
                <div className="text-2xl">
                  {tic.count}
                </div>
              </div>
            )
            )}
          </div>
          <GoInfo/>
        </div>
    )
}