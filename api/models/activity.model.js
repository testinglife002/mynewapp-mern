// /models/activity.model.js
import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    action: {
        type: String,
        required: true, // e.g., "created", "moved", "commented on"
    },
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
    },
    entity: {
        type: String, // "card", "list"
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    details: {
        type: String, // e.g., "Card Title", "from List A to List B"
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const Activity = mongoose.model('Activity', activitySchema);
 export default Activity;