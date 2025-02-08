import { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { FaCarSide } from "react-icons/fa6";
import { FaMotorcycle } from "react-icons/fa";

interface PriceItem {
    pricebs:number;
    pricedls:number;
    pricepsos:number;
    type:string;
    setApearModal:React.Dispatch<React.SetStateAction<boolean>>;
}

const Price: React.FC<PriceItem> = ({
pricebs,
pricedls,
pricepsos,
type,
setApearModal,
})=>{
    const [pricbs, setPricBs]= useState(pricebs)
    const [pricdls, setPricDls]= useState(pricedls)
    const [pricpsos, setPricPsos]= useState(pricepsos)
    //const [con, setCon]=useState()

    const [disable, setDisable]= useState(true)

    useEffect(()=>{
        async function UpdatePrice() {
            if(disable==true){
                //CAMBIA EL PRECIO DE LOS BS CUANDO SE MODIFICA
                if(pricbs!=pricebs){
                    const data= await fetch(`${import.meta.env.VITE_BASE_URL}updatePrice`,{
                        method: "POST",
                        headers: {
                        "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ pricbs, type, "con":"01"}),
                    })
                    const dataa= await data.json() 
                    if (dataa["ok"]==false){
                        setPricBs(pricebs)
                    }else{
                        setApearModal(true)
                    }
                } 
                //CAMBIA EL PRECIO DE LOS DLS CUANDO SE MODIFICA
                if(pricdls!=pricedls){
                    const data= await fetch(`${import.meta.env.VITE_BASE_URL}updatePrice`,{
                        method: "POST",
                        headers: {
                        "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ pricdls, type, "con":"02"}),
                    })
                    const dataa= await data.json() 
                    if (dataa["ok"]==false){
                        setPricDls(pricedls)
                    }else{
                        setApearModal(true)
                    }
                }
                //CAMBIA EL PRECIO DE LOS PESOS CUANDO SE MODIFICA
                if(pricpsos!=pricepsos){
                    const data= await fetch(`${import.meta.env.VITE_BASE_URL}updatePrice`,{
                        method: "POST",
                        headers: {
                        "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ pricpsos, type, "con":"03"}),
                    })
                    const dataa= await data.json() 
                    if (dataa["ok"]==false){
                        setPricPsos(pricepsos)
                    }else{
                        setApearModal(true)
                    }
                }
            }
        }
        UpdatePrice()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[disable])

    return(
        <tr className="hover:bg-slate-200" key={type}>
              <th className="bg-blue-300 border-b border-separate ">
                <div className="p-2">
                    {type=='01'? <FaCarSide size={30} /> : <FaMotorcycle size={30} />}
                </div>
              </th>
              <th className="border-b">
                <input 
                    type="number" 
                    value={pricdls} 
                    disabled={disable}
                    onChange={(e)=>typeof(Number(e.target.value))=="number"? setPricDls(Number(e.target.value)):setPricDls(pricedls)}
                    className="text-right focus:bg-gray-200 border border-transparent rounded focus:outline-none focus:border focus:border-b-black w-20"
                />
                </th>
              <th className="border-b">
                <input 
                    type="number" 
                    value={pricbs} 
                    disabled={disable}
                    onChange={(e)=>typeof(Number(e.target.value))=="number"? setPricBs(Number(e.target.value)):setPricBs(pricebs)}
                    className="text-right focus:bg-gray-200 border border-transparent rounded focus:outline-none focus:border focus:border-b-black w-20"
                />
                </th>
              <th className="border-b">
                <input 
                    type="number" 
                    value={pricpsos} 
                    disabled={disable}
                    onChange={(e)=>typeof(Number(e.target.value))=="number"? setPricPsos(Number(e.target.value)):setPricPsos(pricepsos)}
                    className="text-right focus:bg-gray-200 border border-transparent rounded focus:outline-none focus:border focus:border-b-black w-20"
                />
                </th>
              <th className="border-b">
                <button className="p-2" onClick={()=>{
                    setDisable(!disable)
                    }}>
                    <MdEdit size={30} />
                </button>
              </th>
        </tr>
    )
}
export default Price;