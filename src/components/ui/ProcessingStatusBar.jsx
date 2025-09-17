import React from 'react';
import Icon from '../AppIcon';

const ProcessingStatusBar = ({ 
  isVisible = false, 
  progress = 0, 
  message = 'Processing emails...', 
  estimatedTime = null,
  processedCount = 0,
  totalCount = 0,
  onCancel = null 
}) => {
  if (!isVisible) return null;

  const progressPercentage = Math.min(Math.max(progress, 0), 100);
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-card border-b border-border shadow-subtle animate-fade-in">
      <div className="px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Animated Progress Ring */}
            <div className="relative w-10 h-10">
              <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-muted"
                />
                <circle
                  cx="18"
                  cy="18"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="text-primary transition-progress"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-foreground">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
            </div>

            {/* Status Information */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <Icon name="Mail" size={16} className="text-primary" />
                <span className="font-medium text-foreground">{message}</span>
              </div>
              
              <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                {totalCount > 0 && (
                  <span>
                    {processedCount?.toLocaleString()} of {totalCount?.toLocaleString()} emails
                  </span>
                )}
                
                {estimatedTime && (
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={14} />
                    <span>{estimatedTime} remaining</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cancel Button */}
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-smooth rounded-md hover:bg-muted"
            >
              <Icon name="X" size={14} />
              <span className="hidden sm:inline">Cancel</span>
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-muted rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-primary to-accent h-1.5 rounded-full transition-progress"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatusBar;