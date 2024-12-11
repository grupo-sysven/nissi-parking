import { Link } from "react-router-dom";

interface VehicleItem{
    correlative:number;
    entry_date:string;
    plate:string;
    description:string;
}

const InParkingVehicle: ({ correlative, entry_date, plate, description }: VehicleItem) => React.JSX.Element = ({
    correlative,
    entry_date,
    plate,
    description,
}) => {
    const svgCar=<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-car-front-fill" viewBox="0 0 16 16">
    <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679q.05.242.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.8.8 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17s3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z"/>
    </svg>

    const svgMotorcicle=<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bicycle" viewBox="0 0 16 16">
    <path d="M4 4.5a.5.5 0 0 1 .5-.5H6a.5.5 0 0 1 0 1v.5h4.14l.386-1.158A.5.5 0 0 1 11 4h1a.5.5 0 0 1 0 1h-.64l-.311.935.807 1.29a3 3 0 1 1-.848.53l-.508-.812-2.076 3.322A.5.5 0 0 1 8 10.5H5.959a3 3 0 1 1-1.815-3.274L5 5.856V5h-.5a.5.5 0 0 1-.5-.5m1.5 2.443-.508.814c.5.444.85 1.054.967 1.743h1.139zM8 9.057 9.598 6.5H6.402zM4.937 9.5a2 2 0 0 0-.487-.877l-.548.877zM3.603 8.092A2 2 0 1 0 4.937 10.5H3a.5.5 0 0 1-.424-.765zm7.947.53a2 2 0 1 0 .848-.53l1.026 1.643a.5.5 0 1 1-.848.53z"/>
  </svg>
    return (
    <>
    <Link to={`/parkingCars/ticketDetail/${correlative}`} > 
        <div className="truncate bg-slate-300 hover:bg-slate-400 shadow-lg  border border-black rounded-sm flex flex-col mr-3 mb-3 text-center text-sm p-4">
            <div className="mx-2 mt-2 flex justify-between">
                <div>
                    <b>Nro:</b>
                    <span className="mx-1">{correlative}</span>
                </div>
                <div className={`${description=="CARROS"?"text-blue-700":"text-lime-700"} my-auto`}>
                    {description=="CARROS"?svgCar:svgMotorcicle}
                </div>
            </div>
            <hr className="mx-2 my-1"/>
            <div className="mx-2 flex justify-between"><b>Entrada:</b> <span className="italic ">{entry_date}</span></div>
            <hr className="mx-2 my-1"/>
            <div className="mx-2 flex justify-between"><b>Placa:</b> <span className="text-slate-900">{plate}</span></div>
        </div>
    </Link>
    </>
    )
};

export default InParkingVehicle