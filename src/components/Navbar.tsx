import { Link } from "react-router-dom";

export const Navbar = () => {
    return (<div>        
        <Link to="/">Home</Link>        
        <Link to="/offers">Offers</Link>
        <Link to="/profile">Profile</Link>
    </div>);
}