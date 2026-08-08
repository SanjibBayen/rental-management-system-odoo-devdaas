import { Truck, MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

const initialTasks = [
  { id: 'TSK-101', type: 'Pickup', customer: 'Sarah Jenkins', address: '123 Tech Park, Suite 400', time: '10:00 AM', status: 'Pending' },
  { id: 'TSK-102', type: 'Delivery', customer: 'BuildCorp Ltd.', address: 'Site B, 45 Industrial Way', time: '11:30 AM', status: 'In Progress' },
  { id: 'TSK-103', type: 'Return', customer: 'Vision Studios', address: 'Studio 3, Creative Block', time: '02:00 PM', status: 'Pending' },
];

export default function DeliveryDashboard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [flashMsg, setFlashMsg] = useState<{title: string, desc: string} | null>(null);

  useEffect(() => {
    if (flashMsg) {
      const timer = setTimeout(() => setFlashMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [flashMsg]);

  const handleTaskAction = (taskId: string, currentStatus: string) => {
    if (currentStatus === 'Pending') {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'In Progress' } : t));
      setFlashMsg({ title: 'Task Started', desc: `Navigating to ${taskId}` });
    } else if (currentStatus === 'In Progress') {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'Completed' } : t));
      setFlashMsg({ title: 'Task Completed', desc: `${taskId} marked as successfully done.` });
    }
  };

  const completedCount = tasks.filter(t => t.status === 'Completed').length;

  return (
    <main className="flex-1 max-w-3xl mx-auto w-full px-margin-desktop py-8 relative">
      {/* Flash Notification */}
      {flashMsg && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-4 z-50 bg-success-teal text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-6 h-6" />
          <div>
            <div className="font-bold text-sm">{flashMsg.title}</div>
            <div className="text-xs opacity-90">{flashMsg.desc}</div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-black text-on-surface mb-2">Delivery Routes</h1>
        <p className="text-on-surface-variant font-medium">Today's Assignments</p>
      </div>
      
      <div className="flex gap-4 mb-8">
        <div className="flex-1 bg-white p-4 rounded-xl border border-border-standard shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-full">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-on-surface">{tasks.length}</div>
            <div className="text-xs text-outline font-bold uppercase">Total Tasks</div>
          </div>
        </div>
        <div className="flex-1 bg-white p-4 rounded-xl border border-border-standard shadow-sm flex items-center gap-4">
          <div className="p-3 bg-success-teal/10 text-success-teal rounded-full">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-on-surface">{completedCount}</div>
            <div className="text-xs text-outline font-bold uppercase">Completed</div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className={`bg-white p-6 rounded-xl border ${task.status === 'Completed' ? 'border-success-teal/30 bg-success-teal/5' : 'border-border-standard'} shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between transition-colors`}>
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
              
              {task.status === 'Completed' ? (
                <div className="px-4 py-2 font-bold text-sm text-success-teal flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Done
                </div>
              ) : (
                <button 
                  onClick={() => handleTaskAction(task.id, task.status)}
                  className={`w-full sm:w-auto px-6 py-2 rounded-lg font-bold text-sm transition-all ${
                    task.status === 'In Progress' 
                    ? 'bg-success-teal text-white hover:bg-opacity-90 shadow-md scale-100 hover:scale-105 active:scale-95' 
                    : 'bg-primary text-white hover:bg-opacity-90 shadow-md scale-100 hover:scale-105 active:scale-95'
                  }`}
                >
                  {task.status === 'In Progress' ? 'Mark Completed' : 'Start Task'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
