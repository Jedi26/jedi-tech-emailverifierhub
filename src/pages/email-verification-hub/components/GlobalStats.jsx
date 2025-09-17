// import React from 'react';
// import Icon from '../../../components/AppIcon';

// const GlobalStats = () => {
//   // Mock global statistics data
//   const stats = [
//     {
//       id: 'total-processed',
//       label: 'Total Processed',
//       value: '2,847,392',
//       icon: 'Mail',
//       color: 'text-primary',
//       bgColor: 'bg-primary/10'
//     },
//     {
//       id: 'valid-rate',
//       label: 'Valid Rate',
//       value: '87.3%',
//       icon: 'CheckCircle',
//       color: 'text-success',
//       bgColor: 'bg-success/10'
//     },
//     {
//       id: 'avg-processing',
//       label: 'Avg Processing Time',
//       value: '2.4s',
//       icon: 'Clock',
//       color: 'text-accent',
//       bgColor: 'bg-accent/10'
//     },
//     {
//       id: 'active-users',
//       label: 'Active Users',
//       value: '12,847',
//       icon: 'Users',
//       color: 'text-secondary',
//       bgColor: 'bg-secondary/10'
//     }
//   ];

//   return (
//     <div className="bg-card border border-border rounded-lg p-6 mb-8">
//       <div className="flex items-center space-x-2 mb-4">
//         <Icon name="BarChart3" size={20} className="text-primary" />
//         <h2 className="font-heading font-semibold text-foreground">Global Statistics</h2>
//         <div className="flex items-center space-x-1 text-xs text-muted-foreground">
//           <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
//           <span>Live</span>
//         </div>
//       </div>
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats?.map((stat) => (
//           <div key={stat?.id} className="text-center">
//             <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${stat?.bgColor} mb-2`}>
//               <Icon name={stat?.icon} size={20} className={stat?.color} />
//             </div>
//             <div className="text-2xl font-bold text-foreground mb-1">{stat?.value}</div>
//             <div className="text-sm text-muted-foreground">{stat?.label}</div>
//           </div>
//         ))}
//       </div>
//       <div className="mt-4 pt-4 border-t border-border">
//         <div className="flex items-center justify-between text-sm text-muted-foreground">
//           <span>Last updated: {new Date()?.toLocaleTimeString()}</span>
//           <div className="flex items-center space-x-1">
//             <Icon name="TrendingUp" size={14} className="text-success" />
//             <span className="text-success">+12.5% this month</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GlobalStats;