"use client";

import { useMemo, useState } from "react";
import {
  Briefcase, Building2, Target, TrendingUp, BarChart3, LineChart, PieChart, Wallet,
  PiggyBank, Calculator, Landmark, Banknote, Scale, Handshake, HeartHandshake, Users,
  UserPlus, UserCheck, ShieldCheck, Lock, Key, Globe, MapPin, Map, Compass, Flag, Award,
  Trophy, Medal, Star, Sparkles, Zap, Rocket, Lightbulb, Settings, Wrench, Cog, Cpu,
  Database, Cloud, Server, Wifi, Smartphone, Monitor, MonitorSmartphone, Laptop, Camera,
  Video, Film, Music, Image, FileText, File, Folder, ClipboardList, ClipboardCheck,
  Calendar, CalendarDays, Clock, Timer, Hourglass, Bell, Mail, MessageCircle, Phone,
  PhoneCall, Send, Share2, Link, Paperclip, Download, Upload, Search, Filter, RefreshCw,
  Check, CheckCircle2, XCircle, AlertCircle, AlertTriangle, Info, HelpCircle, Eye,
  Home, BookOpen, GraduationCap, School, PenTool, Pencil, PencilRuler, Building, Truck,
  ShoppingCart, Package, Tag, Gift, Heart, ThumbsUp, Layers, LayoutDashboard, Network,
  Workflow, Puzzle, Gauge, Glasses, Mic, Headphones, Airplay, Printer,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  name: string;
  icons: [string, LucideIcon][];
}

const CATEGORIES: Category[] = [
  {
    name: "Business",
    icons: [
      ["Briefcase", Briefcase], ["Building2", Building2], ["Target", Target], ["TrendingUp", TrendingUp],
      ["BarChart3", BarChart3], ["LineChart", LineChart], ["PieChart", PieChart], ["Wallet", Wallet],
      ["PiggyBank", PiggyBank], ["Calculator", Calculator], ["Landmark", Landmark], ["Banknote", Banknote],
      ["Scale", Scale], ["Handshake", Handshake], ["HeartHandshake", HeartHandshake], ["Users", Users],
      ["UserPlus", UserPlus], ["UserCheck", UserCheck], ["ShieldCheck", ShieldCheck], ["Lock", Lock],
    ],
  },
  {
    name: "Design",
    icons: [
      ["PenTool", PenTool], ["Pencil", Pencil], ["PencilRuler", PencilRuler], ["Layers", Layers],
      ["Workflow", Workflow], ["Puzzle", Puzzle], ["Gauge", Gauge],
      ["LayoutDashboard", LayoutDashboard], ["Network", Network], ["Glasses", Glasses],
      ["Image", Image], ["Camera", Camera], ["Film", Film], ["Video", Video],
    ],
  },
  {
    name: "Technology",
    icons: [
      ["Cpu", Cpu], ["Database", Database], ["Cloud", Cloud], ["Server", Server], ["Wifi", Wifi],
      ["Smartphone", Smartphone], ["Monitor", Monitor], ["MonitorSmartphone", MonitorSmartphone],
      ["Laptop", Laptop], ["Settings", Settings], ["Wrench", Wrench], ["Cog", Cog], ["Key", Key],
      ["Mic", Mic], ["Headphones", Headphones], ["Printer", Printer],
    ],
  },
  {
    name: "Communication",
    icons: [
      ["Mail", Mail], ["MessageCircle", MessageCircle], ["Phone", Phone], ["PhoneCall", PhoneCall],
      ["Send", Send], ["Share2", Share2], ["Link", Link], ["Paperclip", Paperclip], ["Bell", Bell],
      ["Globe", Globe], ["MapPin", MapPin], ["Map", Map], ["Compass", Compass], ["Flag", Flag],
    ],
  },
  {
    name: "Content",
    icons: [
      ["FileText", FileText], ["File", File], ["Folder", Folder], ["ClipboardList", ClipboardList],
      ["ClipboardCheck", ClipboardCheck], ["BookOpen", BookOpen], ["GraduationCap", GraduationCap],
      ["School", School], ["Home", Home], ["Lightbulb", Lightbulb],
    ],
  },
  {
    name: "Actions",
    icons: [
      ["Search", Search], ["Filter", Filter], ["RefreshCw", RefreshCw], ["Download", Download],
      ["Upload", Upload], ["Check", Check], ["CheckCircle2", CheckCircle2], ["XCircle", XCircle],
      ["Eye", Eye], ["Send", Send],
    ],
  },
  {
    name: "Achievements",
    icons: [
      ["Award", Award], ["Trophy", Trophy], ["Medal", Medal], ["Star", Star], ["Sparkles", Sparkles],
      ["Zap", Zap], ["Rocket", Rocket], ["ThumbsUp", ThumbsUp], ["Heart", Heart], ["Gift", Gift],
    ],
  },
  {
    name: "Status",
    icons: [
      ["AlertCircle", AlertCircle], ["AlertTriangle", AlertTriangle], ["Info", Info], ["HelpCircle", HelpCircle],
      ["Clock", Clock], ["Timer", Timer], ["Hourglass", Hourglass], ["Calendar", Calendar],
      ["CalendarDays", CalendarDays], ["Truck", Truck], ["ShoppingCart", ShoppingCart], ["Package", Package],
      ["Tag", Tag], ["Building", Building], ["Music", Music], ["Airplay", Airplay],
    ],
  },
];

const ALL = CATEGORIES.flatMap((c) => c.icons);

export function IconPicker({
  value,
  onChange,
  onClear,
}: {
  value?: string | null;
  onChange?: (name: string) => void;
  onClear?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const source = category === "All" ? ALL : CATEGORIES.find((c) => c.name === category)?.icons ?? [];
    return source.filter(([name]) => !q || name.toLowerCase().includes(q));
  }, [query, category]);

  const SelectedIcon = value ? ALL.find(([n]) => n === value)?.[1] : undefined;

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-charcoal-200 bg-white text-charcoal-700 transition-colors hover:border-brand-400"
        >
          {SelectedIcon ? <SelectedIcon className="h-6 w-6 text-brand-600" /> : <Sparkles className="h-6 w-6 text-charcoal-300" />}
        </button>
        <div className="flex-1 text-sm text-charcoal-600">{value ?? "—"}</div>
        {value && (
          <button type="button" onClick={onClear} className="text-xs text-red-500 hover:text-red-600">
            Clear
          </button>
        )}
      </div>

      {open && (
        <div className="absolute z-30 mt-2 w-full min-w-[320px] rounded-2xl border border-charcoal-200 bg-white p-4 shadow-lift">
          <div className="mb-3 flex items-center gap-2">
            <Search className="h-4 w-4 text-charcoal-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search icons..."
              className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-charcoal-400"
            />
          </div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {["All", ...CATEGORIES.map((c) => c.name)].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  category === c ? "bg-brand-500 text-white" : "bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200"
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="grid max-h-64 grid-cols-6 gap-1 overflow-y-auto">
            {filtered.map(([name, Icon]) => (
              <button
                key={name}
                type="button"
                title={name}
                onClick={() => {
                  onChange?.(name);
                  setOpen(false);
                }}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-brand-50",
                  value === name ? "bg-brand-500 text-white" : "text-charcoal-600"
                )}
              >
                <Icon className="h-5 w-5" />
              </button>
            ))}
          </div>
          {filtered.length === 0 && <p className="py-4 text-center text-sm text-charcoal-400">No icons found</p>}
        </div>
      )}
    </div>
  );
}
