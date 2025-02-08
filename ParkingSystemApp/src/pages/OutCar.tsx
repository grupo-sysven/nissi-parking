import { useEffect, useState } from "react"
import { Html5QrcodeScanner } from "html5-qrcode";
import moment from 'moment';
import GoHome from "./components/GoHome";
import GoInfo from "./components/GoInfo";


interface scanData {
    correlative:number;
    date: string;
    description:string;
    entry_date: string;
    out_date:string;
    plate:string;
    status:boolean;
}

interface Coin {
    code: string;
    description: string;
}

export default function OutCar() {
    const [scanResult,setScanResult] = useState<scanData | null>(null);

    const [refresh, setRefresh] = useState(true);

    const [paymentCoin, setPaymentCoin] = useState("MONEDA DE PAGO");
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(e.target.value);
        setPaymentCoin(e.target.value);
    };
    const [coins, setCoins] = useState<Coin[]>([]);

    const getCoins = async () => {
        try {
            const coins = await fetch(`${import.meta.env.VITE_BASE_URL}getCoins`);
            const data = await coins.json();
            setCoins(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCoins();
        const scanner = new Html5QrcodeScanner("reader", {
            fps:40, 
            qrbox:{
                height:500,
                width:500,
            },
            supportedScanTypes:[0],
            formatsToSupport:[0],
        }, false);
        if (paymentCoin !== "MONEDA DE PAGO") {
            setScanResult(null)
            async function success(result:string){
                scanner.clear()
                try {
                    const response=await fetch(`${import.meta.env.VITE_BASE_URL}updateTicket/${result}/${paymentCoin}`,{
                        method:'POST'
                    })
                    const data= await response.json()
                    setScanResult(data)
                } catch (error) {
                    console.log(error);
                    alert("ERROR AL LEER EL TICKET")
                    return
                }
                
            }
            scanner.render(success, (e) => {
                if(scanResult!==null && scanResult.status!==false){
                    console.log(scanResult)
                    console.log(e)
                }
            })
        } else {
            setScanResult(null)
            async function success(result:string){
                scanner.clear()
                try {
                    const response=await fetch(`${import.meta.env.VITE_BASE_URL}updateTicket/${result}/${paymentCoin}`,{
                        method:'POST'
                    })
                    const data= await response.json()
                    setScanResult(data)
                } catch (error) {
                    console.log(error);
                    alert("ERROR AL LEER EL TICKET")
                    return
                }
                
            }
            scanner.render(success, (e) => {
                if(scanResult!==null && scanResult.status!==false){
                    console.log(scanResult)
                    console.log(e)
                }
            })
            scanner.clear();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentCoin, refresh])
    return( 
        <div className="flex flex-col justify-center text-center p-8 w-full">
            <div>
                <select className="w-full p-4 mb-4 border rounded-lg outline-none transition-all duration-300 border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200" id="currency" value={paymentCoin} onChange={handleChange}>
                    <option value="MONEDA DE PAGO">MONEDA DE PAGO</option>
                    {coins.map(coin => <option key={coin.code} value={coin.code}>{coin.description}</option>)}
                </select>
            </div>
            <div id="reader"></div>
            {paymentCoin !== "MONEDA DE PAGO" && (
                scanResult == null
                    ? <div className="w-full p-4 bg-gray-200 rounded-b-lg"><p>PRESIONE EL RECUADRO DE ARRIBA</p><p>PARA ESCANEAR</p></div>
                    : scanResult.status == false
                        ? <span className="text-red-500 mx-auto">CARRO YA REGISTRADA SU SALIDA</span>
                        : <div className="flex justify-center flex-col">    
                            <ul className="bg-green-300 rounded-md p-5 shadow-md text-center">
                                <li><b>TICKET: </b>Nº {scanResult.correlative}</li>
                                <li><b>PLACA: </b>{scanResult.plate} <b>| TIPO: </b> {scanResult.description}</li>
                                <li><b>ENTRADA: </b>{moment(scanResult.date).format("YYYY/MM/DD")} <b>|</b> {moment(scanResult.entry_date).format("HH:mm:ss")}</li>
                                <li><b>SALIDA:</b>{moment(scanResult.out_date).format("YYYY/MM/DD HH:mm:ss")}</li>
                            </ul>
                            <span className="mx-auto animate-bounce pt-5 mb-2">REGISTRADO CORRECTAMENTE</span>
                            <button onClick={()=>setRefresh(!refresh)} className="border border-green-500 bg-green-400 rounded-md shadow-md p-2 mb-6 hover:bg-green-500">NUEVO ESCANEO</button>
                        </div>
                )
            }
            <GoHome place="/"/>
            <GoInfo/>
        </div>
    )
}