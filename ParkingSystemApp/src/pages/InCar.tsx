import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PDFViewer } from "@react-pdf/renderer";
import PDF from "./components/Pdf";

interface Types {
  code: string;
  description: string;
}
interface PDFData {
  correlative:number;
  date: string;
  description:string;
  entry_date: string;
  plate:string;
}

export default function InCar() {
  const [types, setTypes] = useState<Types[]>([]);

  const [plate, setPlate] = useState("");
  const [type, setType] = useState("");

  const [status, setStatus] = useState(0);

  const [pdfData,setPdfData]=useState<PDFData[]>([])

  const [dowloadState, setDownloadState]=useState(false)



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
        setStatus(2);
      } else if (data !== 0) {
        const tick = await fetch(`${import.meta.env.VITE_BASE_URL}setTicket/${data["correlative"]}`, {
          method: "POST",
        });
        const ticketData= await tick.json()
        console.log(ticketData)
        setPdfData(ticketData)
        setPlate("");
        setStatus(1);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getTypes();
  }, []);
  return (
    <form
      className={`text-center flex flex-col w-2/3 my-auto ${status==1? "bg-transparent":"bg-white border rounded-lg shadow-lg"}`}
      onSubmit={setCar}
    >
      <img src="./logo-nissi.png" className={`w-1/2 mx-auto mt-10 ${status==1?"hidden":""}`} />
      <label htmlFor="plate" className={`pt-6 text-xl ${status==1?"hidden":""}`}>
        <b>PLACA DEL VEHICULO</b>
      </label>
      <input
        type="text"
        id="plate"
        className={`w-4/5 mx-auto mt-3 border-2 border-b-gray-800 rounded-md hover:shadow-lg hover:bg-slate-300 hover:border-slate-300 hover:border-b-gray-800 bg-slate-200 ${status==1?"hidden":""}`}
        autoComplete="off"
        onChange={(e) => {
          setPlate(e.target.value);
        }}
        value={plate}
      />
      <div className={`flex justify-evenly mt-5 ${status==1?"hidden":""}`}>
        {types.map((t) => (

          <button key={t.code} type="submit" onClick={()=>{setType(t.code)}}>
            {t.code=='01'?
            (<img src="./car.png" className="w-16"/>):
            (<img src="./moto.png" className="w-16"/>)
            }
          </button>
        ))}
      </div>
      {status == 1 ? (
        <div className="flex flex-col bg-white border rounded-lg shadow-lg mx-auto w-3/4">
          <span className="text-green-600 animate-bounce mx-auto mt-5">
            Registrado Correctamente
          </span>
          <PDFViewer className="my-5 w-3/4 mx-auto">
          <PDF 
            correlative={pdfData[0]["correlative"]}
            date={pdfData[0]["date"]} 
            description={pdfData[0]["description"]} 
            entry_date={pdfData[0]["entry_date"]} 
            plate={pdfData[0]["plate"]} 
          />
        </PDFViewer>
        <div className="flex justify-evenly mb-5">
          <PDFDownloadLink
          className="bg-green-200 hover:bg-green-300 rounded-md shadow-md px-5 py-2 my-auto w-[50%]"
          onClick={()=>{
            setDownloadState(true)
          }}
          document={
            <PDF 
              correlative={pdfData[0]["correlative"]}
              date={pdfData[0]["date"]} 
              description={pdfData[0]["description"]} 
              entry_date={pdfData[0]["entry_date"]} 
              plate={pdfData[0]["plate"]} 
            />} 
            fileName={`${pdfData[0]["plate"]}.pdf`}
            >
              IMPRIMIR
          </PDFDownloadLink>
          <button onClick={()=>{
            setStatus(0)
            setDownloadState(false)
          }}  
          className={`bg-red-200 hover:bg-red-300 rounded-md shadow-md px-5 py-2 my-auto w-[50%] ${dowloadState==false?"hidden":""}`}>SALIR</button>
        </div>
        </div>

      ) : status == 2 ? (
        <span className="text-red-500 mt-6 animate-bounce">
          Debe Ingresar la placa
        </span>
      ) : (
        <span className="text-white mt-6">.</span>
      )}
    </form>
  );
}
