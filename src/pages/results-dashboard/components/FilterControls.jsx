import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterControls = ({ 
  onFilterChange = () => {},
  onSearchChange = () => {},
  filters = {},
  searchQuery = '',
  resultCounts = {},
  onClearFilters = () => {},
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: 'all', label: `All Status (${resultCounts?.total || 0})` },
    { value: 'valid', label: `Valid (${resultCounts?.valid || 0})` },
    { value: 'invalid', label: `Invalid (${resultCounts?.invalid || 0})` },
    { value: 'disposable', label: `Disposable (${resultCounts?.disposable || 0})` },
    { value: 'risky', label: `Risky (${resultCounts?.risky || 0})` }
  ];

  const domainTypeOptions = [
    { value: 'all', label: 'All Domains' },
    { value: 'business', label: 'Business Domains' },
    { value: 'personal', label: 'Personal Domains' },
    { value: 'educational', label: 'Educational Domains' },
    { value: 'government', label: 'Government Domains' }
  ];

  const mxRecordOptions = [
    { value: 'all', label: 'All MX Records' },
    { value: 'valid', label: 'Valid MX Record' },
    { value: 'invalid', label: 'Invalid MX Record' }
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value && value !== 'all') || searchQuery;

  return (
    <div className={`bg-card border border-border rounded-2xl shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border rounded-t-2xl">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="font-heading font-medium text-foreground">Filter Results</h3>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
              iconSize={14}
            >
              Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            iconSize={16}
            className="lg:hidden"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-border">
        <Input
          type="search"
          placeholder="Search emails, domains, or specific addresses..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e?.target?.value)}
          className="w-full rounded-2xl"
        />
      </div>

      {/* Filter Controls */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block relative z-50`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          <Select
            label="Email Status"
            options={statusOptions}
            value={filters?.status || 'all'}
            onChange={(value) => handleFilterChange('status', value)}
            className="rounded-2xl z-50"
          />
          <Select
            label="Domain Type"
            options={domainTypeOptions}
            value={filters?.domainType || 'all'}
            onChange={(value) => handleFilterChange('domainType', value)}
            className="rounded-2xl z-50"
          />
          <Select
            label="MX Record"
            options={mxRecordOptions}
            value={filters?.mxRecord || 'all'}
            onChange={(value) => handleFilterChange('mxRecord', value)}
            className="rounded-2xl z-50"
          />
        </div>

        {/* Quick Filter Buttons */}
        <div className="px-4 pb-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-muted-foreground">Quick Filters:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters?.status === 'valid' ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange('status', filters?.status === 'valid' ? 'all' : 'valid')}
              iconName="CheckCircle"
              iconPosition="left"
              iconSize={14}
              className="rounded-2xl"
            >
              Valid Only
            </Button>

            <Button
              variant={filters?.status === 'invalid' ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange('status', filters?.status === 'invalid' ? 'all' : 'invalid')}
              iconName="XCircle"
              iconPosition="left"
              iconSize={14}
              className="rounded-2xl"
            >
              Invalid Only
            </Button>

            <Button
              variant={filters?.mxRecord === 'valid' ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange('mxRecord', filters?.mxRecord === 'valid' ? 'all' : 'valid')}
              iconName="Server"
              iconPosition="left"
              iconSize={14}
              className="rounded-2xl"
            >
              Valid MX
            </Button>

            <Button
              variant={filters?.status === 'disposable' ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange('status', filters?.status === 'disposable' ? 'all' : 'disposable')}
              iconName="AlertTriangle"
              iconPosition="left"
              iconSize={14}
              className="rounded-2xl"
            >
              Disposable
            </Button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {(resultCounts?.filtered !== undefined && resultCounts?.total > 0) && (
        <div className="px-4 py-3 bg-muted/30 border-t border-border rounded-b-2xl">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Showing {resultCounts?.filtered} of {resultCounts?.total} results
            </span>
            {hasActiveFilters && (
              <div className="flex items-center space-x-1 text-primary">
                <Icon name="Filter" size={14} />
                <span>Filtered</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterControls;
