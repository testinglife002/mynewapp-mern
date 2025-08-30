// /src/components/board/Activity.jsx

import React from 'react';

// A helper function to format the time since an event
const timeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

const Activity = ({ activity }) => {
    const { user, action, details, timestamp } = activity;

    // console.log(activity)

    return (
        <li className="flex items-start space-x-3 py-3">
            <div className="flex-shrink-0">
                {/* A simple placeholder for a user avatar */}
                <span className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
            </div>
            <div className="flex-1">
                <p className="text-sm text-gray-700">
                    <span className="font-semibold">{user?.username  || 'A user'}</span> {action} {details}.
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                    {timeSince(timestamp)}
                </p>
            </div>
        </li>
    );
};

export default Activity;