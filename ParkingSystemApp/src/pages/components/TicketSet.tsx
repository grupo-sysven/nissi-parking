import React, { useEffect, useState } from "react";
import { FaCarSide } from "react-icons/fa6";
import { FaMotorcycle } from "react-icons/fa";

interface Types {
    code: string;
    description: string;
}

interface TicketData { 
    correlative: number; 
    date: string; 
    description: string; 
    entry_date: string; 
    plate: string;
    payment_coin: string;
}
interface ChildComponentProps{
    setTicketData: React.Dispatch<React.SetStateAction<TicketData | null>>;
}
/*interface Coin {
    code: string;
    description: string;
}*/

const TicketSet:React.FC<ChildComponentProps> = ({setTicketData}) => {
    const [types, setTypes] = useState<Types[]>([]);
    const [status, setStatus]=useState(true)

    const [plate, setPlate] = useState("");
    const [type, setType] = useState("");
    /*const [paymentCoin, setPaymentCoin] = useState("MONEDA DE PAGO");
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(e.target.value);
        setPaymentCoin(e.target.value);
    };
    const [coins, setCoins] = useState<Coin[]>([]);*/

    /*const getCoins = async () => {
        try {
            const coins = await fetch(`${import.meta.env.VITE_BASE_URL}getCoins`);
            const data = await coins.json();
            setCoins(data);
        } catch (error) {
            console.log(error);
        }
    };*/

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
            //} else if (paymentCoin == "MONEDA DE PAGO") {
                //setStatus(false);
            } else if (data !== 0 /*&& paymentCoin !== "MONEDA DE PAGO"*/) {
                const correlative=data["correlative"]
                const date = new Date().toLocaleString();
                console.log(correlative);
                console.log(date);
                //console.log(paymentCoin);
                const tick = await fetch(
                    `${import.meta.env.VITE_BASE_URL}setTicket`,{
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body:JSON.stringify({correlative, date, paymentCoin: ""})
                    }
                );
                const ticketData = await tick.json();
                console.log("Información devuelta: " + JSON.stringify(ticketData));
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
        //getCoins()
    },[])

    return (
    <form
        className="text-center bg-white border rounded-lg shadow-lg flex flex-col p-8"
        onSubmit={setCar}
        action=""
    >
        <label htmlFor="plate" className="text-2xl mb-6 text-gray-600 hover:text-gray-700">
            <b>REGISTRAR ENTRADA</b>
        </label>

        <input
            type="text"
            id="plate"
            className="p-4 mb-4 border rounded-lg outline-none transition-all duration-300 border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
            autoComplete="on"
            placeholder="PLACA DEL VEHÍCULO"
            onChange={(e) => {
                setPlate(e.target.value.toUpperCase());
            }}
            value={plate}
        />

        {status == true ? <div></div> : <div className="text-red-400 pt-5">DEBE INGRESAR UNA PLACA Y MONEDA DE PAGO</div>}

        <div className="flex justify-around mt-5">
            {types.map((t) => (
            <button
                className="px-4 py-2 rounded-md bg-[#191270]"
                key={t.code}
                type="submit"
                onClick={() => {
                    setType(t.code);
                }}
            >
                {t.code == "01" ? (
                    <FaCarSide className="text-white" size={50} />
                ) : (
                    <FaMotorcycle className="text-white" size={50} />
                )}
            </button>
            ))}
        </div>
    </form>
);
}

export default TicketSet;