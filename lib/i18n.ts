export type Locale = "es" | "en"

export const translations = {
  es: {
    nav: {
      home: "Inicio",
      services: "Servicios",
      catalog: "Catalogo",
      gallery: "Galeria",
      contact: "Contacto",
      quote: "Cotizar",
      quoteNow: "Cotizar Ahora",
    },
    hero: {
      tagline: "Produccion Integral de Eventos",
      heading1: "Tu evento,",
      heading2: "nuestra pasion.",
      subtitle:
        "Cabina 360, audio profesional, iluminacion, efectos especiales y todo lo que necesitas para crear momentos inolvidables en Queretaro.",
      cta1: "Ver catalogo",
      cta2: "Cotiza tu evento",
    },
    services: {
      label: "Servicios",
      heading: "Todo para tu evento",
      subtitle:
        "Soluciones integrales de produccion con la mas alta calidad para cada tipo de celebracion.",
      items: [
        {
          title: "DJ & Audio",
          description:
            "Sonido de alta fidelidad con DJ profesional. Paquetes desde Cabina Blanca hasta Sweet Dream.",
          highlight: "Desde $4,830 MXN",
        },
        {
          title: "Cabina 360 / 180",
          description:
            "Videos dinamicos en 360 grados y fotos semicirculares, listos para compartir al instante.",
          highlight: "Videos virales",
        },
        {
          title: "Iluminacion",
          description:
            "Luces LED, cabezas moviles y lasers que crean la atmosfera perfecta.",
          highlight: "Ambiente unico",
        },
        {
          title: "Efectos Especiales",
          description:
            "Fuego, CO2, chisperos, humo, laser y confeti para momentos de impacto.",
          highlight: "Impacto visual",
        },
        {
          title: "Robot LED & Drones",
          description:
            "Shows interactivos con robot LED y drones con figuras personalizadas.",
          highlight: "Shows en vivo",
        },
        {
          title: "Pistas de Baile",
          description:
            "Pistas LED de pixeles, blancas y HD personalizadas desde 4x4 hasta 6x5 metros.",
          highlight: "LED interactivo",
        },
        {
          title: "Espejo Magico",
          description:
            "Espejo fotografico interactivo con impresiones instantaneas y accesorios divertidos.",
          highlight: "Fotos al instante",
        },
        {
          title: "Mobiliario",
          description:
            "Sillas Tiffany, Chanel, Crossback, Thonik y Sewing para cada estilo.",
          highlight: "Estilo y confort",
        },
        {
          title: "Catering & Barra",
          description:
            "Coffee break, snacks y barras moviles con bartenders profesionales.",
          highlight: "Servicio integral",
        },
      ],
    },
    gallery: {
      label: "Galeria",
      heading: "Nuestro trabajo",
      subtitle: "Cada evento es una obra maestra. Descubre nuestras producciones mas recientes.",
    },
    portals: {
      label: "Plataforma",
      heading: "Accede a nuestros portales",
      subtitle: "Herramientas digitales para explorar, cotizar y administrar tus eventos.",
      catalog: "Catalogo",
      catalogDesc: "Explora productos y servicios con precios en MXN.",
      client: "Portal Cliente",
      clientDesc: "Accede a tus cotizaciones y da seguimiento a tus eventos.",
      admin: "Admin",
      adminDesc: "Gestiona catalogo, cotizaciones, galeria y clientes.",
      kiosk: "Modo Kiosk",
      kioskDesc: "Vista interactiva para expo y puntos de venta.",
    },
    quote: {
      label: "Cotizador",
      heading: "Arma tu evento perfecto",
      subtitle:
        "Selecciona los servicios que necesitas y obtendras un estimado al instante. Precios en MXN.",
      cta: "Abrir cotizador",
      popular: "Paquetes populares",
      moreServices: "+40 servicios en el cotizador completo",
    },
    footer: {
      heading: "Listo para crear algo increible?",
      subtitle:
        "Cuentanos la fecha y tipo de evento, nosotros nos encargamos del resto.",
      whatsapp: "Enviar WhatsApp",
      email: "Correo electronico",
      description:
        "Produccion integral de eventos en Queretaro. DJ, audio, iluminacion, efectos especiales, cabinas fotograficas y mas.",
      rights: "Todos los derechos reservados.",
    },
    catalog: {
      title: "Catalogo",
      search: "Buscar productos, paquetes, efectos...",
      results: "resultados para",
      result: "resultado para",
      back: "Volver",
      backCategories: "Volver a categorias",
      heading: "Productos y Servicios",
      subtitle: "Descubre nuestra gama completa. Precios en pesos mexicanos (MXN).",
      products: "productos",
      product: "producto",
      addQuote: "Agregar",
      added: "Agregado",
      quoteTitle: "Tu cotizacion",
      quoteEmpty: "Agrega productos para ver tu cotizacion",
      total: "Total estimado",
      sendWhatsapp: "Enviar por WhatsApp",
      clearQuote: "Limpiar",
      qty: "Cantidad",
    },
    ai: {
      title: "Asistente E360",
      subtitle: "Tu asesor de eventos",
      welcome: "Hola! Soy tu asistente de Eventos 360.",
      welcomeDesc: "Preguntame sobre paquetes, efectos, shows, precios o ayuda para armar tu evento.",
      placeholder: "Escribe tu mensaje...",
      thinking: "Pensando...",
      suggestions: ["Paquetes de DJ", "Efectos especiales", "Shows de drones", "Armar cotizacion"],
    },
    audio: {
      on: "Audio ON",
      off: "Audio OFF",
    },
    admin: {
      title: "Panel Administrativo",
      gallery: "Galeria",
      galleryDesc: "Administra fotos y videos del portafolio",
      upload: "Subir archivo",
      uploadDesc: "Arrastra archivos o haz clic para subir",
      noMedia: "No hay archivos en la galeria",
      delete: "Eliminar",
      catalogMgmt: "Catalogo",
      quotes: "Cotizaciones",
      clients: "Clientes",
      settings: "Configuracion",
    },
    theme: {
      light: "Claro",
      dark: "Oscuro",
    },
    kiosk: {
      welcome: "Bienvenido a",
      tagline: "Producción Integral de Eventos",
      explore: "Explorar Catálogo",
      askLuna: "Pregúntale a Luna",
      services: "Nuestros Servicios",
      servicesDesc: "Toca una categoría para ver los productos",
      products: "productos",
      back: "Volver",
      viewMore: "Ver más categorías",
      quoteNow: "Cotizar ahora",
      location: "Centro de Negocios de Querétaro",
      event: "Expo 2026",
      footer: "Toca la pantalla o habla con Luna para interactuar",
      qrTitle: "Conéctate con nosotros",
      qrDesc: "Escanea los códigos QR con tu teléfono",
      scanToOpen: "Escanea para abrir",
      lunaGreeting: "¡Hola! Soy Luna, tu asistente virtual de Eventos 360. ¿En qué puedo ayudarte hoy?",
      listening: "Escuchando...",
      speaking: "Hablando...",
      thinking: "Pensando...",
      tapToSpeak: "Toca para hablar",
    },
  },
  en: {
    nav: {
      home: "Home",
      services: "Services",
      catalog: "Catalog",
      gallery: "Gallery",
      contact: "Contact",
      quote: "Quote",
      quoteNow: "Get a Quote",
    },
    hero: {
      tagline: "Full-Service Event Production",
      heading1: "Your event,",
      heading2: "our passion.",
      subtitle:
        "360 Booth, professional audio, lighting, special effects, and everything you need to create unforgettable moments in Queretaro.",
      cta1: "View catalog",
      cta2: "Get a quote",
    },
    services: {
      label: "Services",
      heading: "Everything for your event",
      subtitle:
        "Comprehensive production solutions with the highest quality for every type of celebration.",
      items: [
        {
          title: "DJ & Audio",
          description:
            "High-fidelity sound with a professional DJ. Packages from Cabina Blanca to Sweet Dream.",
          highlight: "From $4,830 MXN",
        },
        {
          title: "360 / 180 Booth",
          description:
            "Dynamic 360-degree videos and semicircular photos, ready to share instantly.",
          highlight: "Viral videos",
        },
        {
          title: "Lighting",
          description:
            "LED lights, moving heads, and lasers that create the perfect atmosphere.",
          highlight: "Unique ambiance",
        },
        {
          title: "Special Effects",
          description:
            "Fire, CO2, sparklers, smoke, laser, and confetti for high-impact moments.",
          highlight: "Visual impact",
        },
        {
          title: "LED Robot & Drones",
          description:
            "Interactive shows with LED robot and drones with custom formations.",
          highlight: "Live shows",
        },
        {
          title: "Dance Floors",
          description:
            "LED pixel, white, and custom HD dance floors from 4x4 to 6x5 meters.",
          highlight: "Interactive LED",
        },
        {
          title: "Magic Mirror",
          description:
            "Interactive photo mirror with instant prints and fun accessories.",
          highlight: "Instant photos",
        },
        {
          title: "Furniture",
          description:
            "Tiffany, Chanel, Crossback, Thonik, and Sewing chairs for every style.",
          highlight: "Style & comfort",
        },
        {
          title: "Catering & Bar",
          description:
            "Coffee breaks, snacks, and mobile bars with professional bartenders.",
          highlight: "Full service",
        },
      ],
    },
    gallery: {
      label: "Gallery",
      heading: "Our work",
      subtitle: "Every event is a masterpiece. Discover our most recent productions.",
    },
    portals: {
      label: "Platform",
      heading: "Access our portals",
      subtitle: "Digital tools to explore, quote, and manage your events.",
      catalog: "Catalog",
      catalogDesc: "Explore products and services with prices in MXN.",
      client: "Client Portal",
      clientDesc: "Access your quotes and track your events.",
      admin: "Admin",
      adminDesc: "Manage catalog, quotes, gallery, and clients.",
      kiosk: "Kiosk Mode",
      kioskDesc: "Interactive view for expos and points of sale.",
    },
    quote: {
      label: "Quote Builder",
      heading: "Build your perfect event",
      subtitle:
        "Select the services you need and get an instant estimate. All prices in MXN.",
      cta: "Open quote builder",
      popular: "Popular packages",
      moreServices: "+40 services in the full quote builder",
    },
    footer: {
      heading: "Ready to create something amazing?",
      subtitle:
        "Tell us the date and type of event, and we will take care of the rest.",
      whatsapp: "Send WhatsApp",
      email: "Email us",
      description:
        "Full-service event production in Queretaro. DJ, audio, lighting, special effects, photo booths, and more.",
      rights: "All rights reserved.",
    },
    catalog: {
      title: "Catalog",
      search: "Search products, packages, effects...",
      results: "results for",
      result: "result for",
      back: "Back",
      backCategories: "Back to categories",
      heading: "Products & Services",
      subtitle: "Discover our full range. Prices in Mexican pesos (MXN).",
      products: "products",
      product: "product",
      addQuote: "Add",
      added: "Added",
      quoteTitle: "Your quote",
      quoteEmpty: "Add products to see your quote",
      total: "Estimated total",
      sendWhatsapp: "Send via WhatsApp",
      clearQuote: "Clear",
      qty: "Qty",
    },
    ai: {
      title: "E360 Assistant",
      subtitle: "Your event advisor",
      welcome: "Hi! I'm your Eventos 360 assistant.",
      welcomeDesc: "Ask me about packages, effects, shows, pricing, or help building your event.",
      placeholder: "Type your message...",
      thinking: "Thinking...",
      suggestions: ["DJ Packages", "Special effects", "Drone shows", "Build a quote"],
    },
    audio: {
      on: "Audio ON",
      off: "Audio OFF",
    },
    admin: {
      title: "Admin Dashboard",
      gallery: "Gallery",
      galleryDesc: "Manage portfolio photos and videos",
      upload: "Upload file",
      uploadDesc: "Drag files or click to upload",
      noMedia: "No files in the gallery",
      delete: "Delete",
      catalogMgmt: "Catalog",
      quotes: "Quotes",
      clients: "Clients",
      settings: "Settings",
    },
    theme: {
      light: "Light",
      dark: "Dark",
    },
    kiosk: {
      welcome: "Welcome to",
      tagline: "Full-Service Event Production",
      explore: "Explore Catalog",
      askLuna: "Ask Luna",
      services: "Our Services",
      servicesDesc: "Tap a category to see products",
      products: "products",
      back: "Back",
      viewMore: "View more categories",
      quoteNow: "Get a quote",
      location: "Querétaro Business Center",
      event: "Expo 2026",
      footer: "Touch the screen or talk to Luna to interact",
      qrTitle: "Connect with us",
      qrDesc: "Scan QR codes with your phone",
      scanToOpen: "Scan to open",
      lunaGreeting: "Hi! I'm Luna, your virtual assistant from Eventos 360. How can I help you today?",
      listening: "Listening...",
      speaking: "Speaking...",
      thinking: "Thinking...",
      tapToSpeak: "Tap to speak",
    },
  },
} as const

export type Translations = (typeof translations)[Locale]
