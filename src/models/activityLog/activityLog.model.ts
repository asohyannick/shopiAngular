import mongoose, { Schema } from "mongoose";
import { ActivityLogTypes } from "../../types/activityType/activityLogType";
const activityLogSchema: Schema = new Schema<ActivityLogTypes>({
 userId:{
    type:Schema.Types.ObjectId,
    ref: 'Auth',
    required: true,
 },
 action:{
    type: String,
    required: true,
 },
 details:{
    type: String,
    required: false,
 },
}, {timestamps: true});

const ActivityLog = mongoose.model<ActivityLogTypes>('ActivityLog', activityLogSchema);
export default ActivityLog;
