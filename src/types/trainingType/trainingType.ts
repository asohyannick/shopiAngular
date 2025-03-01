import { Document } from "mongoose";
export interface ITrainingType extends Document {
name: string;
description: string;
country: string;
salary: number;
rating: number;
admirable: boolean;
hireable: boolean;
imageURLs: string[];
position: string;
future: string;
certificate: string;
date:Date;
expiration: boolean;
}
