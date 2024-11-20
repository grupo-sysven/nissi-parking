import Printer, { JustifyModes, QrModes } from "esc-pos-printer";
import { useEffect, useState } from "react";
import moment from 'moment';

interface TicketData { 
    correlative: number; 
    date: string; 
    description: string; 
    entry_date: string; 
    plate: string
}
interface ChildComponentProps{
    ticketData: TicketData | null;
    setTicketData: React.Dispatch<React.SetStateAction<TicketData | null>>;
}

const Print:React.FC<ChildComponentProps> = ({ticketData, setTicketData}) =>{
    const [printers, setPrinters] = useState<string[] | []>([]);
    const [selectedPrinter, setSelectedPrinter] = useState<string | null>(null);

    const [btn,setBtn]= useState(true)

    const getPrinters = async () => {
        const printer = new Printer();
        const printers = await printer.getPrinters();
        setPrinters(printers);
    };

    const printTicket =async () => {
        if (selectedPrinter=="" || selectedPrinter==null) {
            alert("Debe Seleccionar una impresora");
        }else{
            const printer = new Printer();
            printer.setPrinterName(selectedPrinter)
            printer.justify(JustifyModes.justifyCenter)
            printer.text(`${import.meta.env.VITE_FIRST_HEADER}`)
            printer.feed();
            printer.text(`${import.meta.env.VITE_SECOND_HEADER}`)
            printer.feed();
            printer.justify(JustifyModes.justifyRight)
            printer.text(`Nro: ${ticketData?.correlative}`)
            printer.feed();
            printer.justify(JustifyModes.justifyLeft)
            printer.text(`PLACA: ${ticketData?.plate}`)
            printer.feed();
            printer.text(`TIPO: ${ticketData?.description}`)
            printer.feed();
            printer.text(`ENTRADA: ${moment(ticketData?.date).format("YYYY/MM/DD")}  ${moment(ticketData?.entry_date).format("HH:mm:ss")}`)
            printer.feed()
            printer.qrCode(String(ticketData?.correlative),2,QrModes.QR_MICRO)
            printer.feed()
            printer.feed()
            printer.justify(JustifyModes.justifyCenter)
            printer.setEmphasis(true)
            printer.text(`${import.meta.env.VITE_FIRST_FOOTER}`)
            printer.feed()
            printer.text(`${import.meta.env.VITE_SECOND_FOOTER}`)
            printer.feed()
            printer.feed()
            printer.feed()
            printer.feed()
            printer.feed()
            printer.feed()
            await printer.cut();
            await printer.close();
            await printer.print();
            setBtn(false)
            setSelectedPrinter(null)
        }
    }

    useEffect(()=>{
        getPrinters()
    },[])
    return(
        <div className="flex flex-col bg-white border rounded-lg shadow-lg mx-auto w-3/4">
            <span className="text-green-600 animate-bounce mx-auto mt-5">
                Registrado Correctamente
            </span>
            <div className="mx-auto flex flex-col text-center">
                <label htmlFor="printers" className="text-gray-400 mt-5">SELECCIONE UNA IMPRESORA</label>
                <select name="IMPRESORAS" id="printers" className="text-center text-lg mx-auto mb-5"
                    onChange={(e) => {
                            setSelectedPrinter(e.target.value)
                    }}
                >
                    <option value="">IMPRESORA</option>
                    {printers.map((p) => (
                    <option key={p} value={p}>
                        {p}
                    </option>
                ))}
                </select>
            </div>
            {btn==true?
                <button
                    className="bg-green-200 hover:bg-green-300 rounded-md shadow-md px-5 py-2 mx-auto w-[50%]"
                    onClick={() => {
                        printTicket()
                    }}
                >
                    IMPRIMIR
                </button>
                :
                <button
                    onClick={() => {
                        setTicketData(null)
                    }}
                    className="bg-red-200 hover:bg-red-300 rounded-md shadow-md px-5 py-2 mx-auto w-[50%]"
                >
                    SALIR
                </button>
            }
            {ticketData==null?
                    <div></div>
                    :
                    <ul className="flex flex-col text-center mx-10 my-5 text-xs">
                        <li><b>Nro: </b>{ticketData.correlative}</li>
                        <li><b>FECHA DE ENTRADA: </b>{moment(ticketData.date).format('YYYY/MM/DD')} <b>HORA: </b>{moment(ticketData.entry_date).format('HH:mm:ss')}</li>
                        <li><b>TIPO: </b>{ticketData.description}</li>
                        <li><b>PLACA: </b>{ticketData.plate}</li>
                    </ul>
                }
        </div>
    )
}

export default Print;