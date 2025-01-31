import { Document } from "mongoose";

/**
 * Enum for suggestion statuses.
 */
export enum ISuggestionStatus {
    PENDING = 'pending',      // Pending status
    REVIEWED = 'reviewed',    // Reviewed status
    IMPLEMENTED = 'implemented', // Implemented status
}

/**
 * Interface representing a suggestion document.
 */
export interface ISuggestionType extends Document {
    name: string;             // The name of the person making the suggestion
    email: string;            // The email of the person making the suggestion
    date: Date;               // The date the suggestion was made
    status: ISuggestionStatus; // The current status of the suggestion
    suggestion: string;       // The content of the suggestion
}
