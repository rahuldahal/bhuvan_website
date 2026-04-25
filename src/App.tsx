/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import { User, Calendar, MapPin, Mail, Briefcase, FileDown, PenTool, Music, Cpu, MessageSquare, Phone, Facebook, Globe, Camera, Trash2, X, CheckCircle2, Play, Pause, Volume2, VolumeX, Upload, Loader2, Languages, Save, Info, Award, TrendingUp, Moon, Sun, Printer, Search } from "lucide-react";
import { Language, translations } from "./translations";

// CV URL state is now managed inside the App component

const CustomAudioPlayer = ({ url, onUpload, id }: { url: string; onUpload?: (id: string, file: File) => void; id?: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = prevVolume;
        setVolume(prevVolume);
      } else {
        setPrevVolume(volume);
        audioRef.current.volume = 0;
        setVolume(0);
      }
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
      setPrevVolume(newVolume);
    } else {
      setIsMuted(true);
    }
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload && id) {
      if (file.type !== "audio/mpeg" && !file.name.endsWith(".mp3")) {
        alert("कृपया केवल MP3 फाइल मात्र छान्नुहोस्।");
        return;
      }
      onUpload(id, file);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full bg-primary/5 p-4 border border-primary/10 relative group/player no-print">
      <audio 
        ref={audioRef} 
        src={url} 
        onEnded={() => setIsPlaying(false)} 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      
      <div className="flex items-center gap-4">
        <button 
          onClick={togglePlay}
          className="w-10 h-10 rounded-none bg-primary text-white flex items-center justify-center hover:bg-slate-800 transition-colors shadow-sm shrink-0"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
        </button>
        
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-primary/40">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="relative w-full h-1 group/seek">
            <div 
              className="absolute top-0 left-0 h-full bg-primary z-10 pointer-events-none" 
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            />
            <input 
              type="range" 
              min="0" 
              max={duration || 0} 
              step="0.01" 
              value={currentTime} 
              onChange={handleSeek}
              className="absolute top-0 left-0 w-full h-full bg-primary/20 accent-primary appearance-none cursor-pointer rounded-none z-20 opacity-0 group-hover/seek:opacity-100 transition-opacity"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-primary/10 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2 group/volume hidden sm:flex shrink-0">
          <button 
            onClick={toggleMute}
            className="p-1 hover:bg-primary/5 transition-colors text-primary"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <div className="w-16 relative h-1 group/vols">
            <div 
              className="absolute top-0 left-0 h-full bg-primary/60 pointer-events-none" 
              style={{ width: `${volume * 100}%` }}
            />
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume} 
              onChange={handleVolumeChange}
              className="absolute top-0 left-0 w-full h-full bg-transparent accent-primary appearance-none cursor-pointer rounded-none z-10"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-primary/10 pointer-events-none" />
          </div>
        </div>

        {onUpload && (
          <div className="flex gap-1 shrink-0">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="audio/mp3,audio/mpeg" 
              className="hidden" 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-8 h-8 rounded-none border border-primary/20 flex items-center justify-center text-primary/60 hover:text-primary hover:bg-surface transition-all shadow-sm"
              title="MP3 लोड गर्नुहोस्"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const getSlides = (
  customAudio: Record<string, string>, 
  handleAudioUpload: (id: string, file: File) => void,
  lang: Language
) => {
  const ts = translations[lang].slides;
  const t = translations[lang];

  return [
    {
      id: "01",
      title: ts["01"].title,
      icon: <User className="w-5 h-5" />,
      content: (
        <div className="flex flex-col gap-4">
          <p className="text-2xl font-display text-primary leading-[0.9] font-black uppercase">
            {ts["01"].intro}
          </p>
          <p className="text-gray-600 leading-snug">
            {ts["01"].desc}
          </p>
        </div>
      )
    },
    {
      id: "02",
      title: ts["02"].title,
      icon: <Calendar className="w-5 h-5" />,
      content: ts["02"].content
    },
    {
      id: "03",
      title: ts["03"].title,
      icon: <MapPin className="w-5 h-5" />,
      content: (
        <div className="flex flex-col gap-3">
          <p className="text-text/90">
            {ts["03"].content}
          </p>
          <div className="w-full h-40 rounded-lg overflow-hidden border border-border shadow-inner">
            <iframe 
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14264.444743202!2d87.67493529362758!3d26.66094038477755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e58e38520b134d%3A0x6b44766f68595679!2sDamak!5e0!3m2!1s${lang}!2snp!4v1713593000000!5m2!1s${lang}!2snp`}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {ts["03"].location}
          </p>
        </div>
      )
    },
    {
      id: "04",
      title: ts["04"].title,
      icon: <Briefcase className="w-5 h-5" />,
    content: (
      <div className="max-h-[350px] overflow-y-auto pr-3 custom-scrollbar flex flex-col gap-6">
        <p className="text-text/90 leading-relaxed text-sm">
          {ts["04"].desc}
        </p>

        <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:left-[11px] before:w-0.5 before:bg-emerald-100 before:content-['']">
          {ts["04"].timeline.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative group"
            >
              <div className={`absolute -left-8 top-1.5 w-6 h-6 rounded-full border-4 border-white ${["bg-emerald-500", "bg-blue-500", "bg-purple-500", "bg-amber-500"][i] || "bg-primary"} shadow-sm z-10 group-hover:scale-125 transition-transform duration-300`} />
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-primary transition-colors">{item.period}</span>
                <h4 className="text-sm font-bold text-gray-900 leading-tight">{item.title}</h4>
                <p className="text-[12px] text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 mt-2">
          <div className="flex items-center gap-2 mb-2 text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
            <h4 className="text-[11px] font-bold uppercase tracking-wider">{ts["04"].impactTitle}</h4>
          </div>
          <p className="text-[12px] text-gray-600 leading-relaxed italic">
            {ts["04"].impactQuote}
          </p>
        </div>
      </div>
    )
  },
  {
    id: "05",
    title: ts["05"].title,
    icon: <PenTool className="w-5 h-5" />,
    content: (
      <div className="max-h-[400px] overflow-y-auto pr-3 custom-scrollbar flex flex-col gap-10">
        {ts["05"].poems.map((poem, idx) => (
          <div key={idx}>
            <p className="font-bold text-primary mb-3 text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
              {poem.title}
            </p>
            <div className="text-[13px] leading-relaxed italic whitespace-pre-line border-l-2 border-primary/20 pl-4 py-1 text-text/90">
              {poem.intro}
            </div>
            <div className="mt-2 text-[10px] text-right font-bold text-gray-400">
                — {t.appTitle} {idx === 2 && lang === "np" ? ", गौरादह १ झापा" : ""}
              </div>
          </div>
        ))}
        {lang === "en" && (
          <div className="p-4 bg-background border border-border italic text-[10px] text-gray-400">
            {(ts["05"] as any).note}
          </div>
        )}
      </div>
    )
  },
  {
    id: "06",
    title: ts["06"].title,
    icon: <Music className="w-5 h-5" />,
    content: (
      <div className="max-h-[400px] overflow-y-auto pr-3 custom-scrollbar flex flex-col gap-6">
        <div className="space-y-3">
          <p className="text-text/90 leading-relaxed font-medium">
            {ts["06"].intro}
          </p>
        </div>

        {ts["06"].songs.map((song, i) => (
          <div key={i} className="pt-4 border-t border-gray-100 group">
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-accent text-sm flex items-center gap-2">
                <Music className="w-4 h-4" />
                {song.title}
              </p>
            </div>
            
            <div className="bg-emerald-50/50 p-3 rounded-none mb-3 border-l-2 border-accent">
              <div className="text-[12px] leading-relaxed italic whitespace-pre-line text-gray-700">
                {song.lyrics}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CustomAudioPlayer 
                id={`song${i + 1}`}
                url={customAudio[`song${i + 1}`] || `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${i + 1}.mp3`} 
                onUpload={handleAudioUpload}
              />
            </div>
          </div>
        ))}

        <div className="p-3 bg-slate-50 border border-slate-100 flex items-center gap-3">
          <Volume2 className="w-4 h-4 text-slate-400" />
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{t.audioNote}</p>
        </div>
      </div>
    )
  },
  {
    id: "07",
    title: ts["07"].title,
    icon: <Cpu className="w-5 h-5" />,
    content: (
      <div className="max-h-[400px] overflow-y-auto pr-3 custom-scrollbar flex flex-col gap-6">
        <p className="text-gray-700 leading-relaxed text-sm">
          {ts["07"].intro}
        </p>

        <div className="space-y-4">
          {ts["07"].topics.map((topic, i) => (
            <div key={i} className="flex gap-4 items-start group">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <span className="text-xs font-normal font-mono">०{i + 1}</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 mb-1">{topic.title}</h4>
                <p className="text-[12px] text-gray-500 leading-normal">{topic.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 p-3 bg-emerald-50/50 rounded-xl border-t-2 border-primary/20">
          <div className="flex items-center gap-2 mb-2 text-primary">
            <MessageSquare className="w-4 h-4" />
            <h4 className="text-[11px] font-medium uppercase tracking-wider">{t.aiAdminImpact}</h4>
          </div>
          <p className="text-[12px] text-gray-600 leading-relaxed italic">
            {t.aiQuote}
          </p>
        </div>
      </div>
    )
  },
    {
      id: "08",
      title: ts["08"].title,
      icon: <Briefcase className="w-5 h-5" />,
      content: (
        <div className="flex flex-col gap-4">
          <p className="text-text/90 leading-relaxed text-sm">
            {ts["08"].content}
          </p>
          <div className="grid grid-cols-1 gap-2">
            {ts["08"].features?.map((feature: string, i: number) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="text-[10px] font-bold">{i + 1}</span>
                </div>
                <span className="text-xs font-medium text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "09",
      title: ts["09"].title,
      icon: <Globe className="w-5 h-5" />,
      content: ts["09"].content
    },
    {
      id: "10",
      title: ts["10"].title,
      icon: <FileDown className="w-5 h-5" />,
      content: ts["10"].content
    },
    {
      id: "11",
      title: ts["11"].title,
      icon: <CheckCircle2 className="w-5 h-5" />,
      content: (
        <div className="max-h-[400px] overflow-y-auto pr-3 custom-scrollbar flex flex-col gap-6">
          <p className="text-text/90 leading-relaxed text-sm">
            {ts["11"].desc}
          </p>
          <div className="grid grid-cols-1 gap-4">
            {ts["11"].skillGroups.map((group, i) => (
              <div key={i} className="p-3 bg-surface border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-3 pb-2 border-b border-gray-50 group-hover:text-amber-600 transition-colors">
                  {group.category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill, j) => (
                    <span key={j} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase rounded border border-emerald-100/50">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "12",
      title: ts["12"].title,
      icon: <MessageSquare className="w-5 h-5" />,
      content: (
        <div className="max-h-[400px] overflow-y-auto pr-3 custom-scrollbar flex flex-col gap-6">
          <p className="text-text/90 leading-relaxed text-sm">
            {ts["12"].desc}
          </p>
          <div className="grid grid-cols-1 gap-4">
            {ts["12"].items.map((testimonial: any, i: number) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 bg-surface border border-border rounded-2xl shadow-sm relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <MessageSquare className="w-12 h-12 text-primary" />
                </div>
                <p className="text-gray-600 italic text-sm mb-4 relative z-10 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 leading-none mb-1">{testimonial.name}</h4>
                    <p className="text-[10px] font-bold text-primary/60 uppercase tracking-tighter">{testimonial.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "13",
      title: ts["13"].title,
      icon: <Award className="w-5 h-5" />,
      content: (
        <div className="flex flex-col gap-4">
          <p className="text-text/90 leading-relaxed text-sm">
            {ts["13"].desc}
          </p>
          <div className="flex flex-col gap-3">
            {ts["13"].items.map((item: string, i: number) => (
              <div key={i} className="flex gap-4 p-3 bg-primary/5 border border-primary/10 rounded-xl group hover:bg-primary/10 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-text/90 leading-tight self-center">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "14",
      title: ts["14"].title,
      icon: <TrendingUp className="w-5 h-5" />,
      content: (
        <div className="flex flex-col gap-4">
          <p className="text-text/90 leading-relaxed text-sm">
            {ts["14"].desc}
          </p>
          <div className="grid grid-cols-1 gap-3">
            {ts["14"].goals.map((goal: string, i: number) => (
              <div key={i} className="p-4 bg-primary/5 border border-primary/10 rounded-2xl relative overflow-hidden group">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded bg-primary/20 text-primary flex items-center justify-center shrink-0 text-[10px] font-black">
                    {i + 1}
                  </div>
                  <span className="text-xs font-bold text-text/90">{goal}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "15",
      title: ts["15"].title,
      icon: <Phone className="w-5 h-5" />,
      content: (
        <div className="flex flex-col gap-4">
          <p className="text-text/90 text-sm">
            {ts["15"].desc}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <a href="mailto:dahal.bhuvan55@gmail.com" className="flex items-center gap-2 p-2 bg-background rounded border border-border hover:border-primary transition-colors">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold uppercase">{t.contactMail}</span>
            </a>
            <a href="https://www.facebook.com/bhuvan.dahal.56/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-background rounded border border-border hover:border-[#1877F2] transition-colors">
              <Facebook className="w-4 h-4 text-[#1877F2]" />
              <span className="text-[10px] font-bold uppercase">{t.contactFb}</span>
            </a>
            <a href="https://damakmun.gov.np" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-background rounded border border-border hover:border-green-600 transition-colors">
              <Globe className="w-4 h-4 text-green-600" />
              <span className="text-[10px] font-bold uppercase">{t.contactWeb}</span>
            </a>
            <div className="flex items-center gap-2 p-2 bg-background rounded border border-border">
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold uppercase">{t.contactCall}</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 mt-4 p-5 bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-primary/10 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl -mr-12 -mt-12 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-500/5 blur-3xl -ml-12 -mb-12 rounded-full"></div>
            
            <div className="relative z-10 w-32 h-32 p-2 bg-white border-2 border-primary/10 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105">
              <img 
                src="/contact_qr.png" 
                alt="Contact QR" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-center relative z-10">
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">{t.contactQrNote}</span>
            </div>
          </div>
        </div>
      )
    }
  ];
}

/**
 * Utility to crop image
 */
const getCroppedImg = async (imageSrc: string, pixelCrop: { x: number; y: number; width: number; height: number }) => {
  const image = new Image();
  image.crossOrigin = 'anonymous'; // Added for CORS support
  image.src = imageSrc;
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL('image/jpeg');
};

export default function App() {
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customAudio, setCustomAudio] = useState<Record<string, string>>({});
  const [slideSearchQuery, setSlideSearchQuery] = useState("");
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem("bhuvan_lang") as Language) || "np");
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("bhuvan_dark_mode") === "true");
  const [isPrinting, setIsPrinting] = useState(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);

  const mainRef = useRef<HTMLElement>(null);
  const [cvUrl, setCvUrl] = useState<string>(() => {
    return localStorage.getItem("bhuvan_cv_url") || "https://example.com/bhuvan-dahal-cv.pdf";
  });
  const { scrollYProgress } = useScroll({ container: mainRef });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleBeforePrint = () => setIsPrinting(true);
    const handleAfterPrint = () => setIsPrinting(false);
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  const handlePrint = () => {
    window.focus();
    try {
      window.print();
    } catch (e) {
      console.error("Print error:", e);
      alert(lang === "np" ? "प्रिन्ट विन्डो खोल्न सकिएन। कृपया नयाँ ट्याबमा खोलेर प्रयास गर्नुहोस् वा Ctrl+P थिच्नुहोस्।" : "Could not open print window. Please try opening in a new tab or press Ctrl+P.");
    }
  };

  const handleExportHtml = () => {
    const rootElement = document.getElementById('root');
    if (!rootElement) return;

    // Get all styles to make it somewhat standalone
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(el => el.outerHTML)
      .join('\n');

    const htmlContent = `<!DOCTYPE html>
<html lang="${lang}" class="${isDarkMode ? 'dark' : ''}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t.appTitle} - ${t.appSubtitle}</title>
    ${styles}
    <style>
      body { margin: 0; padding: 0; }
      .no-export { display: none !important; }
      /* Fix for some interactive elements in static view */
      .motion-div { opacity: 1 !important; transform: none !important; }
    </style>
</head>
<body class="bg-background text-foreground transition-colors duration-300">
    <div id="root">
      ${rootElement.innerHTML}
    </div>
    <script>
      console.log("Static export of Bhuvan Dahal Portfolio");
      // Add a simple notification
      alert("${t.exportHtmlSuccess}");
    </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bhuvan_Dahal_Portfolio_${lang}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    localStorage.setItem("bhuvan_lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("bhuvan_dark_mode", isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const t = translations[lang];

  const handleAudioUpload = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setCustomAudio(prev => ({
        ...prev,
        [id]: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  const slides = getSlides(
    customAudio, 
    handleAudioUpload, 
    lang
  );

const filteredSlides = slides.filter(slide => 
    slide.title.toLowerCase().includes(slideSearchQuery.toLowerCase()) ||
    slide.id.includes(slideSearchQuery)
  );

  useEffect(() => {
    localStorage.setItem("bhuvan_cv_url", cvUrl);
  }, [cvUrl]);

  const updateCvUrl = () => {
    const newUrl = prompt("तपाईंको CV को लिङ्क (URL) यहाँ हाल्नुहोस्:", cvUrl);
    if (newUrl !== null) {
      setCvUrl(newUrl);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Header */}
      <header className="h-20 bg-primary text-white flex items-center justify-between px-10 shadow-xl z-20 shrink-0 border-b border-primary/10">
        <motion.h1 
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl font-display font-black tracking-tighter uppercase"
        >
          <span className="text-red-600">{t.appTitle}</span> <span className="mx-4 font-light text-white opacity-20">|</span> <span className="text-sm tracking-[0.4em] uppercase font-bold text-white opacity-80">{t.appSubtitle}</span>
        </motion.h1>

        <div className="flex items-center gap-6">
          <button 
            type="button"
            onClick={() => setIsPrintPreviewOpen(true)}
            className={`relative z-50 w-10 h-10 flex items-center justify-center transition-all border no-print ${isPrinting ? 'bg-emerald-600 text-white border-emerald-500 scale-90' : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'}`}
            title={t.printPreview}
          >
            {isPrinting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Printer className="w-5 h-5 text-blue-500" />}
          </button>

          <button 
            type="button"
            onClick={handleExportHtml}
            className="no-print flex items-center gap-2 h-10 px-3 bg-white/10 hover:bg-white/20 transition-colors border border-white/20 text-white rounded-none"
            title={t.exportHtml}
          >
            <FileDown className="w-4 h-4 text-emerald-400" />
            <span className="text-[9px] font-black uppercase tracking-tighter hidden lg:block">{t.exportHtml}</span>
          </button>

          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors border border-white/20 text-white"
            title={isDarkMode ? "Light Mode" : "Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-blue-400" /> : <Moon className="w-5 h-5 text-blue-400" />}
          </button>

          <button 
            onClick={() => setLang(lang === "np" ? "en" : "np")}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 transition-colors border border-blue-400 group"
          >
            <Languages className="w-4 h-4 text-white group-hover:text-white" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">{lang === "np" ? "ENGLISH" : "नेपाली"}</span>
          </button>

          <div className="hidden sm:flex items-center gap-3 bg-white/5 px-4 py-2 border border-white/10">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{t.progress}</span>
            <div className="flex items-center gap-1">
              <span className="text-lg font-display font-black text-red-600 leading-none">{slides.length}</span>
              <span className="text-[10px] font-bold text-white/40 uppercase self-end mb-0.5">{t.sections}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <motion.div 
        className="h-1 bg-red-600 z-30 origin-left sticky top-0"
        style={{ scaleX }}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[320px] bg-gradient-to-b from-slate-900 via-slate-900 to-primary p-8 flex flex-col gap-8 shrink-0 overflow-y-auto custom-scrollbar text-white relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center pb-8 border-b border-white/10 relative z-10"
          >
            <div 
              className="relative w-36 h-36 mx-auto mb-6 group cursor-pointer"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="absolute inset-0 bg-red-600/20 rounded-full blur-2xl animate-pulse"></div>
              
              <div 
                className="relative w-full h-full bg-slate-800 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]"
              >
                <img 
                  src="/profile_picture.jpg"
                  alt="Bhuvan Dahal" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                <AnimatePresence>
                  {isHovered && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]"
                    >
                      <div className="flex flex-col items-center text-white">
                        <Camera className="w-8 h-8 mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-tight">परिवर्तन गर्नुहोस्</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <h2 className="text-3xl font-display font-black mb-1 tracking-tighter text-red-500 uppercase drop-shadow-sm">{t.appTitle}</h2>
            <div className="inline-block px-3 py-1 bg-red-600 text-white rounded-none mb-2 shadow-inner">
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">{t.role}</p>
            </div>
          </motion.div>

          <div className="flex flex-col gap-4 relative z-10">
            <h3 className="text-[10px] items-center gap-2 font-black uppercase tracking-[0.3em] text-red-500/80 mb-2 flex before:content-[''] before:w-2 before:h-2 before:bg-red-600">{t.personalDetails}</h3>
            {[
              { Icon: Calendar, label: t.birthDate, val: t.birthDateVal },
              { Icon: MapPin, label: t.address, val: t.addressVal },
              { Icon: Mail, label: t.email, val: "dahal.bhuvan55@gmail.com", isEmail: true },
              { Icon: Briefcase, label: t.workplace, val: t.workplaceVal },
              { Icon: Facebook, label: t.socialMedia, val: "facebook.com/bhuvan.dahal" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                className="flex items-start gap-4"
              >
                <item.Icon className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase text-white/30 font-bold tracking-tighter">{item.label}</p>
                  <p className={`text-sm text-white/90 ${item.isEmail ? 'break-all' : 'leading-snug whitespace-pre-line'}`}>
                    {item.val}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center gap-3 relative z-10 no-print">
            <div className="w-24 h-24 bg-white p-1.5 rounded-lg overflow-hidden shadow-2xl">
              <img 
                src="/contact_qr.png" 
                alt="Contact QR" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer" 
              />
            </div>
            <p className="text-[8px] font-bold text-white/60 uppercase tracking-widest text-center leading-tight">
              {t.contactQrNote}
            </p>
          </div>

          <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-3 relative z-10">
            <h3 className="text-[10px] items-center gap-2 font-black uppercase tracking-[0.3em] text-red-500/80 mb-2 flex before:content-[''] before:w-2 before:h-2 before:bg-red-600">{t.interests}</h3>
            <div className="flex flex-wrap gap-2">
              {t.interestsList.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-white/5 text-[9px] font-black uppercase rounded-none border border-white/10 text-white/60 hover:bg-red-600 hover:text-white transition-all cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content (Slides) */}
        <main ref={mainRef} className="flex-1 bg-surface p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          <div className="relative max-w-xl no-print">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-primary/30" />
            </div>
            <input
              type="text"
              dir="ltr"
              value={slideSearchQuery}
              onChange={(e) => setSlideSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="block w-full pl-10 pr-3 py-3 border border-border bg-white text-sm text-left placeholder-primary/20 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600/50 transition-all shadow-sm"
            />
            {slideSearchQuery && (
              <button
                onClick={() => setSlideSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-primary/30 hover:text-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSlides.map((slide, idx) => (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.7, delay: idx % 6 * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="tile flex flex-col h-full relative overflow-hidden group/card"
              >
                <div className="absolute -right-4 -top-8 text-[120px] font-display font-black text-primary/5 select-none pointer-events-none group-hover/card:text-primary/10 transition-colors duration-500">
                  {slide.id}
                </div>
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: (idx % 6 * 0.1) + 0.3, duration: 0.5 }}
                  className="flex items-center justify-between mb-6 relative z-10"
                >
                  <div className="flex items-center gap-3">
                    <span className="tile-title m-0">{slide.title}</span>
                    <button 
                      type="button"
                      onClick={() => setIsPrintPreviewOpen(true)}
                      className="relative z-10 no-print p-1 text-primary/30 hover:text-primary transition-colors"
                      title={t.printPreview}
                    >
                      <Printer className="w-3 h-3 text-blue-500" />
                    </button>
                  </div>
                  <motion.div 
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className="p-2 bg-primary/5 rounded-none text-primary"
                  >
                    {slide.icon}
                  </motion.div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: (idx % 6 * 0.1) + 0.5, duration: 0.6 }}
                  className="tile-content text-text/80 flex-1 relative z-10"
                >
                  {slide.content}
                </motion.div>
                <div className="mt-8 pt-4 border-t border-border flex justify-end relative z-10">
                   <span className="text-[10px] uppercase font-black text-text/40 tracking-widest">Section {slide.id}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="h-20 bg-primary/5 border-t border-border flex items-center justify-between px-10 shrink-0">
        <div className="flex flex-col gap-1">
          <div className="text-[10px] text-primary/40 font-black uppercase tracking-widest">
            {t.copyright}
          </div>
          <div className="text-[10px] text-primary/40 font-medium">
            {t.rights}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsFeedbackModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 text-primary hover:bg-white/20 transition-all border border-primary/20 font-bold text-[10px] uppercase tracking-widest shadow-sm"
          >
            <MessageSquare className="w-4 h-4 text-red-600" />
            {t.feedback}
          </button>
          <button 
            onClick={updateCvUrl}
            className="p-2.5 bg-white/10 text-white hover:bg-white/20 transition-all border border-white/20"
            title="CV लिङ्क अपडेट गर्नुहोस्"
          >
            <PenTool className="w-4 h-4" />
          </button>
          <a
            href={cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (cvUrl.includes("example.com")) {
                e.preventDefault();
                setIsPrintPreviewOpen(true);
              }
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-none font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg group"
          >
            <FileDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            {t.downloadCV}
          </a>
        </div>
      </footer>

      <AnimatePresence>
        {isPrintPreviewOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/90 z-[200] overflow-y-auto scroll-smooth print-preview-modal"
          >
            <div className="min-h-screen py-10 px-4">
              <div className="max-w-[210mm] mx-auto mb-8 flex items-center justify-between sticky top-0 bg-slate-900/80 backdrop-blur-md p-4 z-50 border border-white/10 no-print">
                <div className="flex items-center gap-4">
                  <Printer className="text-blue-500 w-6 h-6" />
                  <h2 className="text-xl font-display font-black text-white uppercase tracking-widest">{t.printPreview}</h2>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsPrintPreviewOpen(false)}
                    className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all"
                  >
                    {t.closePreview}
                  </button>
                  <button 
                    onClick={() => {
                      handlePrint();
                    }}
                    className="px-8 py-2 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest shadow-xl transition-all flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4 text-white" /> {t.print}
                  </button>
                </div>
              </div>

              <div className="print-preview-container print-preview-mode animate-in fade-in zoom-in duration-500">
                {/* Simulated Print Content */}
                <aside>
                  <div className="relative w-40 h-40 mx-auto mb-8">
                    <img 
                      src="/profile_picture.jpg"
                      alt="Bhuvan Dahal" 
                      className="w-full h-full object-cover rounded-full border-4 border-emerald-900/10 shadow-sm"
                    />
                  </div>
                  <h2 className="font-display">{t.appTitle}</h2>
                  <div className="inline-block bg-red-600">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em]">{t.role}</p>
                  </div>

                  <div className="flex flex-col gap-8 mt-10">
                    <div className="text-left">
                       <h3 className="text-[10px] items-center gap-2 font-black uppercase tracking-[0.3em] text-red-500/80 mb-4 flex before:content-[''] before:w-2 before:h-2 before:bg-red-600">
                        {t.personalDetails}
                      </h3>
                      <div className="flex flex-col gap-4">
                        {[
                          { Icon: Calendar, label: t.birthDate, val: t.birthDateVal },
                          { Icon: MapPin, label: t.address, val: t.addressVal },
                          { Icon: Mail, label: t.email, val: "dahal.bhuvan55@gmail.com" },
                          { Icon: Briefcase, label: t.workplace, val: t.workplaceVal },
                          { Icon: Facebook, label: t.socialMedia, val: "facebook.com/bhuvan.dahal" }
                        ].map((item, i) => (
                          <div key={i} className="flex items-start gap-4">
                            <item.Icon className="w-4 h-4 text-red-500 mt-1 shrink-0" />
                            <div>
                              <p className="text-[10px] uppercase text-white/40 font-black tracking-tighter">{item.label}</p>
                              <p className="text-sm text-white/90 leading-snug whitespace-pre-line">
                                {item.val}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-left border-t border-gray-100 pt-6">
                      <h3 className="text-[10px] items-center gap-2 font-black uppercase tracking-[0.3em] text-red-500/80 mb-4 flex before:content-[''] before:w-2 before:h-2 before:bg-red-600">
                        {t.interests}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {t.interestsList.map((tag: string) => (
                          <span key={tag} className="px-2 py-1 bg-white/5 text-[9px] font-black uppercase border border-white/10 text-white/60">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col items-center gap-4 p-6 bg-slate-900 border border-white/10 text-center">
                      <div className="w-28 h-28 bg-white p-2 rounded-xl">
                        <img 
                          src="/contact_qr.png" 
                          alt="QR Code" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-red-500">{t.contactQrNote}</p>
                    </div>
                  </div>
                </aside>

                <main className="mt-12">
                  <div className="grid grid-cols-1 gap-8">
                    {slides.map((slide) => (
                      <div key={slide.id} className="tile">
                        <div className="flex items-center justify-between mb-2">
                          <span className="tile-title text-xl font-display font-black uppercase tracking-tight">{slide.title}</span>
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Section {slide.id}</span>
                        </div>
                        <div className="text-[15px] text-gray-800 leading-relaxed font-medium">
                          {slide.content}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-24 pt-12 border-t border-gray-100 text-center pb-8">
                    <p className="text-[11px] font-black uppercase tracking-[0.5em] text-gray-300">{t.copyright}</p>
                    <p className="text-[9px] uppercase text-gray-200 mt-3 tracking-[0.3em] font-bold">{t.rights}</p>
                  </div>
                </main>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
