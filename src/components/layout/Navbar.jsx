"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { Zap, Menu, X, User, Bell } from "lucide-react";
import GlassButton from "@/components/ui/GlassButton";
import { cn } from "@/lib/utils";
import gsap from "gsap";

const Navbar = () => {
  const { user, login, logout, notifications } = useStore();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false); // New: Notification Dropdown State

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-black/50 backdrop-blur-xl border-white/10 py-3"
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-accent flex items-center justify-center text-black font-bold text-xl group-hover:scale-110 transition-transform">
            <Zap size={18} fill="currentColor" />
          </div>
          <span className="font-bold text-xl tracking-tighter text-white">
            UNI<span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-accent">FLOW</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="/" active={pathname === "/"}>Home</NavLink>
          <NavLink href="/hackathons" active={pathname === "/hackathons"}>Hackathons</NavLink>
          <NavLink href="/workshops" active={pathname === "/workshops"}>Workshops</NavLink>
          <NavLink href="/cultural" active={pathname === "/cultural"}>Cultural</NavLink>
          
          {!user ? (
            <div className="flex items-center gap-4 ml-4">
              <Link href="/login" className="text-white/70 hover:text-white font-medium text-sm transition-colors">
                Login
              </Link>
              <Link href="/onboarding">
                <GlassButton variant="primary">
                  Sign Up
                </GlassButton>
              </Link>
            </div>
          ) : (
             <div className="flex items-center gap-4 ml-4">
                {/* Notifications */}
                <div className="relative">
                    <button 
                        onClick={() => setNotifOpen(!notifOpen)}
                        className="relative w-10 h-10 rounded-full bg-surface-highlight border border-white/10 flex items-center justify-center hover:border-neon-blue transition-colors text-white"
                    >
                        <Bell size={18} />
                        {notifications.length > 0 && (
                            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-black"></span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {notifOpen && (
                        <div className="absolute top-12 right-0 w-80 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl z-50">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-white">Notifications</h3>
                                <span className="text-xs text-white/50">{notifications.length} New</span>
                            </div>
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map(notif => (
                                        <div key={notif.id} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${notif.type === 'alert' ? 'bg-neon-purple/20 text-neon-purple' : 'bg-neon-orange/20 text-neon-orange'}`}>
                                                    {notif.type === 'alert' ? 'Reminder' : 'Action Needed'}
                                                </span>
                                                <span className="text-[10px] text-white/30">Just now</span>
                                            </div>
                                            <p className="text-sm font-bold text-white/90 mb-1">{notif.title}</p>
                                            <p className="text-xs text-white/60 leading-relaxed">{notif.message}</p>
                                            <Link href={`/event/${notif.eventId}`} onClick={() => setNotifOpen(false)} className="block mt-2 text-xs text-neon-blue hover:underline">
                                                View Event →
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-white/30">
                                        <p className="text-sm">You are all caught up!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="text-right hidden lg:block">
                  <p className="text-sm font-bold text-white">{user.name}</p>
                  <p className="text-xs text-white/50">{user.email}</p>
                </div>
                <Link href="/profile">
                  <div className="w-10 h-10 rounded-full bg-surface-highlight border border-white/10 flex items-center justify-center cursor-pointer hover:border-neon-blue transition-colors">
                     <User size={18} />
                  </div>
                </Link>
             </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full h-screen bg-black/95 backdrop-blur-xl p-6 flex flex-col gap-6 md:hidden">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-white">Home</Link>
          <Link href="/explore" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-white">Explore</Link>
          {!user ? (
             <GlassButton onClick={() => { login(); setMobileMenuOpen(false); }} className="w-full justify-center">Sign In</GlassButton>
          ) : (
             <GlassButton onClick={() => { logout(); setMobileMenuOpen(false); }} variant="outline" className="w-full justify-center">Sign Out</GlassButton>
          )}
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ href, active, children }) => (
  <Link 
    href={href} 
    className={cn(
      "relative text-sm font-medium tracking-wide transition-colors duration-300 hover:text-white",
      active ? "text-white" : "text-white/60"
    )}
  >
    {children}
    {active && (
      <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.8)] rounded-full" />
    )}
  </Link>
);

export default Navbar;
