export interface Profile {
  id: string;
  username: string;
  plan?: 'free' | 'premium';
  full_name?: string;
  avatar_url?: string;
  banner_url?: string;
  bio?: string;
  
  // Cores Básicas
  background_color?: string;
  text_color?: string; // Mantido como fallback
  
  // Cores Avançadas de Texto
  title_color?: string;
  bio_color?: string;

  // Botões
  button_color?: string;
  button_text_color?: string;
  button_border_color?: string;
  icon_color?: string; // <--- NOVO CAMPO
  
  // Gradiente (Premium)
  use_gradient?: boolean;
  gradient_from?: string;
  gradient_to?: string;

  // Fontes
  font_family?: string;
  title_font_family?: string;
  
  created_at?: string;
}
// ... Mantenha Link e AuthUser iguais
export interface Link {
  id: string;
  user_id: string;
  title: string;
  url: string;
  icon?: string;
  is_active: boolean;
  order_index: number;
  created_at?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  avatar?: string;
}