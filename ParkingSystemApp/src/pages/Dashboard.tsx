import { Link } from "react-router-dom";

export default function Dashboard() {
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
        </div>
    )
}