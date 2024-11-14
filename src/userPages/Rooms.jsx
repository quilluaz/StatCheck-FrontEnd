import React, { useState, useEffect } from 'react';

function Schedule() {
  return (
    <div className="p-8">
      <div className="bg-red-500 text-white text-4xl p-4 text-center">
        {/* Placeholder for the current day */}
        { /* Current Day Placeholder */ }
        Day Placeholder
      </div>
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="col-span-2">
          {/* Placeholder for cells */}
          { /* Cell 1 Placeholder */ }
          <div className="p-4 rounded-lg bg-yellow-300 mb-4">
            <div className="text-lg font-semibold">Reserved Time Slot</div>
          </div>

          { /* Cell 2 Placeholder */ }
          <div className="p-4 rounded-lg bg-green-300 mb-4">
            <div className="text-lg font-semibold">Vacant Time Slot</div>
          </div>

          { /* Cell 3 Placeholder */ }
          <div className="p-4 rounded-lg bg-yellow-300 mb-4">
            <div className="text-lg font-semibold">Reserved Time Slot</div>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Status:</h3>
            {/* Placeholder for status */}
            <p>In-Use</p> {/* Placeholder for dynamic status */}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Capacity:</h3>
            {/* Placeholder for capacity */}
            <p>50%</p> {/* Placeholder for dynamic capacity */}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Next Availability:</h3>
            {/* Placeholder for next availability */}
            <p>2:00 PM - 3:00 PM</p> {/* Placeholder for dynamic availability */}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Current Class:</h3>
            {/* Placeholder for current class */}
            <p>Math 101</p> {/* Placeholder for dynamic class */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Schedule;
