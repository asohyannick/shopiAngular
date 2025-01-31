import { Document} from "mongoose";
export interface IAboutMeType extends Document {
  fullName: string;
  title: string;
  summary: string;
  skills: string[];
  experience:{
    company: string;
    position: string;
    startDate: Date;
    endDate: Date | null;
    description: string;
  }[];
  education:{
    institution: string;
    degree: string;
    startDate: Date;
    endDate: Date;
  }[];
  projects:{
    title: string;
    description: string;
    link: string;
  }[];
 contactInfo: {
    email: string;
    phone: string;
    linkedIn?: string;
 };
}
