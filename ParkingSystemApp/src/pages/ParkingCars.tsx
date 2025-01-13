import { useEffect, useState } from "react";
import InParkingVehicle from "./components/InParkingVehicle";
import GoHome from "./components/GoHome";
import GoInfo from "./components/GoInfo";

interface TicketItem{
    correlative:number;
    date:string;
    entry_date:string;
    plate:string;
    description:string;
}


export default function ParkingCars() {
    const [tickets,setTickets] = useState<TicketItem[]>([])
    const [showTickets, setShowTickets]= useState<TicketItem[]>([])
    const [searchPlate, setSearchPlate] = useState('')
    const [filterType, setFilterType] = useState<string | null>(null);

    const fetchTickets=async()=>{
        try {
            const data= await fetch(`${import.meta.env.VITE_BASE_URL}getFalseTickets`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const tick = await data.json();
            setTickets(tick);
            setShowTickets(tick);
        } catch (error) {
            console.log(error)
        }
    }

    const applyFilters = () => {
        let filteredTickets = tickets;

        // Filtrar por placa si hay texto en la búsqueda
        if (searchPlate.trim() !== "") {
            filteredTickets = filteredTickets.filter((t) =>
                t.plate.toUpperCase().includes(searchPlate.toUpperCase())
            );
        }

        // Filtrar por tipo si hay un filtro seleccionado
        if (filterType) {
            filteredTickets = filteredTickets.filter((t) =>
                t.description.includes(filterType)
            );
        }

        setShowTickets(filteredTickets);
    };

    // Actualizar la lista mostrada cada vez que cambien los filtros
    useEffect(() => {
        applyFilters();
    }, [searchPlate, filterType, tickets]);

    useEffect(()=>{
        fetchTickets()
    },[])
    return(
    <div  className="my-32">
        <div className="w-full flex justify-center text-base">
            <input 
                type="text" 
                placeholder="Busqueda de placa..."
                className="text-center px-2 py-1 w-1/2 rounded-l-md"
                value={searchPlate}
                onChange={(e)=>setSearchPlate(e.target.value.toUpperCase())}
            />
            <button onClick={()=>setFilterType("CARROS")} className="px-2 bg-blue-700 text-white hover:bg-blue-800">CARROS</button>
            <button onClick={()=>setFilterType("MOTOS")} className="px-2 bg-lime-700 text-white hover:bg-lime-800">MOTOS</button>
            <button onClick={()=>setFilterType(null)} className="px-2 bg-gray-600 rounded-r-md text-white hover:bg-gray-700">TODOS</button>
        </div>
        <div className="flex flex-wrap justify-center mt-2">
            {showTickets.map((t) => (
                <InParkingVehicle key={t.correlative} correlative={t.correlative} entry_date={t.entry_date} plate={t.plate} description={t.description}/>
            ))}

        </div>
        <GoHome place="/coins"/>
        <GoInfo/>
    </div>
    )
}