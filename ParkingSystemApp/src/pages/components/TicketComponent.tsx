import { useCallback, useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import moment from "moment";
import QRCode  from "qrcode";
import { pdf } from "@react-pdf/renderer";
import TicketPDF from "./TicketPDF";

interface TicketData { 
    correlative: number; 
    date: string; 
    description: string; 
    entry_date: string; 
    plate: string;
    payment_coin: string;
}

interface ChildComponentProps{
    TicketInfo: TicketData | null;
    download: boolean;
}

interface Prices {
    bs:number;
    dls:number;
    psos:number;
    type_code:string;
}

const TicketComponent:React.FC<ChildComponentProps>=({TicketInfo, download}) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const [base64,setBase64]=useState("");
    const [pric, setPric] = useState<Prices[]>([]);

    const getPrices = async () => {
        try {
            const prices = await fetch(`${import.meta.env.VITE_BASE_URL}getPrices`);
            const data = await prices.json();
            setPric(data);
        } catch (error) {
            console.log(error);
        }
    };

    const QR=async(text:string)=>{
        await QRCode.toDataURL(text,(err,text)=>{
            if (err){
                console.log(err)
                return
            }
            else{
                setBase64(text)
                return
            }
        })
    }

    const onButtonClick = useCallback(async () => {
        if (elementRef.current === null) {
          return
        }
        const element= await html2canvas(elementRef.current)
        const link = document.createElement('a');
        link.download = `${TicketInfo?.correlative}${TicketInfo?.plate}.png`;
        link.href = element.toDataURL()
        link.click();
        // toPng(elementRef.current, { cacheBust: true, width:elementRef.current.offsetWidth})
        //   .then((dataUrl) => {
        //     console.log(dataUrl)
        //     // const link = document.createElement('a')
        //     // link.download = 'my-image-name.png'
        //     // link.href = dataUrl
        //     // link.click()
        //   })
        //   .catch((err) => {
        //     console.log(err)
        //   })
    }, [elementRef])

    const printPDF = async () => {
        console.log(`${TicketInfo?.payment_coin}`);
        const blob = await pdf(
            <TicketPDF
                number={`${TicketInfo?.correlative}`}
                entryDate={`${moment(TicketInfo?.date).format('YYYY/MM/DD')}`}
                entryHour={`${moment(TicketInfo?.entry_date).format('HH:mm:ss')}`}
                type={`${TicketInfo?.description}`}
                plate={`${TicketInfo?.plate}`}
                qrImage={base64}
                pric={pric}
                paymentCoin={`${TicketInfo?.payment_coin}`}
            />
        ).toBlob();

        const formData = new FormData();
        formData.append("pdf", blob, "receipt.pdf");

        await fetch(`${import.meta.env.VITE_BASE_URL}upload`, {
            method: "POST",
            body: formData
        });
    };

    useEffect(() => {
        getPrices();
        QR(String(TicketInfo?.correlative));
        printPDF();
    }, []);

    return (
        <>
            <div ref={elementRef} className=" py-5 text-center text-[11px] mx-auto flex justify-center flex-col px-2 my-auto">
                <span className="font-bold">{import.meta.env.VITE_FIRST_HEADER}</span>
                <span className="font-bold">{import.meta.env.VITE_SECOND_HEADER}</span>
                <ul className="flex flex-col text-center text-[10px]">
                    <li><b>Nro: </b>{TicketInfo?.correlative}</li>
                    <li><b>FECHA DE ENTRADA: </b>{moment(TicketInfo?.date).format('YYYY/MM/DD')} <b>HORA: </b>{moment(TicketInfo?.entry_date).format('HH:mm:ss')}</li>
                    <li><b>TIPO: </b>{TicketInfo?.description}</li>
                    <li><b>PLACA: </b>{TicketInfo?.plate}</li>
                </ul>
                <img src={base64} className="mx-auto my-1 w-[200px]"/>
                <span className="font-bold text-[6px]">{import.meta.env.VITE_FIRST_FOOTER}</span>
                <span className="font-bold text-[6px]">{import.meta.env.VITE_SECOND_FOOTER}</span>
            </div>
            <div className="flex">
                {download?
                    <button onClick={onButtonClick} className="rounded-bl-md bg-slate-300  hover:bg-slate-400 px-2 py-1 mx-auto w-full">Descargar Imagen</button>
                    :
                    <>
                    </>
                }
                <button onClick={printPDF} className={`${download?"rounded-br-md":"rounded-b-md"} bg-slate-400 hover:bg-slate-500 text-xl py-2 mx-auto w-full`}>IMPRIMIR</button>
            </div>
        </>
    );
}
export default TicketComponent;
