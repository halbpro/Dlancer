import { useState, useContext, useEffect } from "react";
import { AppContext } from "../../App";
import { IJob } from "../../types/IJob";
import { Job } from "./Job";

export const Profile = () => {
    const {dlancer, provider, signedInUser }= useContext(AppContext);
    const [jobs, setJobs] =  useState<IJob[]|null>(null);
    
    const loadJobs = async() => {
        const jobs = await dlancer?.getJobs();
        const updatedJobs =  await Promise.all(jobs.map(async(job:IJob, index:number) => {
            const offer = await dlancer.offers(job.offerId);
            return {...job, offer: offer, id: index + 1 }
        }));
        setJobs(updatedJobs);
        console.log(updatedJobs);
    }

    useEffect(() => {
        loadJobs();
    }, [])

    return <div>
                <div className="jobs">
                    {
                        jobs?.map((job, index) => (
                            <Job job={job} key={index} />
                        ))
                    }
                </div>
            </div>;
    
}