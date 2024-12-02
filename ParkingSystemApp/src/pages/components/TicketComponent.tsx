import { useCallback, useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import moment from "moment";
import QRCode  from "qrcode";

interface TicketData { 
    correlative: number; 
    date: string; 
    description: string; 
    entry_date: string; 
    plate: string
}

interface ChildComponentProps{
    TicketInfo: TicketData | null;
}

const TicketComponent:React.FC<ChildComponentProps>=({TicketInfo}) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const [base64,setBase64]=useState("")

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

      useEffect(()=>{
        QR(String(TicketInfo?.correlative))
      },[])
    return (
        <>
            <div ref={elementRef} className=" py-5 text-center text-[11px] mx-auto flex justify-center flex-col px-2">
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
            <button onClick={onButtonClick} className="bg-slate-300 rounded-md hover:bg-slate-400 px-2 py-1 mx-auto mb-3">Descargar Imagen</button>
        </>
    );
}
export default TicketComponent;
