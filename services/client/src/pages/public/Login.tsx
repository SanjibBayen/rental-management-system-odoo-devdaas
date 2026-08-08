import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Building2, User, Truck, Briefcase, Mail, Lock, ArrowRight, User as UserIcon, Phone } from 'lucide-react';

export default function Login() {
  const { login, signup } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginView) {
      login(email, password);
    } else {
      signup(name, email, password, phone);
    }
  };

  const autofillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-surface-muted flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden border border-border-standard">
        {/* Left side branding */}
        <div className="bg-[#0F172A] p-12 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white text-primary rounded-xl flex items-center justify-center text-2xl font-black shadow-lg">R</div>
              <h1 className="text-4xl font-black tracking-tight">RentFlow</h1>
            </div>
            <p className="text-slate-300 text-lg font-medium leading-relaxed">
              Enterprise rental management system. Streamline your inventory, customers, and deliveries in one unified platform.
            </p>
            <div className="mt-12 flex items-center gap-3 text-sm text-slate-400 font-medium bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
              <Briefcase className="w-5 h-5 text-primary" />
              Powered by Odoo Infrastructure
            </div>
            
            <div className="mt-8 space-y-3">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Demo Accounts (Click to auto-fill)</p>
              <div className="flex flex-col gap-2">
                <button onClick={() => autofillDemo('admin@rentflow.com')} className="text-left text-sm bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" /> Admin Portal
                </button>
                <button onClick={() => autofillDemo('john@example.com')} className="text-left text-sm bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-primary" /> Customer Portal
                </button>
                <button onClick={() => autofillDemo('dave@rentflow.com')} className="text-left text-sm bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary" /> Delivery Portal
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side login/signup */}
        <div className="p-12 flex flex-col justify-center bg-white relative">
          <h2 className="text-3xl font-black text-on-surface mb-2 tracking-tight">
            {isLoginView ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-on-surface-variant font-medium mb-8 text-lg">
            {isLoginView ? 'Enter your credentials to access your portal.' : 'Sign up to start renting professional equipment.'}
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLoginView && (
              <>
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                    <input 
                      required 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe" 
                      className="w-full pl-12 pr-4 py-3 bg-surface-muted border border-border-standard rounded-xl font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                    <input 
                      required 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000" 
                      className="w-full pl-12 pr-4 py-3 bg-surface-muted border border-border-standard rounded-xl font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline"
                    />
                  </div>
                </div>
              </>
            )}
            
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                <input 
                  required 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  className="w-full pl-12 pr-4 py-3 bg-surface-muted border border-border-standard rounded-xl font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-on-surface">Password</label>
                {isLoginView && (
                  <button type="button" className="text-sm font-bold text-primary hover:underline">Forgot password?</button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                <input 
                  required 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-4 py-3 bg-surface-muted border border-border-standard rounded-xl font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline"
                />
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-2"
            >
              {isLoginView ? 'Sign In' : 'Create Account'} <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-on-surface-variant font-medium">
              {isLoginView ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                onClick={() => setIsLoginView(!isLoginView)}
                className="text-primary font-bold hover:underline"
              >
                {isLoginView ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
