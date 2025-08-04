// Global type definitions for the DOA project

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  galleryImages?: string[];
  category: 'film' | 'tv' | 'commercial' | 'music-video' | 'special';
  type: string;
  year: number;
  featured: boolean;
  client?: string;
  credits?: {
    director?: string;
    productionDesigner?: string;
    cinematographer?: string;
  };
  technicalDetails?: {
    squareFeet?: number;
    buildDuration?: string;
    specialFeatures?: string[];
  };
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  quote: string;
  imageUrl?: string;
  rating: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  projectType: 'film' | 'tv' | 'commercial' | 'other';
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error types
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'punk';

export interface ThemeConfig {
  mode: ThemeMode;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}