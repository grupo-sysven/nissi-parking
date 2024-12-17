import { useEffect, useState } from "react";
import { useParams } from "react-router"
import TicketComponent from "./TicketComponent";
import GoHome from "./GoHome";
import GoInfo from "./GoInfo";
interface TicketData{ 
    correlative: number; 
    date: string; 
    description: string; 
    entry_date: string; 
    plate: string
}


export default function TicketDetailComponent() {
    const { correlative }= useParams<{correlative:string}>();
    const [ticketInfo, setTicketInfo]=useState<TicketData| null>(null)

    const searchTicket=async()=>{
        try {
            const result= await fetch(`${import.meta.env.VITE_BASE_URL}getTicketInfo/${correlative}`,{
                method:"GET"
            })
            const data= await result.json()
            setTicketInfo(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        searchTicket()
    },[])

    return(
    <div className="flex justify-center flex-col text-center bg-[#1c37ff21] rounded-lg p-2 shadow-md my-auto w-full mx-10">
        <h1 className="">DETALLES DEL TICKET</h1>
        {ticketInfo?
            <TicketComponent TicketInfo={ticketInfo} download={true}/>
            :
            <span>NO SE PUDIERON CARGAR LOS DATOS PARA ESTE TICKET</span>
        }
        <GoHome/>
        <GoInfo/>
    </div>
    )
}