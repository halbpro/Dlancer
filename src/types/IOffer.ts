import { OfferCategory } from "./OfferCategory";

export interface IOffer {   
    id: number; 
    title: string;
    description: string ;
    budget: number;
    category: OfferCategory;
    expirationTime: number;
    client: string;
    valid: boolean;
    inExecution: boolean;
    jobId: number;
};
