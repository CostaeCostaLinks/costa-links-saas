import React from 'react';

// Recebe o objeto completo do template
export default function TemplateMockup({ template }: { template: any }) {
  const { config } = template;
  
  // Simula 3 botões
  const mockButtons = [1, 2, 3];

  return (
    <div 
      className="w-full h-full flex flex-col items-center pt-6 px-4 relative overflow-hidden pointer-events-none select-none"
      style={{ 
        backgroundColor: config.background_color,
        fontFamily: config.font_family 
      }}
    >
      {/* Banner Mockup (se houver) */}
      {config.display_banner && (
        <div className="absolute top-0 left-0 w-full h-16 bg-white/10 opacity-50 z-0"></div>
      )}

      {/* Avatar Mockup */}
      <div 
        className="w-12 h-12 rounded-full mb-3 z-10 border-2 shrink-0"
        style={{ 
          backgroundColor: config.button_color || '#ccc',
          borderColor: config.use_gradient ? config.gradient_from : config.button_color
        }}
      />

      {/* Título e Bio Mockup (Linhas) */}
      <div 
        className="h-2.5 w-24 rounded-full mb-2 opacity-80" 
        style={{ backgroundColor: config.title_color }} 
      />
      <div 
        className="h-1.5 w-32 rounded-full mb-6 opacity-60" 
        style={{ backgroundColor: config.bio_color }} 
      />

      {/* Botões Mockup */}
      <div className="w-full space-y-2.5">
        {mockButtons.map((_, index) => {
          const isFirst = index === 0;
          const highlight = config.highlight_first_link;
          
          // Lógica visual igual ao PreviewPhone.tsx
          let bg = config.button_color;
          let border = config.button_border_color || 'transparent';
          let borderWidth = config.button_border_width || '0px';

          // Se for gradiente
          if (config.use_gradient && !highlight) {
            bg = `linear-gradient(to right, ${config.gradient_from}, ${config.gradient_to})`;
          }

          // Se for Destaque Premium (Highlight First Link)
          if (highlight) {
            if (isFirst) {
              // O primeiro é cheio
              bg = config.button_color;
              border = 'transparent';
            } else {
              // Os outros são transparentes (Ghost)
              bg = 'transparent';
              border = config.button_border_color !== 'transparent' ? config.button_border_color : config.button_color;
              borderWidth = borderWidth === '0px' ? '1px' : borderWidth;
            }
          }

          return (
            <div 
              key={index}
              className="w-full h-8 rounded-full flex items-center px-3"
              style={{
                background: bg,
                borderColor: border,
                borderWidth: borderWidth,
                borderStyle: 'solid',
                opacity: 0.9
              }}
            >
              {/* Ícone pequeno */}
              <div 
                 className="w-2 h-2 rounded-full opacity-50" 
                 style={{ backgroundColor: highlight && !isFirst ? config.title_color : config.button_text_color }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}