import React from 'react';
import Icon from '../../../components/AppIcon';

const SummaryStats = ({ 
  totalProcessed = 0,
  validRate = 0,
  averageProcessingTime = 0,
  loading = false 
}) => {
  const stats = [
    {
      id: 'total',
      label: 'Total Processed',
      value: totalProcessed?.toLocaleString(),
      icon: 'Mail',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: 'Emails verified'
    },
    {
      id: 'valid',
      label: 'Valid Rate',
      value: `${validRate?.toFixed(1)}%`,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10',
      description: 'Success rate',
      progress: validRate
    },
    {
      id: 'time',
      label: 'Avg Processing Time',
      value: `${averageProcessingTime?.toFixed(2)}s`,
      icon: 'Clock',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      description: 'Per email'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3]?.map((i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6">
            <div className="animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-muted rounded-2xl"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded-full w-24 mb-2"></div>
                  <div className="h-3 bg-muted rounded-full w-16"></div>
                </div>
              </div>
              <div className="h-8 bg-muted rounded-full w-20 mb-2"></div>
              <div className="h-3 bg-muted rounded-full w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats?.map((stat) => (
        <div key={stat?.id} className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-smooth">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-10 h-10 ${stat?.bgColor} rounded-2xl flex items-center justify-center`}>
              <Icon name={stat?.icon} size={20} className={stat?.color} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">{stat?.label}</h3>
              <p className="text-sm text-muted-foreground">{stat?.description}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-2xl font-bold text-foreground">{stat?.value}</div>
            
            {stat?.progress !== undefined && (
              <div className="space-y-1">
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-progress ${
                      stat?.progress >= 80 ? 'bg-success' :
                      stat?.progress >= 60 ? 'bg-warning' : 'bg-error'
                    }`}
                    style={{ width: `${Math.min(stat?.progress, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryStats;
