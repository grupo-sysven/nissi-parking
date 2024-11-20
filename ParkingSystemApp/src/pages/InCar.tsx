import { useState } from "react";
import GoHome from "./components/GoHome";
import TicketSet from "./components/TicketSet";
import Print from "./components/Print";

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
    <div className="flex flex-col w-2/3 my-auto">
      {ticketData ==null?
        <TicketSet setTicketData={setTicketData}/>
        :
        <Print ticketData={ticketData} setTicketData={setTicketData}/>
      }
      <GoHome />
    </div>
  );
}
