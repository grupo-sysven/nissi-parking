import { useEffect, useState } from "react"
import { Html5QrcodeScanner } from "html5-qrcode";
import moment from 'moment';


interface scanData {
    car_correlative:number;
    correlative: number;
    date:string;
    entry_date: string;
    out_date:string;
  }

export default function OutCar() {
    const [scanResult,setScanResult]=useState<scanData[]>([])

    const [refresh, setRefresh]=useState(true)

    useEffect(()=>{
        setScanResult([])
        const scanner=new Html5QrcodeScanner("reader",{fps:10, qrbox:{
            height:500,
            width:500
        }})
        async function success(result:string){
            scanner.clear()
            const response=await fetch(`http://localhost:3000/updateTicket/${result}`,{
                method:'POST'
            })
            const data= await response.json()
            setScanResult(data)
        }
        scanner.render(success)
    },[refresh])
    return( 
        <div className="flex flex-col my-auto w-1/2">
            <div id="reader"></div>
            {scanResult.length==0?
            <div></div>
            :scanResult==false?
            <span className="text-red-500 mx-auto">CARRO YA REGISTRADA SU SALIDA</span>
            :
            <div className="flex justify-center flex-col">    
                <ul className="bg-green-300 rounded-md p-5 shadow-md text-center">
                    <li><b>TICKET: </b>Noº {scanResult["correlative"]}</li>
                    <li><b>PLACA: </b>{scanResult["plate"]} <b>TIPO: </b> {scanResult["description"]}</li>
                    <li><b>ENTRADA: </b>{moment(scanResult["date"]).format("YYYY/MM/DD")} <b>HORA:</b> {moment(scanResult["entry_date"]).format("HH:mm:ss")}</li>
                    <li><b>SALIDA:</b> {moment(scanResult["out_date"]).format("YYYY/MM/DD HH:mm:ss")}</li>
                </ul>
                <span className="mx-auto animate-bounce pt-5">REGISTRADO CORRECTAMENTE</span>
            </div>
            }
            <button onClick={()=>setRefresh(!refresh)} className="bg-green-600 px-3 py-1 mx-auto mt-3 rounded-md shadow-md hover:bg-green-800">Escanear otro...</button>
        </div>
    )
}