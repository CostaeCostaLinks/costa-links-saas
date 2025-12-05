export interface Profile {
  id: string;
  username: string;
  plan?: 'free' | 'premium';
  full_name?: string;
  avatar_url?: string;
  banner_url?: string;
  display_banner?: boolean;
  highlight_first_link?: boolean;
  bio?: string;
  
  // Cores Básicas
  background_color?: string;
  text_color?: string;
  
  // Cores Avançadas de Texto
  title_color?: string;
  bio_color?: string;

  // Botões
  button_color?: string;
  button_text_color?: string;
  button_border_color?: string;
  button_border_width?: string;
  icon_color?: string;
  
  // Gradiente
  use_gradient?: boolean;
  gradient_from?: string;
  gradient_to?: string;

  // Fontes e Tamanhos
  font_family?: string;
  title_font_family?: string;
  font_size?: string;
  title_font_size?: string;
  bio_font_size?: string;
  
  created_at?: string;
}

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
  // ADICIONADO: Corrige o erro de propriedade inexistente
  user_metadata?: {
    full_name?: string;
    [key: string]: any;
  };
}