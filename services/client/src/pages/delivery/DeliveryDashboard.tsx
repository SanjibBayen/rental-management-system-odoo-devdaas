import { Truck, MapPin, CheckCircle, Clock } from 'lucide-react';

export default function DeliveryDashboard() {
  const tasks = [
    { id: 'TSK-101', type: 'Pickup', customer: 'Sarah Jenkins', address: '123 Tech Park, Suite 400', time: '10:00 AM', status: 'Pending' },
    { id: 'TSK-102', type: 'Delivery', customer: 'BuildCorp Ltd.', address: 'Site B, 45 Industrial Way', time: '11:30 AM', status: 'In Progress' },
    { id: 'TSK-103', type: 'Return', customer: 'Vision Studios', address: 'Studio 3, Creative Block', time: '02:00 PM', status: 'Pending' },
  ];

  return (
    <main className="flex-1 max-w-3xl mx-auto w-full px-margin-desktop py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-primary mb-2">Delivery Tasks</h1>
        <p className="text-outline font-medium">Today's Route - Oct 24, 2023</p>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="flex-1 bg-white p-4 rounded-xl border border-border-standard shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-full">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-on-surface">12</div>
            <div className="text-xs text-outline font-bold uppercase">Total Tasks</div>
          </div>
        </div>
        <div className="flex-1 bg-white p-4 rounded-xl border border-border-standard shadow-sm flex items-center gap-4">
          <div className="p-3 bg-success-teal/10 text-success-teal rounded-full">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-on-surface">4</div>
            <div className="text-xs text-outline font-bold uppercase">Completed</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="bg-white p-6 rounded-xl border border-border-standard shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:border-primary transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${task.type === 'Delivery' ? 'bg-info-blue/10 text-info-blue' : task.type === 'Pickup' ? 'bg-warning-amber/10 text-warning-amber' : 'bg-primary/10 text-primary'}`}>
                {task.type === 'Delivery' ? <Truck className="w-5 h-5" /> : task.type === 'Pickup' ? <MapPin className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-lg text-on-surface">{task.type}</span>
                  <span className="text-xs px-2 py-0.5 bg-surface-muted rounded text-outline font-bold">{task.id}</span>
                </div>
                <div className="text-sm font-semibold text-on-surface-variant mb-1">{task.customer}</div>
                <div className="text-xs text-outline flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {task.address}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
              <div className="text-sm font-bold flex items-center gap-1 text-on-surface">
                <Clock className="w-4 h-4 text-primary" /> {task.time}
              </div>
              <button className={`w-full sm:w-auto px-4 py-2 rounded-lg font-bold text-sm transition-colors ${task.status === 'In Progress' ? 'bg-primary text-white hover:bg-opacity-90' : 'bg-surface-muted text-primary hover:bg-primary/10 border border-border-standard'}`}>
                {task.status === 'In Progress' ? 'Complete Task' : 'Start Task'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
