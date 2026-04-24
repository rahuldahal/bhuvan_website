/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import { User, Calendar, MapPin, Mail, Briefcase, FileDown, PenTool, Music, Cpu, MessageSquare, Phone, Facebook, Globe, Camera, Trash2, X, CheckCircle2, Play, Pause, Volume2, Upload, Loader2, Languages, Save, Info } from "lucide-react";
import { translations, Language } from "./translations";
import ExifReader from 'exifreader';

const CV_URL = "https://example.com/bhuvan-dahal-cv.pdf"; // Updated CV URL

const CustomAudioPlayer = ({ url, onUpload, id }: { url: string; onUpload?: (id: string, file: File) => void; id?: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
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
    <div className="flex flex-col gap-2 w-full bg-primary/5 p-3 border border-primary/10 relative group/player">
      <audio ref={audioRef} src={url} onEnded={() => setIsPlaying(false)} />
      <div className="flex items-center gap-4">
        <button 
          onClick={togglePlay}
          className="w-10 h-10 rounded-none bg-primary text-white flex items-center justify-center hover:bg-slate-800 transition-colors shadow-sm"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
        </button>
        
        <div className="flex-1 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-primary opacity-60" />
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume} 
            onChange={handleVolumeChange}
            className="flex-1 h-1 bg-primary/20 accent-primary appearance-none cursor-pointer rounded-none"
          />
        </div>
        
        <div className="text-[10px] font-black uppercase tracking-widest text-primary/40 hidden xl:block">
          {isPlaying ? "बजिरहेको छ" : "प्ले गर्नुहोस्"}
        </div>
      </div>
    </div>
  );
};

interface AiPhoto {
  url: string;
  caption: string;
  exif?: Record<string, any>;
}

const getSlides = (
  customAudio: Record<string, string>, 
  handleAudioUpload: (id: string, file: File) => void,
  aiPhotos: AiPhoto[],
  pendingAiPhotos: AiPhoto[],
  onAiPhotoUpload: (files: FileList) => void,
  onAiPhotoDelete: (index: number) => void,
  onAiCaptionChange: (index: number, caption: string, isPending: boolean) => void,
  onSaveDraft: () => void,
  onDiscardPending: (index: number) => void,
  isAiPhotoLoading: boolean,
  aiPhotoSuccess: boolean,
  isAiDraftSaving: boolean,
  onPhotoClick: (index: number) => void,
  aiUploadQueue: { id: string; name: string; progress: number }[],
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
          <p className="text-gray-700">
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
        <p className="text-gray-700 leading-relaxed text-sm">
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
            <div className="text-[13px] leading-relaxed italic whitespace-pre-line border-l-2 border-primary/20 pl-4 py-1 text-gray-700">
              {poem.content || poem.intro}
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
          <p className="text-gray-700 leading-relaxed font-medium">
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
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {aiPhotos.map((photo, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-square group/pic bg-purple-50 overflow-hidden border-2 border-white shadow-sm cursor-zoom-in"
                onClick={() => onPhotoClick(index)}
              >
                <img src={photo.url} alt={`AI Fav ${index}`} className="w-full h-full object-cover transition-transform duration-500 group-hover/pic:scale-110" referrerPolicy="no-referrer" />
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-1.5 translate-y-full group-hover/pic:translate-y-0 transition-transform">
                    <p className="text-[9px] text-white font-medium line-clamp-1">{photo.caption}</p>
                  </div>
                )}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAiPhotoDelete(index);
                  }}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover/pic:opacity-100 transition-all hover:bg-black z-10"
                  title={t.aiPhotoDelete}
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
            
            {aiPhotos.length + pendingAiPhotos.length < 25 && (
              <div 
                className="relative aspect-square bg-purple-100/50 flex flex-col items-center justify-center border-2 border-dashed border-purple-200 group/upload cursor-pointer hover:bg-purple-100 transition-all"
                onClick={() => document.getElementById('ai-photo-upload')?.click()}
              >
                <Upload className="w-6 h-6 text-purple-400 group-hover/upload:scale-110 transition-transform" />
                <span className="text-[8px] font-bold text-purple-500 uppercase mt-2 tracking-widest">{t.aiPhotoChoose}</span>
                <span className="text-[7px] text-purple-400/60 mt-0.5">{aiPhotos.length + pendingAiPhotos.length}/25</span>

                <AnimatePresence>
                  {aiUploadQueue.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-purple-900/90 backdrop-blur-md p-3 flex flex-col gap-2 overflow-y-auto custom-scrollbar z-20"
                    >
                      <h4 className="text-[8px] font-black uppercase tracking-widest text-white mb-1 flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin" /> {t.aiPhotoUploading}
                      </h4>
                      {aiUploadQueue.map((item) => (
                        <div key={item.id} className="w-full space-y-1">
                          <div className="flex justify-between items-center text-[7px] font-bold text-purple-200">
                            <span className="truncate max-w-[80%]">{item.name}</span>
                            <span>{item.progress}%</span>
                          </div>
                          <div className="w-full h-0.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${item.progress}%` }}
                              className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                            />
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {aiPhotoSuccess && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="absolute inset-0 bg-emerald-600/90 backdrop-blur-[2px] flex items-center justify-center text-white z-20"
                    >
                      <CheckCircle2 className="w-8 h-8 text-white shadow-sm" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Pending Section */}
          <AnimatePresence>
            {pendingAiPhotos.length > 0 && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-3 overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-purple-600 flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-pulse" />
                     {t.aiPhotoPendingTitle}
                  </h4>
                  <button 
                    onClick={onSaveDraft}
                    disabled={isAiDraftSaving}
                    className="px-3 py-1.5 bg-purple-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-none hover:bg-black transition-all flex items-center gap-2 disabled:bg-gray-400"
                  >
                    {isAiDraftSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-6 h-6" />}
                    {t.aiPhotoSaveDraft}
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {pendingAiPhotos.map((photo, i) => (
                    <div key={i} className="flex gap-3 p-2 bg-purple-50/50 border border-purple-100 rounded-lg group shadow-sm">
                       <div className="relative w-14 h-14 shrink-0">
                          <img src={photo.url} className="w-full h-full object-cover rounded border border-purple-200" alt="Pending" />
                          <button 
                            onClick={() => onDiscardPending(i)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                          >
                            <X className="w-3 h-3" />
                          </button>
                       </div>
                       <div className="flex-1 flex flex-col gap-1">
                          <label className="text-[8px] font-black uppercase text-purple-400 tracking-tighter">{t.aiPhotoEditCaption}</label>
                          <input 
                            type="text"
                            value={photo.caption}
                            onChange={(e) => onAiCaptionChange(i, e.target.value, true)}
                            placeholder={t.aiPhotoCaptionPlaceholder}
                            className="w-full bg-white border border-purple-200 px-2 py-1 text-[11px] focus:outline-none focus:border-purple-500 rounded font-medium text-slate-700 shadow-inner"
                          />
                       </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <input 
            type="file" 
            id="ai-photo-upload" 
            className="hidden" 
            accept="image/*" 
            multiple
            disabled={isAiPhotoLoading}
            onChange={(e) => {
              const files = e.target.files;
              if (files) onAiPhotoUpload(files);
            }}
          />
          <p className="text-[9px] text-purple-400 font-bold uppercase text-center tracking-[0.2em]">{t.aiPhotoPrompt}</p>
        </div>

          <p className="text-gray-700 leading-relaxed text-sm">
            {ts["07"].intro}
          </p>

          <div className="space-y-4">
            {ts["07"].topics.map((topic, i) => (
              <div key={i} className="flex gap-4 items-start group">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                  <span className="text-xs font-bold font-mono">०{i + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900 mb-1">{topic.title}</h4>
                  <p className="text-[12px] text-gray-500 leading-normal">{topic.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 p-3 bg-emerald-50/50 rounded-xl border-t-2 border-primary/20">
            <div className="flex items-center gap-2 mb-2 text-primary">
              <MessageSquare className="w-4 h-4" />
              <h4 className="text-[11px] font-bold uppercase tracking-wider">{t.aiAdminImpact}</h4>
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
          <p className="text-gray-700 leading-relaxed text-sm">
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
      id: "12",
      title: ts["12"].title,
      icon: <CheckCircle2 className="w-5 h-5" />,
      content: (
        <div className="max-h-[400px] overflow-y-auto pr-3 custom-scrollbar flex flex-col gap-6">
          <p className="text-gray-700 leading-relaxed text-sm">
            {ts["12"].desc}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ts["12"].skillGroups.map((group, i) => (
              <div key={i} className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
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
      id: "11",
      title: ts["11"].title,
      icon: <Phone className="w-5 h-5" />,
      content: (
        <div className="flex flex-col gap-4">
          <p className="text-gray-700 text-sm">
            {ts["11"].desc}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <a href="mailto:dahal.bhuvan55@gmail.com" className="flex items-center gap-2 p-2 bg-background rounded border border-border hover:border-primary transition-colors">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold uppercase">{t.contactMail}</span>
            </a>
            <a href="https://facebook.com/bhuvan.dahal" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-background rounded border border-border hover:border-[#1877F2] transition-colors">
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
          <div className="flex flex-col items-center gap-2 mt-2 p-3 bg-surface rounded-lg border border-emerald-100 shadow-sm">
            <div className="w-24 h-24 p-1 border border-primary/20 rounded-xl overflow-hidden bg-white shadow-inner flex items-center justify-center">
              <img 
                src="/contact_qr.png" 
                alt="Contact QR" 
                className="w-[90%] h-[90%] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-[9px] font-bold text-emerald-600/50 uppercase">{t.contactQrNote}</span>
          </div>
        </div>
      )
    }
  ];
}

export default function App() {
  const [profilePic, setProfilePic] = useState<string>('/profile_picture.png');
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customAudio, setCustomAudio] = useState<Record<string, string>>({});
  const [aiPhotos, setAiPhotos] = useState<AiPhoto[]>(() => {
    const saved = localStorage.getItem("bhuvan_ai_photos");
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      // Migration: support both string (legacy) and object (new)
      return parsed.map((item: any) => 
        typeof item === 'string' ? { url: item, caption: "" } : item
      );
    } catch {
      return [];
    }
  });
  const [pendingAiPhotos, setPendingAiPhotos] = useState<AiPhoto[]>([]);
  const [isAiPhotoLoading, setIsAiPhotoLoading] = useState(false);
  const [aiPhotoSuccess, setAiPhotoSuccess] = useState(false);
  const [isAiDraftSaving, setIsAiDraftSaving] = useState(false);
  const [aiUploadQueue, setAiUploadQueue] = useState<{ id: string; name: string; progress: number }[]>([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [showExif, setShowExif] = useState(false);
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem("bhuvan_lang") as Language) || "np");

  useEffect(() => {
    localStorage.setItem("bhuvan_lang", lang);
  }, [lang]);

  const t = translations[lang];

  useEffect(() => {
    setShowExif(false);
  }, [selectedPhotoIndex]);

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

  const handleAiPhotoUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    
    if (aiPhotos.length + pendingAiPhotos.length + fileArray.length > 25) {
      alert(t.aiPhotoLimit);
      return;
    }

    setIsAiPhotoLoading(true);
    setAiPhotoSuccess(false);

    // Initialize upload queue
    const initialQueue = fileArray.map((f, i) => ({ 
      id: `up-${Date.now()}-${i}`, 
      name: f.name, 
      progress: 0 
    }));
    setAiUploadQueue(initialQueue);

    const processFile = (file: File, id: string): Promise<AiPhoto> => {
      return new Promise((resolve, reject) => {
        if (file.size > 5 * 1024 * 1024) {
          reject(new Error("File too large"));
          return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
          let exifData: Record<string, any> | undefined;
          try {
            const tags = ExifReader.load(reader.result as ArrayBuffer);
            const data: Record<string, any> = {};
            if (tags.Make) data.make = tags.Make.description;
            if (tags.Model) data.model = tags.Model.description;
            if (tags.DateTimeOriginal) data.date = tags.DateTimeOriginal.description;
            if (tags.Software) data.software = tags.Software.description;
            if (tags.ImageWidth) data.width = tags.ImageWidth.value;
            if (tags.ImageHeight) data.height = tags.ImageHeight.value;
            if (Object.keys(data).length > 0) exifData = data;
          } catch (e) {
            console.warn("EXIF failed:", e);
          }

          const dataReader = new FileReader();
          dataReader.onloadend = () => {
            const img = new Image();
            img.onload = async () => {
              setAiUploadQueue(prev => prev.map(item => item.id === id ? { ...item, progress: 30 } : item));
              
              const canvas = document.createElement('canvas');
              let width = img.width;
              let height = img.height;
              const MAX_WIDTH = 1200; 
              const MAX_HEIGHT = 1200;

              if (width > height) {
                if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
                }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                setAiUploadQueue(prev => prev.map(item => item.id === id ? { ...item, progress: 70 } : item));
                await new Promise(r => setTimeout(r, 400));
                setAiUploadQueue(prev => prev.map(item => item.id === id ? { ...item, progress: 100 } : item));
                resolve({ 
                  url: canvas.toDataURL('image/jpeg', 0.75), 
                  caption: "",
                  exif: exifData 
                });
              } else {
                reject(new Error("Canvas context failed"));
              }
            };
            img.src = dataReader.result as string;
          };
          dataReader.readAsDataURL(file);
        };
        reader.readAsArrayBuffer(file);
      });
    };

    try {
      const results = await Promise.all(fileArray.map((file, i) => processFile(file, initialQueue[i].id)));
      setPendingAiPhotos(prev => [...prev, ...results]);
      
      await new Promise(r => setTimeout(r, 500));
      
      setAiUploadQueue([]);
      setIsAiPhotoLoading(false);
      setAiPhotoSuccess(true);
      setTimeout(() => setAiPhotoSuccess(false), 3000);
    } catch (error) {
      console.error("Upload error:", error);
      alert(t.aiPhotoStorageError);
      setIsAiPhotoLoading(false);
      setAiUploadQueue([]);
    }
  };

  const handleAiPhotoDelete = (index: number) => {
    if (confirm(t.removePhotoConfirm)) {
      const updatedPhotos = aiPhotos.filter((_, i) => i !== index);
      setAiPhotos(updatedPhotos);
      localStorage.setItem("bhuvan_ai_photos", JSON.stringify(updatedPhotos));
    }
  };

  const mainRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ container: mainRef });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleSaveAiDraft = () => {
    if (pendingAiPhotos.length === 0) return;
    
    setIsAiDraftSaving(true);
    setTimeout(() => {
      const updatedPhotos = [...aiPhotos, ...pendingAiPhotos];
      setAiPhotos(updatedPhotos);
      localStorage.setItem("bhuvan_ai_photos", JSON.stringify(updatedPhotos));
      setPendingAiPhotos([]);
      setIsAiDraftSaving(false);
      setAiPhotoSuccess(true);
      setTimeout(() => setAiPhotoSuccess(false), 3000);
    }, 1000);
  };

  const handleDiscardPending = (index: number) => {
    setPendingAiPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleAiCaptionChange = (index: number, caption: string, isPending: boolean) => {
    if (isPending) {
      setPendingAiPhotos(prev => prev.map((p, i) => i === index ? { ...p, caption } : p));
    } else {
      setAiPhotos(prev => {
        const updated = prev.map((p, i) => i === index ? { ...p, caption } : p);
        localStorage.setItem("bhuvan_ai_photos", JSON.stringify(updated));
        return updated;
      });
    }
  };

  const slides = getSlides(customAudio, handleAudioUpload, aiPhotos, pendingAiPhotos, handleAiPhotoUpload, handleAiPhotoDelete, handleAiCaptionChange, handleSaveAiDraft, handleDiscardPending, isAiPhotoLoading, aiPhotoSuccess, isAiDraftSaving, setSelectedPhotoIndex, aiUploadQueue, lang);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert("कृपया केवल JPG वा PNG फोटोहरू मात्र अपलोड गर्नुहोस्।");
        return;
      }

      // Check file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("फोटो २MB भन्दा कम हुनुपर्छ।");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    if (confirm("के तपाईं यो फोटो हटाउन चाहनुहुन्छ?")) {
      setProfilePic("https://www.newbusinessage.com/img/news/20200115112108_Bhuvan_Dahal.jpg");
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
                onClick={() => fileInputRef.current?.click()}
              >
                <img 
                  src='/profile_picture.jpg'
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

              {profilePic !== "https://www.newbusinessage.com/img/news/20200115112108_Bhuvan_Dahal.jpg" && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    removePhoto();
                  }}
                  className="absolute -right-1 bottom-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors z-10"
                  title="फोटो हटाउनुहोस्"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/jpeg, image/png, image/jpg" 
                onChange={handlePhotoUpload}
              />
            </div>
            <h2 className="text-3xl font-display font-black mb-1 tracking-tighter text-red-500 uppercase drop-shadow-sm">{t.appTitle}</h2>
            <div className="inline-block px-3 py-1 bg-red-600 text-white rounded-none mb-2 shadow-inner">
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">{t.role}</p>
            </div>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="block mx-auto text-[10px] font-bold text-white/40 hover:text-red-400 uppercase tracking-widest transition-colors mt-2"
            >
              {t.changePhoto}
            </button>
          </motion.div>

          <div className="flex flex-col gap-4 relative z-10">
            <h3 className="text-[10px] items-center gap-2 font-black uppercase tracking-[0.3em] text-red-500/80 mb-2 flex before:content-[''] before:w-2 before:h-2 before:bg-red-600">{t.personalDetails}</h3>
            <div className="flex items-start gap-4">
              <Calendar className="w-4 h-4 text-red-500 mt-1 shrink-0" />
              <div>
                <p className="text-[10px] uppercase text-white/30 font-bold tracking-tighter">{t.birthDate}</p>
                <p className="text-sm text-white/90 leading-snug whitespace-pre-line">{t.birthDateVal}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="w-4 h-4 text-red-500 mt-1 shrink-0" />
              <div>
                <p className="text-[10px] uppercase text-white/30 font-bold tracking-tighter">{t.address}</p>
                <p className="text-sm text-white/90">{t.addressVal}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="w-4 h-4 text-red-500 mt-1 shrink-0" />
              <div>
                <p className="text-[10px] uppercase text-white/30 font-bold tracking-tighter">{t.email}</p>
                <p className="text-sm text-white/90 break-all">dahal.bhuvan55@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Briefcase className="w-4 h-4 text-red-500 mt-1 shrink-0" />
              <div>
                <p className="text-[10px] uppercase text-white/30 font-bold tracking-tighter">{t.workplace}</p>
                <p className="text-sm text-white/90">{t.workplaceVal}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Facebook className="w-4 h-4 text-red-500 mt-1 shrink-0" />
              <div>
                <p className="text-[10px] uppercase text-white/30 font-bold tracking-tighter">{t.socialMedia}</p>
                <p className="text-sm text-white/90">facebook.com/bhuvan.dahal</p>
              </div>
            </div>
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
        <main ref={mainRef} className="flex-1 bg-surface p-6 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slides.map((slide, idx) => (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="tile flex flex-col h-full relative overflow-hidden"
              >
                <div className="absolute -right-4 -top-8 text-[120px] font-display font-black text-primary/5 select-none pointer-events-none">
                  {slide.id}
                </div>
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <span className="tile-title">{slide.title}</span>
                  <div className="p-2 bg-primary/5 rounded-none text-primary">
                    {slide.icon}
                  </div>
                </div>
                <div className="tile-content text-gray-700 flex-1 relative z-10">
                  {slide.content}
                </div>
                <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end relative z-10">
                   <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Section {slide.id}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="h-20 bg-emerald-50/30 border-t border-border flex items-center justify-between px-10 shrink-0">
        <div className="flex flex-col gap-1">
          <div className="text-[10px] text-emerald-700/40 font-black uppercase tracking-widest">
            {t.copyright}
          </div>
          <div className="text-[10px] text-emerald-700/40 font-medium">
            {t.rights}
          </div>
        </div>
        <div className="flex items-center gap-8">
          <a
            href={CV_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (CV_URL.includes("example.com")) {
                e.preventDefault();
                alert(t.cvNotAvailable);
              }
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-none font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg group"
          >
            <FileDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            {t.downloadCV}
          </a>
        </div>
      </footer>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedPhotoIndex(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
              onClick={() => setSelectedPhotoIndex(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative max-h-[70vh] flex items-center justify-center group/imgcont">
                <img 
                  src={aiPhotos[selectedPhotoIndex].url} 
                  className="max-w-full max-h-full shadow-2xl object-contain border border-white/10" 
                  alt="Full View" 
                  referrerPolicy="no-referrer"
                />
                
                <button 
                  onClick={() => setShowExif(!showExif)}
                  className={`absolute top-4 left-4 p-2 transition-all ${showExif ? 'bg-white text-black' : 'bg-black/50 text-white hover:bg-black'} shadow-lg`}
                  title={t.aiPhotoInfo}
                >
                  <Info className="w-5 h-5" />
                </button>

                <AnimatePresence>
                  {showExif && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="absolute top-16 left-4 bg-black/80 backdrop-blur-xl border border-white/10 p-4 w-64 shadow-2xl z-20"
                    >
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
                        <Camera className="w-3 h-3" /> {t.aiPhotoInfo}
                      </h4>
                      
                      {aiPhotos[selectedPhotoIndex].exif ? (
                        <div className="space-y-3">
                          {aiPhotos[selectedPhotoIndex].exif.make && (
                            <div>
                              <p className="text-[8px] uppercase text-white/30 font-bold tracking-tighter">{t.aiExifCamera}</p>
                              <p className="text-xs text-white/90 font-medium">{aiPhotos[selectedPhotoIndex].exif.make}</p>
                            </div>
                          )}
                          {aiPhotos[selectedPhotoIndex].exif.model && (
                            <div>
                              <p className="text-[8px] uppercase text-white/30 font-bold tracking-tighter">{t.aiExifModel}</p>
                              <p className="text-xs text-white/90 font-medium">{aiPhotos[selectedPhotoIndex].exif.model}</p>
                            </div>
                          )}
                          {aiPhotos[selectedPhotoIndex].exif.date && (
                            <div>
                              <p className="text-[8px] uppercase text-white/30 font-bold tracking-tighter">{t.aiExifDate}</p>
                              <p className="text-[11px] text-white/90 font-medium">{aiPhotos[selectedPhotoIndex].exif.date}</p>
                            </div>
                          )}
                          {aiPhotos[selectedPhotoIndex].exif.software && (
                            <div>
                              <p className="text-[8px] uppercase text-white/30 font-bold tracking-tighter">{t.aiExifSoftware}</p>
                              <p className="text-[10px] text-white/70 font-display italic">{aiPhotos[selectedPhotoIndex].exif.software}</p>
                            </div>
                          )}
                          {aiPhotos[selectedPhotoIndex].exif.width && (
                            <div>
                              <p className="text-[8px] uppercase text-white/30 font-bold tracking-tighter">Resolution</p>
                              <p className="text-[11px] text-white/90 font-mono">{aiPhotos[selectedPhotoIndex].exif.width} × {aiPhotos[selectedPhotoIndex].exif.height} px</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="py-4 flex flex-col items-center gap-2 text-white/30">
                          <Info className="w-6 h-6 opacity-20" />
                          <p className="text-[9px] uppercase font-bold tracking-widest">{t.aiExifNoData}</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="mt-8 w-full max-w-2xl px-6 flex flex-col gap-4">
                <div className="flex flex-col gap-2 items-center text-center">
                  <input 
                    type="text"
                    value={aiPhotos[selectedPhotoIndex].caption}
                    onChange={(e) => handleAiCaptionChange(selectedPhotoIndex, e.target.value, false)}
                    placeholder={t.aiPhotoCaptionPlaceholder}
                    className="w-full bg-white/5 border-b border-white/20 text-white text-center py-2 text-lg focus:outline-none focus:border-white/50 placeholder:text-white/20 font-medium italic"
                  />
                </div>
                <div className="flex justify-between items-center text-white/40">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                    {selectedPhotoIndex + 1} / {aiPhotos.length}
                  </span>
                  <div className="flex gap-8">
                    <button 
                      disabled={selectedPhotoIndex === 0}
                      onClick={() => setSelectedPhotoIndex(prev => prev !== null ? Math.max(0, prev - 1) : null)}
                      className="text-white/40 hover:text-white disabled:opacity-0 transition-all uppercase text-[10px] font-black tracking-widest flex items-center gap-2"
                    >
                      <X className="w-3 h-3 rotate-90" /> PREV
                    </button>
                    <button 
                      disabled={selectedPhotoIndex === aiPhotos.length - 1}
                      onClick={() => setSelectedPhotoIndex(prev => prev !== null ? Math.min(aiPhotos.length - 1, prev + 1) : null)}
                      className="text-white/40 hover:text-white disabled:opacity-0 transition-all uppercase text-[10px] font-black tracking-widest flex items-center gap-2"
                    >
                      NEXT <X className="w-3 h-3 -rotate-90" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
