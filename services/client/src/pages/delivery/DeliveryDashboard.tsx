import { Truck, MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/dateHelpers';

interface DeliveryTask {
  id: string;
  type: 'Pickup' | 'Delivery' | 'Return';
  customer: string;
  address: string;
  time: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  rentalId?: string;
}

export default function DeliveryDashboard() {
  const [tasks, setTasks] = useState<DeliveryTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flashMsg, setFlashMsg] = useState<{title: string, desc: string} | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (flashMsg) {
      const timer = setTimeout(() => setFlashMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [flashMsg]);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch today's pickups and returns
      const [pickupsRes, returnsRes] = await Promise.all([
        api.pickups.getToday(),
        api.returns.getToday(),
      ]);

      // Map pickups to tasks
      const pickupTasks: DeliveryTask[] = (pickupsRes.data || []).map((p: any) => ({
        id: p.id,
        type: 'Pickup',
        customer: p.customer_name || 'Unknown Customer',
        address: p.address_line1 || 'No address provided',
        time: new Date(p.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Pending',
        rentalId: p.rental_id,
      }));

      // Map returns to tasks
      const returnTasks: DeliveryTask[] = (returnsRes.data || []).map((r: any) => ({
        id: r.id,
        type: 'Return',
        customer: r.customer_name || 'Unknown Customer',
        address: r.address_line1 || 'No address provided',
        time: new Date(r.return_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Pending',
        rentalId: r.rental_id,
      }));

      // Combine and sort by time
      const allTasks = [...pickupTasks, ...returnTasks]
        .sort((a, b) => a.time.localeCompare(b.time));

      setTasks(allTasks);
    } catch (err) {
      console.error('Failed to fetch delivery tasks:', err);
      setError('Failed to load delivery tasks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskAction = async (taskId: string, currentStatus: string) => {
    try {
      if (currentStatus === 'Pending') {
        // Start task - update pickup or return status
        const task = tasks.find(t => t.id === taskId);
        if (task?.type === 'Pickup') {
          await api.pickups.confirm(taskId, { notes: 'Task started by delivery driver' });
        } else if (task?.type === 'Return') {
          await api.returns.confirm(taskId);
        }

        setTasks(tasks.map(t => 
          t.id === taskId ? { ...t, status: 'In Progress' } : t
        ));
        setFlashMsg({ 
          title: 'Task Started', 
          desc: `Navigating to ${taskId}` 
        });
      } else if (currentStatus === 'In Progress') {
        // Complete task
        const task = tasks.find(t => t.id === taskId);
        if (task?.type === 'Pickup') {
          // Already confirmed, just mark as completed in UI
          await api.pickups.confirm(taskId, { notes: 'Task completed successfully' });
        } else if (task?.type === 'Return') {
          await api.returns.confirm(taskId);
        }

        setTasks(tasks.map(t => 
          t.id === taskId ? { ...t, status: 'Completed' } : t
        ));
        setFlashMsg({ 
          title: 'Task Completed', 
          desc: `${taskId} marked as successfully done.` 
        });
      }
    } catch (err) {
      console.error('Failed to update task:', err);
      setFlashMsg({ 
        title: 'Error', 
        desc: 'Failed to update task status. Please try again.' 
      });
    }
  };

  const completedCount = tasks.filter(t => t.status === 'Completed').length;

  if (isLoading) {
    return (
      <main className="flex-1 max-w-3xl mx-auto w-full px-margin-desktop py-8">
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse text-on-surface-variant">Loading delivery tasks...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 max-w-3xl mx-auto w-full px-margin-desktop py-8">
        <div className="text-center py-20">
          <p className="text-danger-red font-bold">{error}</p>
          <button 
            onClick={fetchTasks}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

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
        <h1 className="text-2xl font-bold text-on-surface mb-2">Delivery Routes</h1>
        <p className="text-on-surface-variant font-medium text-sm">Today's Assignments</p>
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
        {tasks.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-border-standard text-center">
            <p className="text-on-surface-variant font-medium">No delivery tasks scheduled for today.</p>
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className={`bg-white p-6 rounded-xl border ${task.status === 'Completed' ? 'border-success-teal/30 bg-success-teal/5' : 'border-border-standard'} shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between transition-colors`}>
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${task.type === 'Delivery' ? 'bg-info-blue/10 text-info-blue' : task.type === 'Pickup' ? 'bg-warning-amber/10 text-warning-amber' : 'bg-primary/10 text-primary'}`}>
                  {task.type === 'Delivery' ? <Truck className="w-5 h-5" /> : task.type === 'Pickup' ? <MapPin className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg text-on-surface">{task.type}</span>
                    <span className="text-xs px-2 py-0.5 bg-surface-muted rounded text-outline font-bold">{task.id.slice(0, 8)}</span>
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
          ))
        )}
      </div>
    </main>
  );
}