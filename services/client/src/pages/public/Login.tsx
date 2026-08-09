import React, { useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Building2, User, Truck, Briefcase, Mail, Lock, ArrowRight, ArrowLeft, User as UserIcon, ShieldCheck } from 'lucide-react';

type Step = 'login' | 'signup' | 'otp';
type Role = 'admin' | 'customer' | 'delivery';

interface LoginProps {
  initialStep?: 'login' | 'signup';
  onBack?: () => void;
}

export default function Login({ initialStep = 'login', onBack }: LoginProps) {
  const { login, signup, verifyOTP, resendOTP, logout } = useAuth();
  const [step, setStep] = useState<Step>(initialStep);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<Role>('customer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitRef = useRef<HTMLButtonElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (step === 'login') {
        const loggedInUser = await login(email, password);

        // App.tsx always routes based on the account's REAL role from the
        // backend — this check just gives a clear message when that
        // doesn't match the role selected here, instead of silently
        // landing on a different dashboard than expected.
        if (loggedInUser.role !== role) {
          logout();
          setError(
            `This account is registered as "${loggedInUser.role}", not "${role}". Select "${loggedInUser.role}" above and sign in again.`
          );
          return;
        }
      } else if (step === 'signup') {
        
        const result = await signup(name, email, password, role);
        if (result?.userId) {
          setUserId(result.userId);
          setStep('otp');
          setTimeout(() => {
            const otpInput = document.getElementById('otp-input');
            if (otpInput) otpInput.focus();
          }, 200);
        }
      }
    } catch (err: any) {
      const message = err.message || 'Authentication failed. Please try again.';
      if (message.toLowerCase().includes('verify your email')) {
        const backendUserId = err.response?.data?.userId || userId;
        if (backendUserId) setUserId(backendUserId);
        await resendOTP(backendUserId || '', email);
        setStep('otp');
        setError('Please verify your email. A new OTP has been sent.');
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!userId) throw new Error('User ID missing. Please start over.');
      await verifyOTP(userId, otp);
    
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-muted flex items-center justify-center p-4 relative overflow-hidden">
      <div className="pointer-events-none absolute top-1/4 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute bottom-1/4 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite_reverse]" />

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl shadow-black/10 overflow-hidden border border-border-standard relative animate-[fadeIn_0.5s_ease-out]">
        <div className="bg-primary p-12 text-white flex flex-col justify-center relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-60 animate-[meshShift_12s_ease-in-out_infinite]"
            style={{
              background:
                'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15) 0%, transparent 45%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.12) 0%, transparent 45%)',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-[float_9s_ease-in-out_infinite]" />
          <div className="pointer-events-none absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-[float_7s_ease-in-out_infinite_reverse]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/10 to-transparent" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white text-primary rounded-xl flex items-center justify-center text-2xl font-black shadow-lg">
                R
              </div>
              <h1 className="text-4xl font-black tracking-tight drop-shadow-sm">RentFlow</h1>
            </div>
            <p className="text-primary-container text-lg font-medium leading-relaxed">
              Enterprise rental management system. Streamline your inventory, customers, and deliveries in one unified platform.
            </p>
           
          </div>
        </div>

        <div className="p-12 flex flex-col justify-center bg-surface-bright relative">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors mb-6 self-start"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          )}

          <h2 className="text-3xl font-black text-on-surface mb-2 tracking-tight">
            {step === 'login' && `Sign in as ${role}`}
            {step === 'signup' && `Create ${role} Account`}
            {step === 'otp' && 'Verify Your Email'}
          </h2>
          <p className="text-on-surface-variant font-medium mb-8 text-lg">
            {step === 'login' && `Enter your credentials to access the ${role} portal.`}
            {step === 'signup' && `Sign up to start renting as a ${role}.`}
            {step === 'otp' && `We’ve sent a 6‑digit OTP to ${email}.`}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-danger-red/10 border border-danger-red/20 rounded-lg text-danger-red text-sm font-medium">
              {error}
            </div>
          )}

          {step !== 'otp' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {step === 'signup' && (
                <div className="animate-[fadeInUp_0.3s_ease-out]">
                  <label className="block text-sm font-bold text-on-surface mb-2">Full Name</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline transition-colors group-focus-within:text-primary" />
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3 bg-surface-muted border border-border-standard rounded-xl font-medium transition-all duration-200 placeholder:text-outline
                        focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white
                        hover:border-primary/40"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline transition-colors group-focus-within:text-primary" />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-12 pr-4 py-3 bg-surface-muted border border-border-standard rounded-xl font-medium transition-all duration-200 placeholder:text-outline
                      focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white
                      hover:border-primary/40"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-on-surface">Password</label>
                  {step === 'login' && (
                    <button type="button" className="text-sm font-bold text-primary hover:underline underline-offset-2">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline transition-colors group-focus-within:text-primary" />
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-surface-muted border border-border-standard rounded-xl font-medium transition-all duration-200 placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white hover:border-primary/40"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-bold text-on-surface mb-2">Select Role</label>
                <div className="flex flex-col sm:flex-row gap-3 bg-surface-muted p-3 rounded-xl border border-border-standard">
                  {(['customer', 'admin', 'delivery'] as Role[]).map((r) => (
                    <label
                      key={r}
                      className="flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-colors hover:bg-white/10"
                    >
                      <input
                        type="radio"
                        name="role"
                        value={r}
                        checked={role === r}
                        onChange={() => setRole(r)}
                        className="accent-primary w-4 h-4"
                      />
                      <span className="font-medium text-sm capitalize">{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <button
                  type="submit"
                  ref={submitRef}
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : (step === 'login' ? 'Sign In' : 'Create Account')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center text-sm text-on-surface-variant">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setStep(step === 'login' ? 'signup' : 'login');
                  }}
                  className="font-semibold text-primary hover:underline"
                >
                  {step === 'login' ? 'Create a new account' : 'Already have an account? Sign in'}
                </button>
              </div>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-5 animate-[fadeInUp_0.4s_ease-out]">
              <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20 mb-4">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <div>
                  <div className="font-bold text-sm text-on-surface">OTP Sent</div>
                  <div className="text-xs text-on-surface-variant">
                    Enter the 6‑digit code sent to <span className="font-semibold">{email}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">Enter OTP</label>
                <input
                  id="otp-input"
                  required
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full px-4 py-3 bg-surface-muted border border-border-standard rounded-xl font-medium text-center text-2xl tracking-[0.5em] transition-all duration-200 placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setStep('signup');
                    setOtp('');
                    setError(null);
                  }}
                  className="px-6 py-3 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={otp.length !== 6 || isLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying...' : 'Verify & Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center text-sm text-on-surface-variant">
                <button
                  type="button"
                  onClick={() => {
                    setOtp('');
                    setError(null);
                    alert('OTP resent! Check your email.');
                  }}
                  className="font-semibold text-primary hover:underline"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}