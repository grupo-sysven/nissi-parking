import { useState } from "react";
import GoHome from "./components/GoHome";
import TicketSet from "./components/TicketSet";
import Print from "./components/Print";
import GoInfo from "./components/GoInfo";

interface ticketData {
  correlative: number;
  date: string;
  description: string;
  entry_date: string;
  plate: string;
}

export default function InCar() {
  const [ticketData, setTicketData] = useState<ticketData | null>(null);
  return (
    <div className="flex flex-col w-full mx-10 my-auto">
      {ticketData ==null?
        <TicketSet setTicketData={setTicketData}/>
        :
        <Print ticketData={ticketData} setTicketData={setTicketData}/>
      }
      <GoHome place="/"/>
      <GoInfo />
    </div>
  );
}
