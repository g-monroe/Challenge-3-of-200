import React, { useState } from 'react';
import SickLeaveIndicator from './components/SickLeaveIndicator';

function App() {
  const [daysLeft, setDaysLeft] = useState(3);
  const [totalDays, setTotalDays] = useState(5);

  const handleDaysChange = (newDaysLeft: number) => {
    setDaysLeft(newDaysLeft);
  };

  const handleTotalDaysChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTotal = Math.max(1, parseInt(event.target.value) || 1);
    setTotalDays(newTotal);
    if (daysLeft > newTotal) {
      setDaysLeft(newTotal);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4">
      <div className="bg-white rounded-lg p-4 shadow-md">
        <label className="flex items-center gap-2">
          <span className="text-gray-700">Total Days:</span>
          <input
            type="number"
            min="1"
            value={totalDays}
            onChange={handleTotalDaysChange}
            className="w-20 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>
      <SickLeaveIndicator
        totalDays={totalDays}
        daysLeft={daysLeft}
        completedDays={daysLeft}
        onDaysChange={handleDaysChange}
      />
    </div>
  );
}

export default App;