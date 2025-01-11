import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import './SickLeaveIndicator.css';

interface SickLeaveIndicatorProps {
  totalDays: number;
  daysLeft: number;
  completedDays: number;
  onDaysChange?: (newDaysLeft: number) => void;
}

const SickLeaveIndicator: React.FC<SickLeaveIndicatorProps> = ({
  totalDays,
  daysLeft,
  completedDays,
  onDaysChange,
}) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [animatedSteps, setAnimatedSteps] = useState<number[]>([]);

  useEffect(() => {
    setCurrentProgress(0);
    setAnimatedSteps([]);

    const progressTimer = setTimeout(() => {
      setCurrentProgress((completedDays / totalDays) * 100);
    }, 100);

    const stepTimers = Array.from({ length: completedDays }, (_, index) => {
      return setTimeout(() => {
        setAnimatedSteps(prev => [...prev, index]);
      }, 600 + (index * 200));
    });

    return () => {
      clearTimeout(progressTimer);
      stepTimers.forEach(timer => clearTimeout(timer));
    };
  }, [completedDays, totalDays]);

  const generateStepPositions = () => {
    const width = 280;
    const height = 140;
    const strokeWidth = 32;
    const radius = (width / 2) - (strokeWidth / 2);
    const centerX = width / 2;
    const centerY = height;

    return Array.from({ length: totalDays }, (_, index) => {
      const angle = Math.PI - ((index) / (totalDays - 1)) * Math.PI;
      
      const pointX = centerX + (radius * Math.cos(angle));
      const pointY = centerY - (radius * Math.sin(angle));
      
      const adjustX = index === 2 ? 2 : 0;
      const adjustY = index === 2 ? 14 : 12;
      
      return {
        transform: `translate(${pointX - centerX + adjustX}px, ${pointY - centerY + adjustY}px)`,
        completed: index < daysLeft,
        number: index + 1,
      };
    });
  };

  const describeArc = (percentage: number) => {
    const width = 280;
    const height = 140;
    const strokeWidth = 32;
    const radius = (width / 2) - (strokeWidth / 2);
    const centerX = width / 2;
    const centerY = height;
    
    const startX = centerX - radius;
    const startY = centerY;
    
    const progressAngle = Math.PI - ((percentage / 100) * Math.PI);
    const endX = centerX + (radius * Math.cos(progressAngle));
    const endY = centerY - (radius * Math.sin(progressAngle));
    
    return `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;
  };

  const calculateArcLength = () => {
    const width = 280;
    const strokeWidth = 32;
    const radius = (width / 2) - (strokeWidth / 2);
    return Math.PI * radius; // Length of the semicircle
  };

  const getColorGradient = (daysLeft: number, totalDays: number) => {
    const ratio = daysLeft / totalDays;
    
    if (ratio <= 1/3) {
      return 'bg-gradient-radial-animated-red';
    } else if (ratio <= 0.75) {
      return 'bg-gradient-radial-animated-yellow';
    } else {
      return 'bg-gradient-radial-animated-green';
    }
  };

  const steps = generateStepPositions();
  const progressPercentage = currentProgress;
  const arcLength = calculateArcLength();

  const handleStepClick = (stepIndex: number) => {
    if (!onDaysChange) return;
    
    // Clicking any step directly sets the days left
    onDaysChange(stepIndex);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-[320px]">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Sick leave</h2>
          <p className="text-gray-400 text-sm">Shows the number of sick leave days prescribed by the doctor.</p>
        </div>
        <button className="text-gray-400">
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
            />
          </svg>
        </button>
      </div>

      <div className="relative h-[140px] w-full flex justify-center">
        <div className="absolute w-[280px] h-[140px] overflow-hidden">
          <div className="absolute bottom-0 w-full h-full rounded-t-full border-[32px] border-gray-100 border-b-0" />
        </div>
        <svg
          className="absolute bottom-0"
          width="280"
          height="140"
          viewBox="0 0 280 140"
        >
          <defs>
            <linearGradient id="progressGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="280" y2="0">
              <stop offset="0%" stopColor="#0346aa" />
              <stop offset="100%" stopColor="#93C5FD" />
            </linearGradient>
          </defs>
          <g filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))">
            <path
              d={describeArc(100)}
              stroke="url(#progressGradient)"
              strokeWidth="32"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={arcLength}
              strokeDashoffset={arcLength * (1 - progressPercentage / 100)}
              style={{ 
                transition: 'stroke-dashoffset 1s ease-in-out',
              }}
            />
          </g>
        </svg>
        {steps.map((step, index) => (
          <div
            key={index}
            className="absolute bottom-0 left-1/2"
            style={{
              ...step,
              marginLeft: '-14px',
            }}
            onClick={() => handleStepClick(index + 1)}
            role="button"
            tabIndex={0}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center bg-white 
                ${animatedSteps.includes(index) ? 'text-blue-500 ring-1 ring-blue-200' : 'text-gray-400'}
                shadow-[0_2px_4px_rgba(0,0,0,0.1)]
                transition-all duration-300 perspective-[1000px]
                ${animatedSteps.includes(index) ? 'rotate-y-180' : ''}
                cursor-pointer hover:ring-2 hover:ring-blue-300`}
            >
              <div className={`absolute w-full h-full flex items-center justify-center transition-opacity duration-300
                ${animatedSteps.includes(index) ? 'opacity-0' : 'opacity-100'}`}>
                {step.number}
              </div>
              <div className={`absolute w-full h-full flex items-center justify-center transition-opacity duration-300 rotate-y-180
                ${animatedSteps.includes(index) ? 'opacity-100' : 'opacity-0'}`}>
                <Check className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-center">
          <div className="text-gray-500 text-sm mb-1">Sick days left</div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-semibold shadow-lg m-auto ${getColorGradient(totalDays - daysLeft, totalDays)}`}>
            {totalDays - daysLeft}
          </div>
        </div>
      </div>
      <div className="w-[280px] flex justify-between mt-8 px-2">
        <span className="text-gray-400">Start</span>
        <span className="text-gray-400">Finish</span>
      </div>
    </div>
  );
};

export default SickLeaveIndicator; 