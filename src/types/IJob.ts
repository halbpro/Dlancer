import { IOffer } from "./IOffer";
import { JobStatus } from "./JobStatus";

export interface IJob {
    id: number;
    offer: IOffer;
    offerId: number;
    status:JobStatus;
    workerAddress: string;
}