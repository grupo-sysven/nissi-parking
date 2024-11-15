import { Link } from "react-router-dom";

export default function Dashboard() {
    return(
        <div className="flex flex-col justify-center rounded-lg my-auto">
          <Link
            to="/in"
            className="bg-green-400 rounded-t-lg hover:bg-green-600 shadow-lg"
          >
            {/* border border-transparent rounded-md shadow shadow-green-800/50 hover:shadow-lg text-center bg-green-400 hover:bg-green-600 mb-5 mx-2 py-20 */}
            <img src="./car_moving_flip.png" className="mx-auto h-[30vh]"/>
          </Link>

          <Link
            to="/out"
            className="bg-red-400 rounded-b-lg hover:bg-red-600 shadow-lg"
          >
            {/* border border-transparent rounded-md shadow shadow-red-800/50 hover:shadow-lg text-center bg-red-500 hover:bg-red-700 mx-2 py-20 */}
            <img src="./car_moving.png" className="mx-auto h-[30vh]"/>
          </Link>
        </div>
    )
}