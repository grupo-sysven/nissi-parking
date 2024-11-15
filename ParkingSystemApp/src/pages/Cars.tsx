import { useEffect, useState } from "react";

import Car from './components/Car'

interface CarObj {
  correlative: number;
  plate: string;
  description:string;
}

export default function Cars() {
  const [cars, setCars] = useState<CarObj[]>([]);

  const fetchCars = async () => {
    try {
      const response = await fetch("http://localhost:3000/getCars");
      const data = await response.json();
      setCars(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchCars()
  }, []);
  return (
    <div className="flex flex-wrap mx-10">
      {cars.map((c)=>(
        <div className="mx-auto" key={c.correlative}>
          <Car plate={c.plate} description={c.description}/>
        </div>
      ))}
    </div>
  );
}
