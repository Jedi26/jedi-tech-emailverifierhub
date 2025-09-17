import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ 
  selectedCount = 0,
  totalResults = 0,
  onExportSelected = () => {},
  onExportAll = () => {},
  onExportValid = () => {},
  onExportInvalid = () => {},
  exportInProgress = false,
  className = ''
}) => {
  const navigate = useNavigate();

  const handleNewVerification = () => navigate('/email-verification-hub');

  return (
    <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-md p-4 space-y-4 ${className}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Zap" size={20} className="text-green-300" />
          <h3 className="font-heading font-semibold text-white">Quick Actions</h3>
        </div>
        {exportInProgress && (
          <div className="flex items-center space-x-2 text-sm text-green-300">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Export in progress...</span>
          </div>
        )}
      </div>

      {/* Primary Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          variant="default"
          onClick={handleNewVerification}
          iconName="Plus"
          iconPosition="left"
          iconSize={16}
          fullWidth
          className="whitespace-normal text-center"
        >
          New Verification
        </Button>
        
        <Button
          variant="outline"
          onClick={onExportAll}
          disabled={totalResults === 0 || exportInProgress}
          loading={exportInProgress}
          iconName="Download"
          iconPosition="left"
          iconSize={16}
          fullWidth
          className="whitespace-normal text-center"
        >
          Export All ({totalResults?.toLocaleString()})
        </Button>
      </div>

      {/* Export Options */}
      {totalResults > 0 && (
        <div className="space-y-3 mt-4">
          <div className="flex items-center space-x-2">
            <div className="h-px bg-white/20 flex-1"></div>
            <span className="text-xs text-green-200 px-2">Export Options</span>
            <div className="h-px bg-white/20 flex-1"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onExportValid}
              disabled={exportInProgress}
              iconName="CheckCircle"
              iconPosition="left"
              iconSize={14}
              fullWidth
            >
              Valid Emails
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onExportInvalid}
              disabled={exportInProgress}
              iconName="XCircle"
              iconPosition="left"
              iconSize={14}
              fullWidth
            >
              Invalid Emails
            </Button>
          </div>

          {selectedCount > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onExportSelected}
              disabled={exportInProgress}
              iconName="Download"
              iconPosition="left"
              iconSize={14}
              fullWidth
            >
              Export Selected ({selectedCount})
            </Button>
          )}
        </div>
      )}

      {/* Statistics */}
      {totalResults > 0 && (
        <div className="pt-3 border-t border-white/20">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-white">{totalResults?.toLocaleString()}</div>
              <div className="text-xs text-green-200">Total Results</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-300">{selectedCount}</div>
              <div className="text-xs text-green-200">Selected</div>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      {totalResults === 0 && (
        <div className="text-center py-4">
          <Icon name="Info" size={16} className="text-green-300 mx-auto mb-2" />
          <p className="text-sm text-green-200">
            No results available. Start a new verification to see export options.
          </p>
        </div>
      )}
    </div>
  );
};

export default QuickActions;
