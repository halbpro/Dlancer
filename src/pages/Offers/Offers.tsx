import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import { IOffer } from "../../types/IOffer";
import { Offer } from "./Offer";

export const Offers = () => {
    const {dlancer }= useContext(AppContext);
    const [offers, setOffers] =  useState<IOffer[]|null>(null);
    
    const loadOffers = async() => {
        const offers = await dlancer?.getOffers();
        setOffers(offers);
    }

    useEffect(() => {
        loadOffers();
    }, [])
    
    return (<div>
        {
            offers?.map((offer, index) =>(
                <Offer offer={{...offer, id: index + 1}} key={index}/>
            ))
        }
    </div>);
}