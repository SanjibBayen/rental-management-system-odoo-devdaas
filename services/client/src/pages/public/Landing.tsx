
import React from "react";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  PackageCheck,
  ShieldCheck,
  Truck,
  UserRound,
  Zap,
} from "lucide-react";

interface LandingProps {
  onLogin: () => void;
  onRegister: () => void;
}

const roles = [
  {
    icon: UserRound,
    title: "Customers",
    description:
      "Discover equipment, choose your rental period, arrange delivery or pickup, and manage every order from one place.",
    action: "Start renting",
  },
  {
    icon: Building2,
    title: "Business Admins",
    description:
      "Control products, pricing, inventory, customers, deposits, returns, invoices, and rental operations.",
    action: "Manage operations",
  },
  {
    icon: Truck,
    title: "Delivery Teams",
    description:
      "View assigned deliveries, manage pickup schedules, update job status, and keep customers informed.",
    action: "View deliveries",
  },
];

const benefits = [
  {
    icon: PackageCheck,
    title: "Real-time inventory",
    description: "Know what is available before accepting a rental.",
  },
  {
    icon: ShieldCheck,
    title: "Secure accounts",
    description: "Email verification and protected customer data.",
  },
  {
    icon: Clock3,
    title: "Smart returns",
    description: "Track due dates, late fees, and deposit settlement.",
  },
  {
    icon: BarChart3,
    title: "Business insights",
    description: "Monitor revenue, rentals, returns, and demand.",
  },
];

export default function Landing({
  onLogin,
  onRegister,
}: LandingProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* =========================================================
          HERO
      ========================================================== */}

      <section className="relative min-h-[760px] flex flex-col">
        {/* Background Image */}

        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=2400&q=90"
            alt="Professional rental equipment"
            className="w-full h-full object-cover"
          />

          {/* Dark cinematic overlays */}
          <div className="absolute inset-0 bg-slate-950/70" />

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/30" />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
        </div>

        {/* Decorative glow */}

        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-[120px]" />

        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-[130px]" />

        {/* =====================================================
            NAVBAR
        ====================================================== */}

        <header className="relative z-20 w-full">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6">
            <div className="flex items-center justify-between">

              {/* Logo */}

              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex items-center gap-3 group"
              >
                <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-white text-slate-950 font-black text-xl shadow-2xl transition-transform duration-300 group-hover:scale-105">
                  R

                  <span className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-primary border-2 border-slate-950" />
                </div>

                <div className="text-left">
                  <div className="text-xl font-black tracking-tight">
                    RentFlow
                  </div>

                  <div className="hidden sm:block text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">
                    Rental Management
                  </div>
                </div>
              </button>

              {/* Navigation */}

              <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-white/70">
                <a
                  href="#features"
                  className="hover:text-white transition"
                >
                  Features
                </a>

                <a
                  href="#roles"
                  className="hover:text-white transition"
                >
                  For Businesses
                </a>

                <a
                  href="#workflow"
                  className="hover:text-white transition"
                >
                  How it works
                </a>
              </nav>

              {/* Actions */}

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={onLogin}
                  className="px-4 sm:px-5 py-2.5 text-sm font-semibold text-white/80 hover:text-white transition"
                >
                  Sign in
                </button>

                <button
                  type="button"
                  onClick={onRegister}
                  className="
                    inline-flex items-center gap-2
                    rounded-full
                    bg-white
                    text-slate-950
                    px-5 py-2.5
                    text-sm font-bold
                    shadow-xl
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:shadow-2xl
                  "
                >
                  Get started
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* =====================================================
            HERO CONTENT
        ====================================================== */}

        <main className="relative z-10 flex-1 flex items-center">
          <div className="max-w-7xl w-full mx-auto px-5 sm:px-8 py-20">

            <div className="max-w-4xl">

              {/* Eyebrow */}

              <div
                className="
                  inline-flex items-center gap-2
                  px-4 py-2
                  rounded-full
                  border border-white/15
                  bg-white/10
                  backdrop-blur-md
                  text-white/80
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.15em]
                  mb-7
                "
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>

                Modern Rental Operations Platform
              </div>

              {/* Heading */}

              <h1
                className="
                  text-5xl
                  sm:text-6xl
                  lg:text-8xl
                  font-black
                  tracking-[-0.04em]
                  leading-[0.95]
                  text-white
                "
              >
                Everything you rent.
                <span className="block text-primary">
                  One smarter flow.
                </span>
              </h1>

              {/* Description */}

              <p
                className="
                  mt-7
                  max-w-2xl
                  text-base
                  sm:text-lg
                  lg:text-xl
                  leading-relaxed
                  text-white/65
                "
              >
                RentFlow connects inventory, customers, payments,
                deliveries, security deposits, and returns into one
                seamless rental management experience.
              </p>

              {/* CTA */}

              <div className="flex flex-col sm:flex-row gap-3 mt-9">
                <button
                  type="button"
                  onClick={onRegister}
                  className="
                    group
                    inline-flex
                    items-center
                    justify-center
                    gap-3
                    rounded-full
                    bg-primary
                    px-7
                    py-4
                    text-base
                    font-bold
                    text-white
                    shadow-2xl
                    shadow-primary/30
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:bg-primary/90
                  "
                >
                  Start renting today

                  <ArrowRight
                    className="
                      w-5 h-5
                      transition-transform
                      group-hover:translate-x-1
                    "
                  />
                </button>

                <button
                  type="button"
                  onClick={onLogin}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    border
                    border-white/20
                    bg-white/10
                    backdrop-blur-md
                    px-7
                    py-4
                    text-base
                    font-semibold
                    text-white
                    transition
                    hover:bg-white/15
                  "
                >
                  Sign in to dashboard
                </button>
              </div>

              {/* Trust */}

              <div className="flex flex-wrap items-center gap-x-7 gap-y-3 mt-9 text-sm text-white/50">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Email verified accounts
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Secure payments
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Real-time availability
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Bottom stats */}

        <div className="relative z-10 max-w-7xl w-full mx-auto px-5 sm:px-8 pb-8">
          <div
            className="
              grid
              grid-cols-2
              md:grid-cols-4
              rounded-2xl
              border border-white/10
              bg-black/20
              backdrop-blur-xl
              overflow-hidden
            "
          >
            {[
              ["24/7", "Rental visibility"],
              ["100%", "Order tracking"],
              ["Real-time", "Inventory status"],
              ["One", "Unified platform"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="
                  px-5
                  py-5
                  border-white/10
                  [&:not(:last-child)]:border-r
                "
              >
                <div className="text-xl sm:text-2xl font-black text-white">
                  {value}
                </div>

                <div className="text-xs text-white/45 mt-1">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          ROLE SECTION
      ========================================================== */}

      <section
        id="roles"
        className="relative bg-slate-950 py-24"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">

          <div className="max-w-2xl mb-14">
            <div className="text-primary text-sm font-bold uppercase tracking-[0.18em] mb-3">
              Built for everyone
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              One platform.
              <span className="text-white/40">
                {" "}Different workflows.
              </span>
            </h2>

            <p className="mt-5 text-white/50 leading-relaxed">
              Whether you're renting equipment, managing the business,
              or delivering products, RentFlow gives every role the
              tools they need.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {roles.map((role) => {
              const Icon = role.icon;

              return (
                <article
                  key={role.title}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-3xl
                    border border-white/10
                    bg-white/[0.04]
                    p-7
                    transition-all
                    duration-500
                    hover:-translate-y-2
                    hover:border-primary/30
                    hover:bg-white/[0.07]
                  "
                >
                  <div
                    className="
                      w-12 h-12
                      rounded-2xl
                      bg-primary/10
                      border border-primary/10
                      flex items-center justify-center
                      mb-7
                      transition
                      group-hover:bg-primary
                    "
                  >
                    <Icon className="w-6 h-6 text-primary group-hover:text-white transition" />
                  </div>

                  <h3 className="text-xl font-bold">
                    {role.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-white/50">
                    {role.description}
                  </p>

                  <button
                    type="button"
                    onClick={onRegister}
                    className="
                      mt-7
                      inline-flex
                      items-center
                      gap-2
                      text-sm
                      font-bold
                      text-primary
                      hover:text-white
                      transition
                    "
                  >
                    {role.action}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURES
      ========================================================== */}

      <section
        id="features"
        className="relative bg-white text-slate-950 py-24"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">

            <div className="max-w-2xl">
              <div className="text-primary text-sm font-bold uppercase tracking-[0.18em] mb-3">
                Everything connected
              </div>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                Your entire rental operation,
                <span className="text-slate-400">
                  {" "}in one place.
                </span>
              </h2>
            </div>

            <p className="max-w-md text-slate-500 leading-relaxed">
              From the first product search to the final deposit
              settlement, every step stays connected.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="
                    rounded-3xl
                    border border-slate-200
                    bg-slate-50
                    p-6
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:bg-white
                    hover:shadow-xl
                  "
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>

                  <h3 className="font-bold text-lg">
                    {benefit.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          WORKFLOW
      ========================================================== */}

      <section
        id="workflow"
        className="relative bg-slate-100 text-slate-950 py-24"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">

          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-primary text-sm font-bold uppercase tracking-[0.18em] mb-3">
              Simple workflow
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              From booking to return,
              <span className="text-slate-400">
                {" "}without the chaos.
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              ["01", "Choose", "Browse products and select your rental period."],
              ["02", "Book", "Add delivery details or choose store pickup."],
              ["03", "Rent", "Pay the rental amount and security deposit."],
              ["04", "Return", "Return on time and receive your deposit back."],
            ].map(([number, title, description]) => (
              <div
                key={number}
                className="relative"
              >
                <div className="text-6xl font-black text-slate-200">
                  {number}
                </div>

                <h3 className="mt-[-12px] text-xl font-black relative">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================== */}

      <section className="relative bg-slate-950 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />

        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full" />

        <div className="relative max-w-4xl mx-auto px-5 sm:px-8 text-center">

          <div className="inline-flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-[0.18em] mb-5">
            <Zap className="w-4 h-4" />
            Ready when you are
          </div>

          <h2 className="text-4xl sm:text-6xl font-black tracking-tight">
            Start managing rentals
            <span className="block text-white/40">
              the smarter way.
            </span>
          </h2>

          <p className="mt-6 text-white/50 max-w-xl mx-auto leading-relaxed">
            Give your customers a better rental experience while
            giving your team the visibility and control they need.
          </p>

          <button
            type="button"
            onClick={onRegister}
            className="
              mt-8
              inline-flex
              items-center
              gap-3
              rounded-full
              bg-primary
              px-8
              py-4
              font-bold
              text-white
              shadow-2xl
              shadow-primary/30
              transition
              hover:-translate-y-1
              hover:bg-primary/90
            "
          >
            Create your account
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================== */}

      <footer className="border-t border-white/10 bg-slate-950">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-slate-950 flex items-center justify-center font-black">
                R
              </div>

              <div>
                <div className="font-bold">
                  RentFlow
                </div>

                <div className="text-xs text-white/35">
                  Modern Rental Management
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/35">
              <ShieldCheck className="w-4 h-4" />
              Secure rental operations
            </div>

            <div className="text-xs text-white/30">
              © {new Date().getFullYear()} RentFlow. All rights reserved.
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
}

