import { useEffect, useState } from "react"
import { Html5QrcodeScanner } from "html5-qrcode";
import moment from 'moment';
import GoHome from "./components/GoHome";


interface scanData {
    correlative:number;
    date: string;
    description:string;
    entry_date: string;
    out_date:string;
    plate:string;
    status:boolean;
  }

export default function OutCar() {
    const [scanResult,setScanResult]=useState<scanData| null>(null)

    const [refresh, setRefresh]=useState(true)

    useEffect(()=>{
        setScanResult(null)
        const scanner=new Html5QrcodeScanner("reader",{
            fps:10, 
            qrbox:{
                height:500,
                width:500,
            },
            supportedScanTypes:[0,1]
        },false)
        async function success(result:string){
            scanner.clear()
            try {
                const response=await fetch(`${import.meta.env.VITE_BASE_URL}updateTicket/${result}`,{
                    method:'POST'
                })
                const data= await response.json()
                setScanResult(data)
            } catch (error) {
                console.log("ERROR AL GENERARA")
            }
            
        }
        scanner.render(success, (e)=>{
            if(scanResult!==null && scanResult.status!==false){
                console.log(scanResult)
                console.log(e)
            }
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[refresh])
    return( 
        <div className="flex flex-col my-auto w-1/2 text-center">
            <div id="reader"></div>
            {scanResult==null?
                <div className="w-full bg-gray-200 rounded-b-lg">REGISTRE EL QR DEL TICKET AQUI ARRIBA</div>
            :scanResult.status==false?
            <span className="text-red-500 mx-auto">CARRO YA REGISTRADA SU SALIDA</span>
            :
            <div className="flex justify-center flex-col">    
                <ul className="bg-green-300 rounded-md p-5 shadow-md text-center">
                    <li><b>TICKET: </b>Noº {scanResult.correlative}</li>
                    <li><b>PLACA: </b>{scanResult.plate} <b>TIPO: </b> {scanResult.description}</li>
                    <li><b>ENTRADA: </b>{moment(scanResult.date).format("YYYY/MM/DD")} <b>HORA:</b> {moment(scanResult.entry_date).format("HH:mm:ss")}</li>
                    <li><b>SALIDA:</b> {moment(scanResult.out_date).format("YYYY/MM/DD HH:mm:ss")}</li>
                </ul>
                <span className="mx-auto animate-bounce pt-5">REGISTRADO CORRECTAMENTE</span>
            </div>
            }
            <button onClick={()=>setRefresh(!refresh)} className="bg-green-600 px-3 py-1 mx-auto mt-3 rounded-md shadow-md hover:bg-green-800">Escanear otro...</button>
            <GoHome/>
        </div>
    )
}