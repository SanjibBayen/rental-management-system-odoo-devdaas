import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { UserCircle, Mail, Briefcase, Phone, Settings, MapPin } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-margin-desktop py-12">
      <h1 className="text-3xl font-black text-on-surface tracking-tight mb-8">My Profile</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-border-standard overflow-hidden">
        <div className="bg-primary/5 p-8 border-b border-border-standard flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-4xl font-black shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-on-surface">{user.name}</h2>
            <p className="text-on-surface-variant font-medium capitalize mt-1">{user.role} Account</p>
          </div>
          <button className="md:ml-auto mt-4 md:mt-0 px-4 py-2 bg-white border border-border-standard rounded-lg font-bold text-sm hover:border-primary transition-colors flex items-center gap-2">
            <Settings className="w-4 h-4" /> Edit Profile
          </button>
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-4 text-on-surface">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center text-on-surface-variant shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-outline font-medium">Email Address</div>
                    <div className="font-bold text-sm text-on-surface">{user.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center text-on-surface-variant shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-outline font-medium">Phone Number</div>
                    <div className="font-bold text-sm text-on-surface">+1 (555) 123-4567</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center text-on-surface-variant shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-outline font-medium">Location</div>
                    <div className="font-bold text-sm text-on-surface">Odoo Headquarters, CA</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-4 text-on-surface">Account Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface-muted rounded-xl border border-border-standard">
                  <div>
                    <div className="font-bold text-sm text-on-surface">Two-Factor Authentication</div>
                    <div className="text-xs text-on-surface-variant font-medium mt-0.5">Secure your account</div>
                  </div>
                  <button className="text-xs font-bold bg-primary text-white px-3 py-1.5 rounded-lg">Enable</button>
                </div>
                <div className="flex items-center justify-between p-4 bg-surface-muted rounded-xl border border-border-standard">
                  <div>
                    <div className="font-bold text-sm text-on-surface">Email Notifications</div>
                    <div className="text-xs text-on-surface-variant font-medium mt-0.5">Updates on rentals and tasks</div>
                  </div>
                  <button className="text-xs font-bold bg-success-teal text-white px-3 py-1.5 rounded-lg">Enabled</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
