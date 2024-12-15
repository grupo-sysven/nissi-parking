import React, { useEffect, useState } from "react";

interface Types {
    code: string;
    description: string;
}

interface TicketData { 
    correlative: number; 
    date: string; 
    description: string; 
    entry_date: string; 
    plate: string
}
interface ChildComponentProps{
    setTicketData: React.Dispatch<React.SetStateAction<TicketData | null>>;
}

const TicketSet:React.FC<ChildComponentProps> = ({setTicketData}) => {
    const [types, setTypes] = useState<Types[]>([]);
    const [status, setStatus]=useState(true)

    const [plate, setPlate] = useState("");
    const [type, setType] = useState("");
    const getTypes = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}getTypes`);
            const data = await response.json();
            await setTypes(data);
        } catch (error) {
            console.log("Error get types: ", error);
        }
    };

    const setCar = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}setCar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ plate, type }),
        });
        const data = await response.json();
    
        if (data == false) {
            setStatus(false);
        } else if (data !== 0) {
            const correlative=data["correlative"]
            const date = new Date().toLocaleString();
            const tick = await fetch(
            `${import.meta.env.VITE_BASE_URL}setTicket`,{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body:JSON.stringify({correlative,date})
            }
            );
            const ticketData = await tick.json();
            setTicketData(ticketData);
            setPlate("");
            setStatus(true);
        }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(()=>{
        getTypes()
    },[])
    return (
    <form
        className="text-center bg-white border rounded-lg shadow-lg h-[50vh] flex flex-col justify-center"
        onSubmit={setCar}
        action=""
    >
        <label
            htmlFor="plate"
            className="text-2xl my-8 text-gray-600 hover:text-gray-700"
        >
            <b>PLACA DEL VEHICULO</b>
        </label>

        <input
        type="text"
        id="plate"
        className="w-4/5 h-20 mx-auto mt-3 border-2 border-b-gray-800 rounded-md hover:shadow-lg hover:bg-slate-300 hover:border-slate-300 hover:border-b-gray-800 bg-slate-200 text-3xl text-center"
        autoComplete="on"
        placeholder="Placa del vehículo"
        onChange={(e) => {
            setPlate(e.target.value.toUpperCase());
        }}
        value={plate}
        />
        {status==true?<div></div>:<div className="text-red-400 pt-5">DEBE INGRESAR UNA PLACA</div>}
        <div className="flex justify-evenly mt-5 ">
            {types.map((t) => (
            <button
                key={t.code}
                type="submit"
                onClick={() => {
                setType(t.code);
                }}
            >
                {t.code == "01" ? (
                <img src="./car.png" className="w-16" />
                ) : (
                <img src="./moto.png" className="w-16" />
                )}
            </button>
            ))}
        </div>
    </form>
);
}

export default TicketSet;