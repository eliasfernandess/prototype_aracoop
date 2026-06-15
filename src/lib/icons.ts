import {
  Link2, CreditCard, Sparkles, Leaf, Shield, Gift,
  MessageCircle, Instagram, Globe, Zap, Star, User,
  TrendingUp, Home, Heart, Phone, BookOpen, Award,
  type LucideProps,
} from 'lucide-react'
import type { ComponentType } from 'react'

export const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  'link': Link2,
  'credit-card': CreditCard,
  'sparkles': Sparkles,
  'leaf': Leaf,
  'shield': Shield,
  'gift': Gift,
  'message-circle': MessageCircle,
  'instagram': Instagram,
  'globe': Globe,
  'zap': Zap,
  'star': Star,
  'user': User,
  'trending-up': TrendingUp,
  'home': Home,
  'heart': Heart,
  'phone': Phone,
  'book-open': BookOpen,
  'award': Award,
  'gavel': Award, // fallback
}

export const ICON_OPTIONS = [
  { id: 'link', label: 'Link' },
  { id: 'credit-card', label: 'Conta' },
  { id: 'sparkles', label: 'Campanha' },
  { id: 'leaf', label: 'Agro' },
  { id: 'shield', label: 'Seguro' },
  { id: 'gift', label: 'Consórcio' },
  { id: 'message-circle', label: 'WhatsApp' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'globe', label: 'Web' },
  { id: 'zap', label: 'Destaque' },
  { id: 'star', label: 'Estrela' },
  { id: 'user', label: 'Pessoa' },
  { id: 'trending-up', label: 'Investimento' },
  { id: 'phone', label: 'Telefone' },
  { id: 'award', label: 'Prêmio' },
  { id: 'heart', label: 'Saúde' },
]

export const COLOR_OPTIONS = [
  '#00B4A0',
  '#0D2B1E',
  '#16A34A',
  '#F59E0B',
  '#E84062',
  '#3B82F6',
  '#7C3AED',
  '#0F766E',
  '#25D366',
  '#E1306C',
  '#1A56DB',
  '#9333EA',
]
