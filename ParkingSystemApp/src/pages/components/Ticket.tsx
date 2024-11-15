interface TicketProps {
  correlative: number;
  date: string;
  entry_date: string;
  plate: string;
  description: string;
}

const Ticket: React.FC<TicketProps> = ({
  correlative,
  date,
  entry_date,
  plate,
  description,
  st,
  setSt,
}) => {
    const handleUpdate = async () => {
        try {
            await fetch(`http://localhost:3000/updateTicket/${correlative}`,{
                method: "POST"
            })
            setSt(!st)
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div
      className="flex flex-col bg-red-200 p-4 text-center rounded-lg shadow-md mx-1"
      key={correlative}
    >
      <div className="flex justify-between text-sm">
        <b className="mr-5">FECHA: </b>{" "}
        <span className="text-blue-700">{date}</span>
      </div>
      <div className="flex justify-between text-sm">
        <b className="mr-5">ENTRADA: </b>
        <span className="text-green-600">{entry_date}</span>
      </div>
      <div className="flex justify-between text-sm">
        <b className="mr-5">PLACA: </b>
        <span>{plate}</span>
      </div>
      <div className="flex justify-between text-sm">
        <b className="mr-5">TIPO: </b>
        <span className="text-orange-600">{description}</span>
      </div>
      <button 
        onClick={()=>{handleUpdate()}}
        className="bg-red-400 py-1 px-2 mt-5 hover:bg-red-500 rounded-sm">
        SALIDA
      </button>
    </div>
  );
};
export default Ticket;
