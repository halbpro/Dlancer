import { useContext } from "react";
import { AppContext } from "../../App";
import { IOffer } from "../../types/IOffer"

interface Props {
    offer: IOffer
}

export const Offer = (props:Props) => {

    const {dlancer,provider, signedInUser }= useContext(AppContext);
    
    const acceptOffer = async (id: number) => {
        try {
            const signer = await provider.getSigner();
            await dlancer?.connect(signer).acceptOffer(id, { gasLimit: 30000000 });
            console.log("Successfully accepted offer");
        }
        catch(e) {
            console.log("failed to accept offer", e);
        }
    }

    const cancelOffer = async(id: number) =>{        
      
        try {
            const signer = await provider.getSigner();
            dlancer?.connect(signer).cancelOffer(id, { gasLimit: 30000000 });
            console.log("Successfully canceled offer");
        }
        catch(e) {
            console.log("failed to cancel offer", e);
        }
    }

    return (    
        <div className="offer">
            <h1>{props.offer.title}</h1>
            <p>{props.offer.description}</p>
            <p>{props.offer.id}</p>
            <p>{props.offer.client}</p>
            <p>exe {props.offer.inExecution}</p>
            {
                props.offer.valid && !props.offer.inExecution && 
                    <button onClick={() => acceptOffer(props.offer.id)}>Accept offer</button>
            }
            {
                    
                !props.offer.inExecution && 
                    <button onClick={() => cancelOffer(props.offer.id)}>Cancel offer</button>
            }
        </div>
    );
}