import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProcessingModal = ({ 
  isVisible, 
  progress = 0, 
  processedCount = 0, 
  totalCount = 0, 
  estimatedTime = null,
  onCancel = null 
}) => {
  if (!isVisible) return null;

  const progressPercentage = Math.min(Math.max(progress, 0), 100);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg shadow-floating p-8 max-w-md w-full mx-4">
        <div className="text-center space-y-6">
          {/* Progress Ring */}
          <div className="relative mx-auto w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-muted"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="text-primary transition-progress"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-semibold text-foreground">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>

          {/* Status Information */}
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Icon name="Mail" size={20} className="text-primary" />
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Verifying Emails
              </h3>
            </div>
            
            <p className="text-muted-foreground">
              Processing your email verification request...
            </p>
          </div>

          {/* Progress Details */}
          <div className="space-y-3">
            {totalCount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress:</span>
                <span className="font-medium text-foreground">
                  {processedCount?.toLocaleString()} of {totalCount?.toLocaleString()} emails
                </span>
              </div>
            )}

            {estimatedTime && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Estimated time:</span>
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={14} className="text-primary" />
                  <span className="font-medium text-foreground">{estimatedTime}</span>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-progress"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Status Messages */}
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>Connecting to verification service...</span>
            </div>
            
            {progressPercentage > 10 && (
              <div className="flex items-center justify-center space-x-2 text-sm text-success">
                <Icon name="CheckCircle" size={14} />
                <span>Email validation in progress</span>
              </div>
            )}
          </div>

          {/* Cancel Button */}
          {onCancel && (
            <div className="pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={onCancel}
                iconName="X"
                iconPosition="left"
                iconSize={16}
                fullWidth
              >
                Cancel Verification
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessingModal;