import React from 'react';
import {
  Building2,
  User as UserIcon,
  Truck,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  PackageCheck,
  BarChart3,
} from 'lucide-react';

interface LandingProps {
  onLogin: () => void;
  onRegister: () => void;
}

export default function Landing({ onLogin, onRegister }: LandingProps) {
  return (
    <div className="min-h-screen bg-surface-muted relative overflow-hidden">
      {/* Ambient background glow (same treatment as the login screen) */}
      <div className="pointer-events-none absolute top-1/4 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      {/* Top bar */}
      <header className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center text-xl font-black shadow-lg shadow-primary/20">
            R
          </div>
          <span className="text-2xl font-black tracking-tight text-on-surface">RentFlow</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onLogin}
            className="px-5 py-2.5 text-sm font-bold text-on-surface hover:text-primary transition-colors"
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={onRegister}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
          <Briefcase className="w-3.5 h-3.5" />
          Enterprise Rental Management
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-on-surface leading-tight mb-6">
          Rent smarter.
          <br />
          <span className="text-primary">Deliver faster.</span>
        </h1>

        <p className="text-lg md:text-xl text-on-surface-variant font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
          RentFlow brings your inventory, customers, and delivery teams onto one unified
          platform — built on Odoo infrastructure so every rental order, pickup, and return
          stays in sync.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={onRegister}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90"
          >
            Create your account
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onLogin}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white border border-border-standard px-8 py-3.5 text-base font-semibold text-on-surface shadow-sm transition hover:border-primary/40 hover:text-primary"
          >
            Sign in
          </button>
        </div>
      </main>

      {/* Role cards */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-border-standard p-8 shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-5">
              <UserIcon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-2">For Customers</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Browse the catalog, book equipment for the dates you need, and track every
              rental from checkout to return.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-border-standard p-8 shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-5">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-2">For Admins</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Manage inventory, pricing, and customers, and get real-time analytics across
              every rental in the system.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-border-standard p-8 shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-5">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-2">For Drivers</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              See assigned pickups and deliveries, plan routes, and update job status from
              anywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="relative z-10 border-t border-border-standard bg-white/60">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex items-center gap-3">
            <PackageCheck className="w-6 h-6 text-secondary shrink-0" />
            <div>
              <div className="font-bold text-on-surface text-sm">Live inventory</div>
              <div className="text-xs text-on-surface-variant">Always know what's available to rent</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-secondary shrink-0" />
            <div>
              <div className="font-bold text-on-surface text-sm">OTP-verified accounts</div>
              <div className="text-xs text-on-surface-variant">Every signup is email-verified</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-secondary shrink-0" />
            <div>
              <div className="font-bold text-on-surface text-sm">Built-in analytics</div>
              <div className="text-xs text-on-surface-variant">Track revenue, returns and demand</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-8 flex items-center justify-center gap-3 text-sm text-on-surface-variant font-medium">
        <Briefcase className="w-4 h-4" />
        Powered by Odoo Infrastructure
      </footer>
    </div>
  );
}