import { useContext } from "react";
import { AppContext } from "../../App";
import { IJob } from "../../types/IJob";
import { JobStatus } from "../../types/JobStatus";

interface Props {
    job: IJob
}

export const Job = (props:Props) => {
    const {dlancer, provider} = useContext(AppContext);

    const cancelJob =async (id:number) => {
        try {
            const signer = await provider.getSigner();
            dlancer?.connect(signer).jobFailed(id, { gasLimit: 30000000 });
            console.log("Successfully canceled offer");
        }
        catch(e) {
            console.log("failed to cancel offer", e);
        }
    }

    const jobCompleted =async (id:number) => {
        try {
            const signer = await provider.getSigner();
            dlancer?.connect(signer).jobCompleted(id, { gasLimit: 30000000 });
            console.log("Successfully canceled offer");
        }
        catch(e) {
            console.log("failed to cancel offer", e);
        }
    }

    return (<div>
        
        <p>{props.job.offer.title}</p>
        <p>{props.job.workerAddress}</p>
        {
            props.job.status != JobStatus.failed &&
            <>
                <button onClick={() => cancelJob(props.job.id)}>Cancel job</button>
                <button onClick={() => jobCompleted(props.job.id)}>Complete job</button>
            </>
        }
    </div>);
}
