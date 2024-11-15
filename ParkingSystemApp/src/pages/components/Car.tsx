interface CarItem {
    plate: string;
    description:string;
}

const Car : React.FC<CarItem> = ({
    plate,
    description
}) =>{
    return(
        <div className="flex flex-col mx-2 mb-1 p-3 bg-green-200 shadow-md border rounded-md w-36 text-center">
            <span className="text-xs text-wrap flex flex-col text-center mx-auto"><span>PLACA:</span><b>{plate}</b></span>
            <span className="text-xs text-wrap text-orange-950">{description}</span>
        </div>
    )
}

export default Car;