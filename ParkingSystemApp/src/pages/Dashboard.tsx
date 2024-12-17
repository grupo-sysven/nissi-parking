import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GoInfo from "./components/GoInfo";

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
            className="bg-green-400 rounded-t-lg hover:bg-green-600 shadow-lg text-center text-xl"
          >
            <span>ENTRADA</span>
            <img src="./arrow-right-solid.svg" className="mx-auto h-[25vh] p-10"/>
          </Link>

          <Link
            to="/out"
            className="bg-red-400 rounded-b-lg hover:bg-red-600 shadow-lg text-center text-xl"
          >
            <span>SALIDA</span>
            <img src="./arrow-right-solid.svg" className="mx-auto h-[25vh] p-10 rotate-180"/>
          </Link>
          <div className="fixed right-0 bottom-0 w-full text-center">  
            {tick.map((tic) =>
            tic.status == true ? (
              <div className="mx-5">
                <b>SALIDAS: </b>
                <span>
                  {tic.count}
                </span>
              </div>
            ) : (
              <div className="mx-5">
                {/* <img src="./check.png" className="w-10 h-auto"/> */}
                <b>ENTRADAS: </b>
                <span>
                  {tic.count}
                </span>
              </div>
            )
            )}
          </div>
          <GoInfo/>
        </div>
    )
}