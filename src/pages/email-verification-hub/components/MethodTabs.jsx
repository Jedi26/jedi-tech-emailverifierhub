import React from 'react';
import Icon from '../../../components/AppIcon';

const MethodTabs = ({ activeMethod, onMethodChange }) => {
  const methods = [
    {
      id: 'single',
      label: 'Single Email',
      icon: 'Mail',
      description: 'Verify one email address'
    },
    {
      id: 'bulk',
      label: 'Bulk Paste',
      icon: 'FileText',
      description: 'Paste multiple emails'
    },
    {
      id: 'upload',
      label: 'File Upload',
      icon: 'Upload',
      description: 'Upload CSV/TXT files'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-1 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
        {methods?.map((method) => (
          <button
            key={method?.id}
            onClick={() => onMethodChange(method?.id)}
            className={`
              flex items-center space-x-3 p-4 rounded-xl transition-smooth text-left
              ${activeMethod === method?.id 
                ? 'bg-primary text-primary-foreground shadow-subtle' 
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }
            `}
          >
            <Icon 
              name={method?.icon} 
              size={20} 
              className={activeMethod === method?.id ? 'text-primary-foreground' : 'text-primary'} 
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium">{method?.label}</div>
              <div className={`text-sm ${activeMethod === method?.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                {method?.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MethodTabs;
