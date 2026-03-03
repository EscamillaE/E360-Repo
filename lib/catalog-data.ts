export interface CatalogItem {
  id: string
  name: string
  category: string
  description: string
  price: string
  priceValue: number
  unit: string
  image: string
}

export interface CatalogCategory {
  id: string
  name: string
  description: string
  icon: string
  items: CatalogItem[]
}

export const catalog: CatalogCategory[] = [
  {
    id: "paquetes-dj",
    name: "Paquetes DJ & Audio",
    description:
      "Paquetes completos con DJ profesional, audio premium e iluminacion de alto nivel para cualquier tipo de evento.",
    icon: "music",
    items: [
      {
        id: "cabina-blanca",
        name: "Cabina Blanca",
        category: "Paquetes DJ & Audio",
        description:
          "Cabina + DJ base, ideal para evento mediano. 5 horas de servicio con equipo de audio profesional.",
        price: "$4,830 MXN",
        priceValue: 4830,
        unit: "5 hrs",
        image: "/images/catalog/dj-white.jpg",
      },
      {
        id: "magic",
        name: "Magic",
        category: "Paquetes DJ & Audio",
        description:
          "Look premium con operacion simple. 5 horas de DJ, audio envolvente y configuracion elegante.",
        price: "$6,820 MXN",
        priceValue: 6820,
        unit: "5 hrs",
        image: "/images/catalog/dj-magic.jpg",
      },
      {
        id: "magic-pixeles",
        name: "Magic Pixeles",
        category: "Paquetes DJ & Audio",
        description:
          "Paquete Magic con pista de pixeles LED integrada. 5 horas de musica y experiencia visual.",
        price: "$6,820 MXN",
        priceValue: 6820,
        unit: "5 hrs",
        image: "/images/catalog/dj-magic-pixels.jpg",
      },
      {
        id: "party-sin-pantallas",
        name: "Party (sin pantallas)",
        category: "Paquetes DJ & Audio",
        description:
          "Paquete Party con audio potente para eventos grandes. 5 horas de fiesta sin parar.",
        price: "$8,140 MXN",
        priceValue: 8140,
        unit: "5 hrs",
        image: "/images/catalog/dj-party.jpg",
      },
      {
        id: "party-con-pantallas",
        name: "Party (con pantallas 55\")",
        category: "Paquetes DJ & Audio",
        description:
          "Paquete Party con pantallas de 55 pulgadas para visuales impactantes. 5 horas de servicio completo.",
        price: "$11,000 MXN",
        priceValue: 11000,
        unit: "5 hrs",
        image: "/images/catalog/dj-party-screens.jpg",
      },
      {
        id: "black",
        name: "Black",
        category: "Paquetes DJ & Audio",
        description:
          "Estilo oscuro y elegante con DJ premium. 5 horas de ambiente sofisticado.",
        price: "$9,900 MXN",
        priceValue: 9900,
        unit: "5 hrs",
        image: "/images/catalog/dj-black.jpg",
      },
      {
        id: "luxury-petite",
        name: "Luxury Petite",
        category: "Paquetes DJ & Audio",
        description:
          "Lujo compacto: DJ premium, audio de primera y montaje elegante. 6 horas de experiencia de lujo.",
        price: "$17,600 MXN",
        priceValue: 17600,
        unit: "6 hrs",
        image: "/images/catalog/dj-luxury-petite.jpg",
      },
      {
        id: "fancy",
        name: "Fancy",
        category: "Paquetes DJ & Audio",
        description:
          "Alta gama con DJ de elite, audio superior y ambientacion completa. 6 horas de clase y estilo.",
        price: "$17,600 MXN",
        priceValue: 17600,
        unit: "6 hrs",
        image: "/images/catalog/dj-fancy.jpg",
      },
      {
        id: "luxury",
        name: "Luxury",
        category: "Paquetes DJ & Audio",
        description:
          "Experiencia de lujo completa. DJ, audio, iluminacion y efectos especiales premium. 6 horas.",
        price: "$30,800 MXN",
        priceValue: 30800,
        unit: "6 hrs",
        image: "/images/catalog/dj-luxury.jpg",
      },
      {
        id: "gold-bar",
        name: "Gold Bar",
        category: "Paquetes DJ & Audio",
        description:
          "Premium gold: la experiencia dorada con DJ de elite y produccion impecable. 6 horas de evento.",
        price: "$36,300 MXN",
        priceValue: 36300,
        unit: "6 hrs",
        image: "/images/catalog/dj-gold-bar.jpg",
      },
      {
        id: "sweet-dream",
        name: "Sweet Dream",
        category: "Paquetes DJ & Audio",
        description:
          "El paquete mas completo: DJ, audio, iluminacion, efectos y produccion total. 7 horas de evento.",
        price: "$46,200 MXN",
        priceValue: 46200,
        unit: "7 hrs",
        image: "/images/catalog/dj-sweet-dream.jpg",
      },
      {
        id: "luxury-gold",
        name: "Luxury Gold (todo incluido)",
        category: "Paquetes DJ & Audio",
        description:
          "Paquete todo incluido por persona: DJ, audio, iluminacion, catering y produccion total.",
        price: "$1,650 MXN",
        priceValue: 1650,
        unit: "por persona",
        image: "/images/catalog/dj-luxury-gold.jpg",
      },
    ],
  },
  {
    id: "efectos-especiales",
    name: "Efectos Especiales",
    description:
      "Fuego, CO2, chisperos, humo, laser y confeti. Momentos clave que dejan a todos sin aliento.",
    icon: "flame",
    items: [
      {
        id: "maquina-fuego",
        name: "Maquina de Fuego",
        category: "Efectos Especiales",
        description:
          "30 disparos de fuego controlado para momentos espectaculares y seguros.",
        price: "$990 MXN",
        priceValue: 990,
        unit: "por hora",
        image: "/images/catalog/fx-fire.jpg",
      },
      {
        id: "chispero",
        name: "Chispero",
        category: "Efectos Especiales",
        description:
          "Chispas frias de pirotecnia controlada para realzar momentos especiales de forma segura.",
        price: "$385 MXN",
        priceValue: 385,
        unit: "por detonacion",
        image: "/images/catalog/fx-sparkler.jpg",
      },
      {
        id: "maquina-co2",
        name: "Maquina CO2 (papel plata)",
        category: "Efectos Especiales",
        description:
          "Efecto de CO2 con papel plata para momentos de alto impacto visual.",
        price: "$2,200 MXN",
        priceValue: 2200,
        unit: "por hora",
        image: "/images/catalog/fx-co2.jpg",
      },
      {
        id: "papel-mariposa",
        name: "Papel Mariposa",
        category: "Efectos Especiales",
        description:
          "Efecto de papel mariposa que cae suavemente para crear un ambiente romantico.",
        price: "$660 MXN",
        priceValue: 660,
        unit: "extra",
        image: "/images/catalog/fx-butterfly.jpg",
      },
      {
        id: "papel-color",
        name: "Papel de Color",
        category: "Efectos Especiales",
        description:
          "Confeti y papel de colores personalizados para celebraciones vibrantes.",
        price: "$770 MXN",
        priceValue: 770,
        unit: "extra",
        image: "/images/catalog/fx-confetti.jpg",
      },
      {
        id: "maquina-humo",
        name: "Maquina de Humo",
        category: "Efectos Especiales",
        description:
          "Humo atmosferico para crear ambientes misteriosos y dramaticos.",
        price: "$825 MXN",
        priceValue: 825,
        unit: "por evento",
        image: "/images/catalog/fx-smoke.jpg",
      },
      {
        id: "aro-laser",
        name: "Aro Laser",
        category: "Efectos Especiales",
        description:
          "Show de laser con aro envolvente para una experiencia visual futurista.",
        price: "$3,300 MXN",
        priceValue: 3300,
        unit: "por evento",
        image: "/images/catalog/fx-laser.jpg",
      },
    ],
  },
  {
    id: "shows",
    name: "Shows en Vivo",
    description:
      "Robot LED interactivo y shows de drones con figuras personalizadas que transforman tu evento.",
    icon: "zap",
    items: [
      {
        id: "robot-led",
        name: "Robot LED",
        category: "Shows en Vivo",
        description:
          "Robot LED interactivo que ilumina y anima la fiesta con coreografias y efectos luminosos.",
        price: "$2,145 MXN",
        priceValue: 2145,
        unit: "por show",
        image: "/images/catalog/show-robot.jpg",
      },
      {
        id: "show-drones",
        name: "Show de Drones",
        category: "Shows en Vivo",
        description:
          "Show aereo con minimo 20 drones creando figuras personalizadas en el cielo nocturno.",
        price: "$6,000 MXN",
        priceValue: 6000,
        unit: "por figura (min. 20 drones)",
        image: "/images/catalog/show-drones.jpg",
      },
    ],
  },
  {
    id: "pistas-baile",
    name: "Pistas de Baile",
    description:
      "Pistas de pixeles LED, pistas blancas y pistas HD personalizadas para animar tu evento.",
    icon: "disc",
    items: [
      {
        id: "pista-pixeles-4x4",
        name: "Pista Pixeles 4x4",
        category: "Pistas de Baile",
        description:
          "Pista de pixeles LED de 4x4 metros con efectos interactivos y reactivos a la musica.",
        price: "$5,500 MXN",
        priceValue: 5500,
        unit: "por evento",
        image: "/images/catalog/floor-pixel.jpg",
      },
      {
        id: "pista-pixeles-6x5",
        name: "Pista Pixeles 6x5",
        category: "Pistas de Baile",
        description:
          "Pista de pixeles LED de 6x5 metros, ideal para eventos grandes con muchos invitados.",
        price: "$12,100 MXN",
        priceValue: 12100,
        unit: "por evento",
        image: "/images/catalog/floor-pixel-large.jpg",
      },
      {
        id: "pista-blanca-4x4",
        name: "Pista Blanca 4x4",
        category: "Pistas de Baile",
        description:
          "Pista blanca elegante de 4x4 metros, perfecta para bodas y eventos sofisticados.",
        price: "$3,960 MXN",
        priceValue: 3960,
        unit: "por evento",
        image: "/images/catalog/floor-white.jpg",
      },
      {
        id: "pista-blanca-6x5",
        name: "Pista Blanca 6x5",
        category: "Pistas de Baile",
        description:
          "Pista blanca elegante de 6x5 metros para eventos de gran escala.",
        price: "$8,800 MXN",
        priceValue: 8800,
        unit: "por evento",
        image: "/images/catalog/floor-white-large.jpg",
      },
      {
        id: "pista-personalizada-hd",
        name: "Pista Personalizada HD",
        category: "Pistas de Baile",
        description:
          "Pista con graficos HD personalizados. Logotipos, imagenes o disenos a tu gusto.",
        price: "$5,500 - $12,100 MXN",
        priceValue: 5500,
        unit: "segun tamano",
        image: "/images/catalog/floor-custom.jpg",
      },
    ],
  },
  {
    id: "mobiliario",
    name: "Mobiliario Premium",
    description:
      "Sillas, mesas y mobiliario de alta gama para darle elegancia y confort a tu evento.",
    icon: "armchair",
    items: [
      {
        id: "silla-tiffany",
        name: "Silla Tiffany",
        category: "Mobiliario Premium",
        description:
          "Silla Tiffany clasica, ideal para bodas y eventos elegantes. Disponible en varios colores.",
        price: "$38.50 MXN",
        priceValue: 38.5,
        unit: "por unidad",
        image: "/images/catalog/chair-tiffany.jpg",
      },
      {
        id: "silla-chanel",
        name: "Silla Chanel (dorada/negra)",
        category: "Mobiliario Premium",
        description:
          "Silla Chanel en acabado dorado o negro. Elegancia y modernidad en cada detalle.",
        price: "$44 MXN",
        priceValue: 44,
        unit: "por unidad",
        image: "/images/catalog/chair-chanel.jpg",
      },
      {
        id: "silla-crossback",
        name: "Silla Crossback",
        category: "Mobiliario Premium",
        description:
          "Silla Crossback de madera con respaldo cruzado. Estilo rustico-chic para eventos al aire libre.",
        price: "$82.50 MXN",
        priceValue: 82.5,
        unit: "por unidad",
        image: "/images/catalog/chair-crossback.jpg",
      },
      {
        id: "silla-thonik",
        name: "Silla Thonik",
        category: "Mobiliario Premium",
        description:
          "Silla Thonik de diseno contemporaneo, perfecta para eventos corporativos y sociales.",
        price: "$132 MXN",
        priceValue: 132,
        unit: "por unidad",
        image: "/images/catalog/chair-thonik.jpg",
      },
      {
        id: "silla-sewing",
        name: "Silla Sewing",
        category: "Mobiliario Premium",
        description:
          "Silla Sewing premium de alta gama. La opcion mas sofisticada para eventos exclusivos.",
        price: "$154 MXN",
        priceValue: 154,
        unit: "por unidad",
        image: "/images/catalog/chair-sewing.jpg",
      },
    ],
  },
  {
    id: "energia",
    name: "Plantas de Energia",
    description:
      "Plantas de luz profesionales para eventos en cualquier ubicacion sin preocuparse por la energia.",
    icon: "bolt",
    items: [
      {
        id: "planta-60kva",
        name: "Planta 60 KVA",
        category: "Plantas de Energia",
        description:
          "Planta de luz de 60 KVA para eventos grandes con alto consumo de energia. 8 horas.",
        price: "$10,450 MXN",
        priceValue: 10450,
        unit: "8 hrs",
        image: "/images/catalog/power-60.jpg",
      },
      {
        id: "planta-40kva",
        name: "Planta 40 KVA",
        category: "Plantas de Energia",
        description:
          "Planta de luz de 40 KVA para eventos medianos. 8 horas de suministro confiable.",
        price: "$7,700 MXN",
        priceValue: 7700,
        unit: "8 hrs",
        image: "/images/catalog/power-40.jpg",
      },
      {
        id: "planta-3000w",
        name: "Planta 3000W",
        category: "Plantas de Energia",
        description:
          "Planta compacta de 3000W para eventos pequenos o respaldo de energia. 8 horas.",
        price: "$2,750 MXN",
        priceValue: 2750,
        unit: "8 hrs",
        image: "/images/catalog/power-3000.jpg",
      },
    ],
  },
  {
    id: "catering",
    name: "Catering & Alimentos",
    description:
      "Coffee break, snacks y servicio de alimentos para mantener a tus invitados bien atendidos.",
    icon: "utensils",
    items: [
      {
        id: "coffee-break",
        name: "Coffee Break",
        category: "Catering & Alimentos",
        description:
          "Servicio de coffee break con cafe, te, galletas y panes finos para tus invitados.",
        price: "$90 MXN",
        priceValue: 90,
        unit: "por persona",
        image: "/images/catalog/catering-coffee.jpg",
      },
      {
        id: "snacks",
        name: "Snacks",
        category: "Catering & Alimentos",
        description:
          "Seleccion de snacks variados y bocadillos para acompanar cualquier tipo de evento.",
        price: "$70 MXN",
        priceValue: 70,
        unit: "por persona",
        image: "/images/catalog/catering-snacks.jpg",
      },
    ],
  },
  {
    id: "cabinas-foto",
    name: "Cabinas Fotograficas",
    description:
      "Cabinas 360, 180, espejo magico y mas para capturar momentos inolvidables.",
    icon: "camera",
    items: [
      {
        id: "cabina-360",
        name: "Cabina 360",
        category: "Cabinas Fotograficas",
        description:
          "Cabina giratoria que captura videos panoramicos en 360 grados para compartir al instante en redes sociales.",
        price: "$6,000 MXN",
        priceValue: 6000,
        unit: "por evento",
        image: "/images/catalog/booth-360.jpg",
      },
      {
        id: "cabina-180",
        name: "Cabina 180",
        category: "Cabinas Fotograficas",
        description:
          "Cabina semicircular que captura fotos y videos divertidos con accesorios y fondos personalizados.",
        price: "$5,000 MXN",
        priceValue: 5000,
        unit: "por evento",
        image: "/images/catalog/booth-180.jpg",
      },
      {
        id: "espejo-magico",
        name: "Espejo Magico",
        category: "Cabinas Fotograficas",
        description:
          "Espejo fotografico interactivo con impresiones instantaneas, animaciones y accesorios divertidos.",
        price: "$4,500 MXN",
        priceValue: 4500,
        unit: "por evento",
        image: "/images/catalog/booth-mirror.jpg",
      },
    ],
  },
  {
    id: "extras",
    name: "Servicios Adicionales",
    description:
      "Barra de bebidas, fotografia, video y decoracion profesional para complementar tu evento.",
    icon: "star",
    items: [
      {
        id: "barra-bebidas",
        name: "Barra de Bebidas",
        category: "Servicios Adicionales",
        description:
          "Barras moviles con bartenders profesionales y menus de cocteles personalizados.",
        price: "$3,500 MXN",
        priceValue: 3500,
        unit: "por evento",
        image: "/images/catalog/extra-bar.jpg",
      },
      {
        id: "fotografia-video",
        name: "Fotografia & Video",
        category: "Servicios Adicionales",
        description:
          "Equipo de fotografos y videografos profesionales para capturar cada instante de tu evento.",
        price: "$4,500 MXN",
        priceValue: 4500,
        unit: "por evento",
        image: "/images/catalog/extra-photo.jpg",
      },
      {
        id: "decoracion",
        name: "Decoracion y Ambientacion",
        category: "Servicios Adicionales",
        description:
          "Carpas, backdrops, centros de mesa y elementos decorativos personalizados para tu celebracion.",
        price: "Cotizar",
        priceValue: 0,
        unit: "personalizado",
        image: "/images/catalog/extra-decor.jpg",
      },
    ],
  },
]

export function getAllItems(): CatalogItem[] {
  return catalog.flatMap((cat) => cat.items)
}

export function getCategory(id: string): CatalogCategory | undefined {
  return catalog.find((cat) => cat.id === id)
}
