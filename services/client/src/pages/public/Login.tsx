import { useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Building2, User, Truck, Briefcase, ChevronRight } from 'lucide-react';

export default function Login() {
  const { login, mockUsers } = useAuth();
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    const el = cardRefs.current[id];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    el.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px) scale(1.01)`;
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);
  };

  const resetTilt = (id: string) => {
    const el = cardRefs.current[id];
    if (!el) return;
    el.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
  };

  return (
    <div className="min-h-screen bg-surface-muted flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute top-1/4 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute bottom-1/4 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite_reverse]" />

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl shadow-black/10 overflow-hidden border border-border-standard relative animate-[fadeIn_0.5s_ease-out] isolate">
        {/* Left side branding */}
        <div className="bg-primary p-12 text-white flex flex-col justify-center relative overflow-hidden">
          {/* Animated gradient mesh */}
          <div
            className="pointer-events-none absolute inset-0 opacity-60 animate-[meshShift_12s_ease-in-out_infinite]"
            style={{
              background:
                'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15) 0%, transparent 45%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.12) 0%, transparent 45%)',
            }}
          />
          {/* Dot grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px',
            }}
          />
          {/* Floating glow orbs */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-[float_9s_ease-in-out_infinite]" />
          <div className="pointer-events-none absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-[float_7s_ease-in-out_infinite_reverse]" />
          {/* Bottom fade for depth */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/10 to-transparent" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <h1 className="text-4xl font-black tracking-tight drop-shadow-sm">RentFlow</h1>
            </div>
            <p className="text-primary-container text-lg font-medium leading-relaxed">
              Enterprise rental management system. Streamline your inventory, customers, and deliveries in one unified platform.
            </p>
            <div className="mt-12 flex items-center gap-3 text-sm text-primary-container font-medium">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                <Briefcase className="w-4 h-4" />
              </span>
              Powered by Odoo Infrastructure
            </div>
          </div>
        </div>

        {/* Right side login */}
        <div className="p-12 flex flex-col justify-center bg-surface-bright relative">
          <h2 className="text-2xl font-bold text-on-surface mb-2">Welcome Back</h2>
          <p className="text-on-surface-variant font-medium mb-8">Please select your portal to continue.</p>

          <div className="space-y-3" style={{ perspective: '1000px' }}>
            {mockUsers.map((u, idx) => (
              <button
                key={u.id}
                ref={(el) => { cardRefs.current[u.id] = el; }}
                onClick={() => login(u.id)}
                onMouseMove={(e) => handleMouseMove(e, u.id)}
                onMouseLeave={() => resetTilt(u.id)}
                style={{
                  animation: `fadeInUp 0.4s ease-out ${idx * 0.06}s both`,
                  transition: 'transform 0.15s ease-out, box-shadow 0.25s ease-out, border-color 0.25s ease-out',
                  transformStyle: 'preserve-3d',
                }}
                className="relative w-full flex items-center p-4 border border-border-standard rounded-xl bg-white text-left shadow-sm overflow-hidden
                  hover:border-primary/60 hover:shadow-xl hover:shadow-primary/15
                  active:scale-[0.99]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                  group"
              >
                {/* Cursor-follow glow */}
                <span
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      'radial-gradient(160px circle at var(--mx) var(--my), rgba(var(--color-primary-rgb, 37,99,235), 0.08), transparent 70%)',
                  }}
                />
                {/* Left accent bar */}
                <span className="absolute left-0 top-0 h-full w-0 bg-primary group-hover:w-1 transition-all duration-200 ease-out rounded-r" />

                <div className="relative w-12 h-12 rounded-lg bg-surface-muted group-hover:bg-primary flex items-center justify-center text-primary group-hover:text-white mr-4 transition-all duration-300 ease-out group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30">
                  {u.role === 'admin' ? (
                    <Building2 className="w-6 h-6" />
                  ) : u.role === 'delivery' ? (
                    <Truck className="w-6 h-6" />
                  ) : (
                    <User className="w-6 h-6" />
                  )}
                </div>

                <div className="relative flex-1 min-w-0">
                  <div className="font-bold text-on-surface text-lg truncate group-hover:text-primary transition-colors duration-200">
                    {u.name}
                  </div>
                  <div className="text-outline text-sm font-medium capitalize">{u.role} Portal</div>
                </div>

                <ChevronRight className="relative w-5 h-5 text-outline opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary transition-all duration-200 ease-out shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, -14px); }
        }
        @keyframes meshShift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-15px, 10px) scale(1.05); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}