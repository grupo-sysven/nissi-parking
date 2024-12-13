import { Link } from "react-router-dom";

export default function GoHome() {
    return(
        <Link to="/" className="fixed bottom-2 left-1/2 transform -translate-x-1/2">
            <img src="/public/goback.png" className="w-16"/>
        </Link>
    )
}