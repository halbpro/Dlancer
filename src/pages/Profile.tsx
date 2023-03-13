import { useState } from "react";

export const Profile = (props: any) => {
    const [owner, setOwner] = useState<string>("");

    const loadOwner =async () => {
        const owner = await props.dlancerContract?.owner();  
        setOwner(owner);
    }
    loadOwner();
    return <div>Profile {owner}</div>;
}