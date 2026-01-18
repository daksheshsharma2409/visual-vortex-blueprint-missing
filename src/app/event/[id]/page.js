"use client";
import React, { useEffect, useState } from "react";
import { EVENTS } from "@/lib/mockData";
import { Calendar, MapPin, Users, Trophy, ExternalLink, Share2, Clock, CheckCircle, Mail, Phone, Info, Bookmark } from "lucide-react";
import GlassButton from "@/components/ui/GlassButton";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import GlassCard from "@/components/ui/GlassCard";

// Helper to get random similar events
const getSimilarEvents = (currentEvent) => {
    return EVENTS.filter(e => e.id !== currentEvent.id && (e.type === currentEvent.type || e.tags.some(t => currentEvent.tags.includes(t)))).slice(0, 3);
};

export default function EventDetailsPage({ params }) {
  const { addToHistory, toggleBookmark, user } = useStore();
  const [event, setEvent] = useState(null);
  const [similarEvents, setSimilarEvents] = useState([]);
  const [unwrappedParams, setUnwrappedParams] = useState(null);

  // Next.js 15 Async Params Unwrap
  useEffect(() => {
    if (params instanceof Promise) {
        params.then(setUnwrappedParams);
    } else {
        setUnwrappedParams(params);
    }
  }, [params]);

  useEffect(() => {
    if (unwrappedParams?.id) {
        const e = EVENTS.find(ev => ev.id.toString() === unwrappedParams.id);
        if (e) {
            setEvent(e);
            setSimilarEvents(getSimilarEvents(e));
        }
    }
  }, [unwrappedParams]);

  useEffect(() => {
    if (event?.id) {
        addToHistory(event.id);
    }
  }, [event?.id]); // Intentionally omitting addToHistory to prevent loop

  if (!unwrappedParams) return <div className="min-h-screen pt-24 text-center text-white">Loading...</div>;
  if (!event) return <div className="min-h-screen pt-24 text-center text-white">Event not found</div>;

  const details = event.details || {}; // Fallback if no rich details

  return (
    <div className="min-h-screen pb-20">
       {/* Hero Banner */}
       <div className="relative h-[60vh] w-full overflow-hidden">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          
          <div className="absolute bottom-0 left-0 w-full z-20 container mx-auto px-6 pb-12">
             <div className="flex gap-2 mb-4">
                <Badge className="bg-neon-blue text-black border-transparent font-bold">{event.type}</Badge>
                {details.stats?.daysLeft && <Badge className="bg-white/10 text-white border-white/20"><Clock size={12} className="mr-1"/> {details.stats.daysLeft} days left</Badge>}
             </div>
             <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-2">{event.title}</h1>
             <p className="text-xl text-white/70 font-medium">By {event.organizer}</p>
          </div>
       </div>

       <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
             
             {/* Description Section */}
             <div className="glass-panel p-8 rounded-3xl space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <Info className="text-neon-purple" />
                    <h2 className="text-2xl font-bold text-white">Details</h2>
                </div>
                <p className="text-white/70 leading-relaxed text-lg">
                    {details.description || event.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                   {event.tags.map(tag => (
                      <Badge key={tag} className="bg-white/5 border-white/10">{tag}</Badge>
                   ))}
                </div>
             </div>

             {/* Responsibilities */}
             {details.responsibilities && (
                <div className="glass-panel p-8 rounded-3xl space-y-6">
                    <h2 className="text-2xl font-bold text-white mb-4">What you will do</h2>
                    <ul className="space-y-4">
                        {details.responsibilities.map((item, i) => (
                            <li key={i} className="flex gap-3 text-white/80">
                                <CheckCircle className="text-neon-green shrink-0 mt-1" size={18} />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
             )}

             {/* Similar Opportunities */}
             <div>
                <h3 className="text-xl font-bold text-white mb-6">Similar Opportunities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {similarEvents.map(sim => (
                        <Link key={sim.id} href={`/event/${sim.id}`}>
                            <GlassCard className="p-4 flex gap-4 cursor-pointer hover:border-neon-blue/50 transition-colors h-full">
                                <img src={sim.image} className="w-16 h-16 rounded-lg object-cover" alt={sim.title}/>
                                <div>
                                    <h4 className="font-bold text-white line-clamp-1">{sim.title}</h4>
                                    <p className="text-xs text-white/50">{sim.organizer}</p>
                                    <Badge className="mt-2 text-[10px] px-2 py-0.5">{sim.type}</Badge>
                                </div>
                            </GlassCard>
                        </Link>
                    ))}
                </div>
             </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
             <div className="glass-panel p-6 rounded-3xl space-y-6 sticky top-24 border border-white/10 bg-white/5 backdrop-blur-md">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                   <span className="text-white/70 font-medium">Prize / Stipend</span>
                   <span className="text-xl font-bold text-neon-orange flex items-center gap-2"><Trophy size={18} /> {event.prize}</span>
                </div>

                <div className="space-y-5">
                   {/* Info Rows */}
                   <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neon-blue shrink-0">
                         <Calendar size={20} />
                      </div>
                      <div>
                         <p className="text-xs text-white/60 uppercase font-bold">Important Dates</p>
                         <p className="font-medium text-white/90">{event.date}</p>
                         {details.deadline && <p className="text-xs text-red-400 mt-1">Deadline: {details.deadline}</p>}
                      </div>
                   </div>

                   <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neon-purple shrink-0">
                         <MapPin size={20} />
                      </div>
                      <div>
                         <p className="text-xs text-white/60 uppercase font-bold">Location</p>
                         <p className="font-medium text-white/90">{event.location}</p>
                      </div>
                   </div>

                   <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-green-400 shrink-0">
                         <Users size={20} />
                      </div>
                      <div>
                         <p className="text-xs text-white/60 uppercase font-bold">Team Size</p>
                         <p className="font-medium text-white/90">{event.teamSize}</p>
                      </div>
                   </div>
                   
                   {/* Contact Section */}
                   {details.contact && (
                       <div className="pt-4 border-t border-white/10 mt-4">
                           <p className="text-xs text-white/60 uppercase font-bold mb-3">Contact Organizers</p>
                           <div className="space-y-2 text-sm text-white/80">
                               <div className="flex items-center gap-2">
                                   <Mail size={14} /> {details.contact.email}
                               </div>
                               <div className="flex items-center gap-2">
                                   <Phone size={14} /> {details.contact.phone}
                               </div>
                           </div>
                       </div>
                   )}
                </div>
                
                {/* Perks Bubbles */}
                {details.perks && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {details.perks.map(perk => (
                            <span key={perk} className="px-3 py-1 bg-neon-green/10 text-neon-green rounded-full text-xs font-bold border border-neon-green/20">
                                {perk}
                            </span>
                        ))}
                    </div>
                )}

                <div className="pt-6 space-y-3">
                   <a 
                      href={event.externalLink || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block"
                   >
                       <GlassButton variant="primary" className="w-full justify-center text-center font-bold h-12 text-lg">
                          Apply on {event.platform?.name || "Platform"} <ExternalLink size={18} />
                       </GlassButton>
                   </a>
                   
                   <div className="flex gap-2">
                       <GlassButton 
                          onClick={() => toggleBookmark(event.id)}
                          variant="primary" // Resetting to primary to override fully with className
                          className={`flex-1 justify-center transition-all duration-300 ${
                              user?.bookmarks?.includes(event.id) 
                              ? "!bg-neon-blue !text-black shadow-[0_0_15px_rgba(0,243,255,0.5)] border-transparent" 
                              : "text-white/50 hover:text-white"
                          }`}
                        >
                           <Bookmark size={16} fill={user?.bookmarks?.includes(event.id) ? "black" : "none"} /> 
                           {user?.bookmarks?.includes(event.id) ? "Saved" : "Save"}
                       </GlassButton>
                       <GlassButton variant="ghost" className="flex-1 justify-center text-white/50 hover:text-white">
                          <Share2 size={16} /> Share
                       </GlassButton>
                   </div>
                </div>

                {/* Platform Info */}
                {event.platform && (
                    <div className="glass-panel p-4 rounded-xl flex items-center gap-4 mt-6">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2">
                             <img src={event.platform.logo} alt={event.platform.name} className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <p className="text-xs text-white/50 uppercase font-bold">Powered By</p>
                            <p className="text-white font-bold">{event.platform.name}</p>
                        </div>
                    </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
}
