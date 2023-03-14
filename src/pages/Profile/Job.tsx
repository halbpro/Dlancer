import { useContext } from "react";
import { AppContext } from "../../App";
import { equalIgnoreCase } from "../../Helpers";
import { IJob } from "../../types/IJob";
import { JobStatus } from "../../types/JobStatus";

interface Props {
    job: IJob,
    title: string
}

export const Job = (props: Props) => {
    const { dlancer, provider, signedInUser } = useContext(AppContext);

    const cancelJob = async (id: number) => {
        const signer = await provider.getSigner();
        dlancer?.connect(signer).jobFailed(id, { gasLimit: 30000000 });
    }

    const jobCompleted = async (id: number) => {
        const signer = await provider.getSigner();
        dlancer?.connect(signer).jobCompleted(id, { gasLimit: 30000000 });
    }

    const confirmDone = async (id: number) => {
        const signer = await provider.getSigner();
        dlancer?.connect(signer).confirmJobCompleted(id, { gasLimit: 30000000 });
    }

    return (<div style={{backgroundColor: (props.job.status == JobStatus.failed) ? "red": ""}}>

        <p>{props.job.offer.title}</p>
        <p>{props.job.workerAddress}</p>
        {props.job.status == JobStatus.failed &&
        <p>{equalIgnoreCase(props.job.workerAddress, signedInUser) ? "You have failed this job" : "Worker has canceled this job"}</p>}
        {
            props.job.status == JobStatus.accepted &&
            <>
                <button onClick={() => cancelJob(props.job.id)}>Cancel job</button>
                <button onClick={() => jobCompleted(props.job.id)}>Complete job</button>
            </>
        }
        {
            props.job.status == JobStatus.done &&
            <>
                <button onClick={() => confirmDone(props.job.id)}>Confirm job</button>
            </>
        }
        <hr />
    </div>);
}
