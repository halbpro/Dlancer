import { useState, useContext, useEffect } from "react";
import { AppContext } from "../../App";
import { equalIgnoreCase } from "../../Helpers";
import { IJob } from "../../types/IJob";
import { JobStatus } from "../../types/JobStatus";
import { Job } from "./Job";

export const Profile = () => {
    const { dlancer, provider, signedInUser } = useContext(AppContext);
    const [jobs, setJobs] = useState<IJob[] | null>(null);

    const loadJobs = async () => {
        const jobs = await dlancer?.getJobs();
        const updatedJobs = await Promise.all(jobs?.map(async (job: IJob, index: number) => {
            const offer = await dlancer.offers(job.offerId);
            return { ...job, offer: offer, id: index + 1 }
        }));
        setJobs(updatedJobs);
        console.log(updatedJobs);
    }

    useEffect(() => {
        loadJobs();
    }, [])

    return <div>
        <div className="jobs">
            {/* maybe make a component if divs stay the same? */}
            <div>
                <h2>My jobs</h2>
                {
                    jobs?.
                        filter(x => equalIgnoreCase(x.workerAddress, signedInUser))
                        .map((job, index) => (
                            <Job job={job} title={"My jobs"} key={index} />
                        ))
                }
            </div>
            <div>
                <h2>My offers to confirm</h2>
                {
                    jobs?.
                        filter(x => equalIgnoreCase(x.offer.client, signedInUser))
                        .map((job, index) => (
                            <Job job={job} title={"My offers to confirm"} key={index} />
                        ))
                }
            </div>
        </div>
    </div>;
}
