import { Link } from "react-router-dom";

export default function GoHome() {
    //left-1/2 transform -translate-x-1/2
    return(
        <Link to="/" className="fixed bottom-2 left-2">
            <img src="/goback.png" className="w-16"/>
        </Link>
    )
}