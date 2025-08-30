// /src/components/board/ActivityFeed.jsx
import React from 'react';
import Activity from './Activity';

const ActivityFeed = ({ activities, isOpen, onClose }) => {
    if (!isOpen) {
        return null;
    }

    // console.log(activities);

    // Sort activities to show the most recent ones first
    const sortedActivities = [...activities].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return (
        <>
            {/* Background Overlay */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            ></div>
            
            {/* Sidebar Panel */}
            <aside className={`fixed top-0 right-0 h-full w-80 bg-gray-50 shadow-xl z-30 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Activity</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl" aria-label="Close activity feed">
                        &times;
                    </button>
                </div>
                <ul className="p-4 divide-y divide-gray-200 overflow-y-auto h-[calc(100%-60px)]">
                    {sortedActivities.length > 0 ? (
                        sortedActivities.map(activity => (
                            <Activity key={activity._id} activity={activity} />
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-4">No activity has been recorded yet.</p>
                    )}
                </ul>
            </aside>
        </>
    );
};

export default ActivityFeed;

