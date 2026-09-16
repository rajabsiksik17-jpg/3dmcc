import type { LucideIcon, LucideProps } from "lucide-react";
import {
  Airplay, AlertCircle, AlertTriangle, Award, Banknote, BarChart3, Bell, BookMarked,
  BookOpen, Briefcase, Building, Building2, Calculator, Calendar, CalendarDays, Camera,
  Check, CheckCircle2, ClipboardCheck, ClipboardList, Clock, Cloud, Cog, Compass, Cpu,
  Database, Download, Eye, File, FileText, Film, Filter, Flag, Folder, Gauge, Gift,
  Glasses, Globe, GraduationCap, Handshake, Headphones, Heart, HeartHandshake, HelpCircle,
  Home, Hourglass, Image, Info, Key, Landmark, Laptop, Layers, LayoutDashboard, Lightbulb,
  LineChart, Link, Lock, Mail, Map, MapPin, Medal, MessageCircle, Mic, Monitor,
  MonitorSmartphone, Music, Network, Package, Paperclip, PenTool, Pencil, PencilRuler,
  Phone, PhoneCall, PieChart, PiggyBank, Printer, Puzzle, RefreshCw, Rocket, Scale, School,
  Search, Send, Server, Settings, Share2, ShieldCheck, ShoppingCart, Smartphone, Sparkles,
  Star, Target, ThumbsUp, Timer, TrendingUp, Trophy, Truck, Upload, UserCheck, UserPlus,
  Users, Video, Wallet, Wifi, Workflow, Wrench, XCircle, Zap,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  Airplay, AlertCircle, AlertTriangle, Award, Banknote, BarChart3, Bell, BookMarked,
  BookOpen, Briefcase, Building, Building2, Calculator, Calendar, CalendarDays, Camera,
  Check, CheckCircle2, ClipboardCheck, ClipboardList, Clock, Cloud, Cog, Compass, Cpu,
  Database, Download, Eye, File, FileText, Film, Filter, Flag, Folder, Gauge, Gift,
  Glasses, Globe, GraduationCap, Handshake, Headphones, Heart, HeartHandshake, HelpCircle,
  Home, Hourglass, Image, Info, Key, Landmark, Laptop, Layers, LayoutDashboard, Lightbulb,
  LineChart, Link, Lock, Mail, Map, MapPin, Medal, MessageCircle, Mic, Monitor,
  MonitorSmartphone, Music, Network, Package, Paperclip, PenTool, Pencil, PencilRuler,
  Phone, PhoneCall, PieChart, PiggyBank, Printer, Puzzle, RefreshCw, Rocket, Scale, School,
  Search, Send, Server, Settings, Share2, ShieldCheck, ShoppingCart, Smartphone, Sparkles,
  Star, Target, ThumbsUp, Timer, TrendingUp, Trophy, Truck, Upload, UserCheck, UserPlus,
  Users, Video, Wallet, Wifi, Workflow, Wrench, XCircle, Zap,
};

export function DynamicIcon({ name, ...props }: { name?: string | null } & Omit<LucideProps, "name">) {
  const Icon = (name && ICONS[name]) || Sparkles;
  return <Icon {...props} />;
}
