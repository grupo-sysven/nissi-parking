import { Link } from "react-router-dom";

export default function GoHome() {
    //left-1/2 transform -translate-x-1/2
    return(
        <Link to="/" className="fixed bottom-2 left-5 hover:text-orange-600 text-[#060062]">
            {/* <img src="/goback.png" className="w-16"/> */}
            <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" fill="currentColor" className="bi bi-arrow-left-square-fill" viewBox="0 0 16 16">
                <path d="M16 14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2zm-4.5-6.5H5.707l2.147-2.146a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708-.708L5.707 8.5H11.5a.5.5 0 0 0 0-1"/>
            </svg>
        </Link>
    )
}