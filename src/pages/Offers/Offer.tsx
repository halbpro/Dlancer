import { useContext } from "react";
import { AppContext } from "../../App";
import { IOffer } from "../../types/IOffer"
import { OfferCategory } from "../../types/OfferCategory";

interface Props {
    offer: IOffer
}

export const Offer = (props: Props) => {

    const { dlancer, provider, signedInUser } = useContext(AppContext);

    const acceptOffer = async (id: number) => {
        const signer = await provider.getSigner();
        await dlancer?.connect(signer).acceptOffer(id, { gasLimit: 30000000 });
    }

    const cancelOffer = async (id: number) => {
        const signer = await provider.getSigner();
        dlancer?.connect(signer).cancelOffer(id, { gasLimit: 30000000 });
    }

    return (
        <div className="offer">
            <h1>{props.offer.title}</h1>
            <p>{props.offer.description}</p>
            <p style={{fontWeight: "bold"}}>{OfferCategory[props.offer.category] }</p>
            <p>{props.offer.client}</p>
            {props.offer.inExecution && <p>in execution </p>}
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