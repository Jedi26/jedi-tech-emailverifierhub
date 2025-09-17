import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Select from './Select';

const ExportControls = ({ 
  resultCount = 0, 
  filteredCount = 0, 
  onExport = () => {}, 
  exportInProgress = false,
  availableFormats = ['csv', 'xlsx', 'json'],
  className = '' 
}) => {
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [exportScope, setExportScope] = useState('filtered');

  const formatOptions = [
    { value: 'csv', label: 'CSV File', description: 'Comma-separated values' },
    ]?.filter(option => availableFormats?.includes(option?.value));

  const scopeOptions = [
    { 
      value: 'filtered', 
      label: `Current Results (${filteredCount?.toLocaleString()})`,
      description: 'Export currently filtered results'
    },
    { 
      value: 'all', 
      label: `All Results (${resultCount?.toLocaleString()})`,
      description: 'Export complete dataset'
    }
  ];

  const handleExport = () => {
    onExport({
      format: selectedFormat,
      scope: exportScope,
      count: exportScope === 'filtered' ? filteredCount : resultCount
    });
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'csv': return 'FileText';
       default: return 'Download';
    }
  };

  if (resultCount === 0) return null;

  return (
    <div className={`bg-card border border-border rounded-2xl p-4 shadow-md ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Download" size={20} className="text-primary" />
          <h3 className="font-heading font-medium text-foreground">Export Results</h3>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="CheckCircle" size={16} className="text-success" />
          <span>{resultCount?.toLocaleString()} total results</span>
        </div>
      </div>

      {/* Format & Scope Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Select
          label="Export Format"
          options={formatOptions}
          value={selectedFormat}
          onChange={setSelectedFormat}
          disabled={exportInProgress}
          className="rounded-lg"
        />

        <Select
          label="Export Scope"
          options={scopeOptions}
          value={exportScope}
          onChange={setExportScope}
          disabled={exportInProgress}
          className="rounded-lg"
        />
      </div>

      {/* Export Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border rounded-lg">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name={getFormatIcon(selectedFormat)} size={16} />
          <span>
            Exporting {exportScope === 'filtered' ? filteredCount?.toLocaleString() : resultCount?.toLocaleString()} 
            {' '}records as {selectedFormat?.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {exportInProgress && (
            <div className="flex items-center space-x-2 text-sm text-warning">
              <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
              <span>Preparing export...</span>
            </div>
          )}
          
          <Button
            variant="default"
            onClick={handleExport}
            disabled={exportInProgress || (exportScope === 'filtered' && filteredCount === 0)}
            loading={exportInProgress}
            iconName="Download"
            iconPosition="left"
            iconSize={16}
            className="rounded-lg"
          >
            {exportInProgress ? 'Exporting...' : 'Export Data'}
          </Button>
        </div>
      </div>

      {/* Export Status */}
      {exportInProgress && (
        <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-warning" />
            <span className="text-sm font-medium text-warning">
              Preparing your export file. This may take a few moments for large datasets.
            </span>
          </div>
        </div>
      )}

      {/* Quick Export Buttons */}
      <div className="mt-4 pt-4 border-t border-border rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Quick Export:</span>
          <div className="flex items-center space-x-2">
            {formatOptions?.slice(0, 2)?.map((format) => (
              <Button
                key={format?.value}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedFormat(format?.value);
                  handleExport();
                }}
                disabled={exportInProgress}
                iconName={getFormatIcon(format?.value)}
                iconPosition="left"
                iconSize={14}
                className="rounded-lg"
              >
                {format?.value?.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportControls;
