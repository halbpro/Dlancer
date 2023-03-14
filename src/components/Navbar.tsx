import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../App";

export const Navbar = () => {

    const {_,__, signedInUser }= useContext(AppContext);

    return (<div>  
        <p>Logged user: {signedInUser}</p>
        <Link to="/">Home</Link>        
        <Link to="/offers">Offers</Link>
        <Link to="/profile">Profile</Link>
        <hr />
    </div>);
}