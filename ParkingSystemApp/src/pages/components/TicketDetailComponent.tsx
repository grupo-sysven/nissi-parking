import { useEffect } from "react";
import { useParams } from "react-router"

export default function TicketDetailComponent() {
    const { correlative }= useParams<{correlative:string}>();

    useEffect(()=>{
        console.log(correlative);
    },[])

    return(<>
    <h1 className="pt-20">AQUI DEBERIA MOSTRAR LOS DETALLES DEL TICKET</h1>
    <span>Nro: {correlative}</span>
    </>)
}