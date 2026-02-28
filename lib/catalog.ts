export interface CatalogProduct {
  id: string
  name: string
  category: string
  subcategory?: string
  unit: string
  price: number
  hrs?: number | null
  size?: string
  priceNote?: string
}

export interface CategoryMeta {
  label: string
  desc: string
  image: string
}

export const CATEGORY_META: Record<string, CategoryMeta> = {
  Packages: {
    label: "Paquetes DJ / Audio",
    desc: "Paquetes completos por evento: cabina, DJ y experiencias.",
    image: "/images/packages-dj.jpg",
  },
  Effects: {
    label: "Efectos Especiales",
    desc: "Fuego, CO2, humo, laser, papel y extras para momentos clave.",
    image: "/images/effects-fx.jpg",
  },
  Shows: {
    label: "Shows en Vivo",
    desc: "Robot LED, drones y shows especiales de alto impacto.",
    image: "/images/shows-led.jpg",
  },
  Furniture: {
    label: "Mobiliario",
    desc: "Sillas premium por unidad para cualquier tipo de evento.",
    image: "/images/furniture-chairs.jpg",
  },
  "Dance Floor": {
    label: "Pistas de Baile",
    desc: "Pistas LED pixeles y blancas en distintos tamanos.",
    image: "/images/dance-floor.jpg",
  },
  Tableware: {
    label: "Loza y Cristaleria",
    desc: "Platos, cubiertos y copas por pieza.",
    image: "/images/tableware.jpg",
  },
  Power: {
    label: "Energia",
    desc: "Plantas de luz por bloque de tiempo para venues sin energia estable.",
    image: "/images/power-generators.jpg",
  },
  Food: {
    label: "Alimentos",
    desc: "Coffee break, snacks y extras por persona.",
    image: "/images/food-catering.jpg",
  },
}

export const CATALOG: CatalogProduct[] = [
  { id: "PKG-CAB-001", name: "Cabina Blanca", category: "Packages", subcategory: "DJ / Audio", unit: "paquete", price: 4830, hrs: 5 },
  { id: "PKG-MAG-002", name: "Magic", category: "Packages", subcategory: "DJ / Audio", unit: "paquete", price: 6820, hrs: 5 },
  { id: "PKG-MAGP-003", name: "Magic Pixeles", category: "Packages", subcategory: "DJ / Audio", unit: "paquete", price: 6820, hrs: 5 },
  { id: "PKG-PTY-004", name: "Party (sin pantallas)", category: "Packages", subcategory: "DJ / Audio", unit: "paquete", price: 8140, hrs: 5 },
  { id: "PKG-PTY-005", name: "Party (con pantallas 55\")", category: "Packages", subcategory: "DJ / Audio", unit: "paquete", price: 11000, hrs: 5 },
  { id: "PKG-BLK-006", name: "Black", category: "Packages", subcategory: "DJ / Audio", unit: "paquete", price: 9900, hrs: 5 },
  { id: "PKG-LP-007", name: "Luxury Petite", category: "Packages", subcategory: "DJ / Audio", unit: "paquete", price: 17600, hrs: 6 },
  { id: "PKG-FNC-008", name: "Fancy", category: "Packages", subcategory: "DJ / Audio", unit: "paquete", price: 17600, hrs: 6 },
  { id: "PKG-LUX-009", name: "Luxury", category: "Packages", subcategory: "DJ / Audio", unit: "paquete", price: 30800, hrs: 6 },
  { id: "PKG-GB-010", name: "Gold Bar", category: "Packages", subcategory: "DJ / Audio", unit: "paquete", price: 36300, hrs: 6 },
  { id: "PKG-SD-011", name: "Sweet Dream", category: "Packages", subcategory: "DJ / Audio", unit: "paquete", price: 46200, hrs: 7 },
  { id: "PKG-LG-012", name: "Luxury Gold (todo incluido)", category: "Packages", subcategory: "Full Event", unit: "persona", price: 1650, hrs: null },

  { id: "FX-FIRE-001", name: "Maquina de fuego (30 disparos)", category: "Effects", unit: "hora", price: 990 },
  { id: "FX-SPARK-002", name: "Chispero", category: "Effects", unit: "detonacion", price: 385 },
  { id: "FX-CO2-003", name: "Maquina CO2 (papel plata)", category: "Effects", unit: "hora", price: 2200 },
  { id: "FX-CO2-004", name: "Papel mariposa", category: "Effects", unit: "extra", price: 660 },
  { id: "FX-CO2-005", name: "Papel color", category: "Effects", unit: "extra", price: 770 },
  { id: "FX-SMOKE-007", name: "Maquina de humo", category: "Effects", unit: "evento", price: 825 },
  { id: "FX-AROL-008", name: "Aro Laser", category: "Effects", unit: "evento", price: 3300 },

  { id: "FX-ROBOT-006", name: "Robot LED", category: "Shows", unit: "show", price: 2145 },
  { id: "FX-DRONE-009", name: "Show de Drones (min. 20)", category: "Shows", unit: "figura", price: 6000 },

  { id: "CH-TIF-001", name: "Tiffany", category: "Furniture", unit: "unidad", price: 38.5 },
  { id: "CH-TIFW-002", name: "Tiffany blanca", category: "Furniture", unit: "unidad", price: 38.5 },
  { id: "CH-CHN-003", name: "Chanel dorada / negra", category: "Furniture", unit: "unidad", price: 44 },
  { id: "CH-CRS-004", name: "Crossback", category: "Furniture", unit: "unidad", price: 82.5 },
  { id: "CH-THN-005", name: "Thonik", category: "Furniture", unit: "unidad", price: 132 },
  { id: "CH-SEW-006", name: "Sewing", category: "Furniture", unit: "unidad", price: 154 },

  { id: "FL-PIX-009", name: "Pista Pixeles", category: "Dance Floor", size: "4x4 (9 mod)", unit: "evento", price: 5500 },
  { id: "FL-PIX-010", name: "Pista Pixeles", category: "Dance Floor", size: "4x5 (12 mod)", unit: "evento", price: 7150 },
  { id: "FL-PIX-011", name: "Pista Pixeles", category: "Dance Floor", size: "5x5 (16 mod)", unit: "evento", price: 9350 },
  { id: "FL-PIX-012", name: "Pista Pixeles", category: "Dance Floor", size: "6x5 (20 mod)", unit: "evento", price: 12100 },
  { id: "FL-WHT-013", name: "Pista Blanca", category: "Dance Floor", size: "4x4", unit: "evento", price: 3960 },
  { id: "FL-WHT-014", name: "Pista Blanca", category: "Dance Floor", size: "4x5", unit: "evento", price: 5280 },
  { id: "FL-WHT-015", name: "Pista Blanca", category: "Dance Floor", size: "5x5", unit: "evento", price: 7040 },
  { id: "FL-WHT-016", name: "Pista Blanca", category: "Dance Floor", size: "6x5", unit: "evento", price: 8800 },
  { id: "FL-CST-017", name: "Pista Personalizada HD", category: "Dance Floor", size: "4x4-6x5", unit: "evento", price: 5500, priceNote: "Rango $5,500-$12,100" },

  { id: "LZ-TRI-001", name: "Plato trinche negro", category: "Tableware", unit: "pieza", price: 22 },
  { id: "LZ-CUA-002", name: "Plato cuadrado", category: "Tableware", unit: "pieza", price: 16 },
  { id: "LZ-ECO-003", name: "Plato economico", category: "Tableware", unit: "pieza", price: 11 },
  { id: "LZ-VDR-004", name: "Sobre plato vidrio", category: "Tableware", unit: "pieza", price: 18 },
  { id: "CU-STD-001", name: "Cuchara", category: "Tableware", unit: "pieza", price: 8 },
  { id: "CU-STD-002", name: "Cuchillo", category: "Tableware", unit: "pieza", price: 8 },
  { id: "CU-STD-003", name: "Tenedor", category: "Tableware", unit: "pieza", price: 8 },
  { id: "CU-GLD-004", name: "Cubiertos dorados", category: "Tableware", unit: "pieza", price: 17 },
  { id: "GL-JAI-001", name: "Vaso jaibolero", category: "Tableware", unit: "pieza", price: 11 },
  { id: "GL-GLO-002", name: "Copa globo", category: "Tableware", unit: "pieza", price: 15 },
  { id: "GL-MAR-003", name: "Copa margarita", category: "Tableware", unit: "pieza", price: 14 },
  { id: "GL-CHA-004", name: "Copa champagne", category: "Tableware", unit: "pieza", price: 14 },
  { id: "GL-OLD-005", name: "Old Fashion", category: "Tableware", unit: "pieza", price: 15 },

  { id: "PWR-60-001", name: "Planta de luz 60 KVA", category: "Power", unit: "bloque 8h", price: 10450, hrs: 8 },
  { id: "PWR-40-002", name: "Planta de luz 40 KVA", category: "Power", unit: "bloque 8h", price: 7700, hrs: 8 },
  { id: "PWR-3K-003", name: "Planta 3000W", category: "Power", unit: "bloque 8h", price: 2750, hrs: 8 },

  { id: "FB-CFE-001", name: "Coffee Break", category: "Food", unit: "persona", price: 90 },
  { id: "FB-SNK-002", name: "Snacks", category: "Food", unit: "persona", price: 70 },
]

export const CATEGORY_ORDER = ["Packages", "Effects", "Shows", "Furniture", "Dance Floor", "Tableware", "Power", "Food"]

export function getCategories(): string[] {
  const set = new Set<string>()
  for (const p of CATALOG) set.add(p.category)
  return CATEGORY_ORDER.filter((c) => set.has(c))
}

export function getProductsByCategory(category: string): CatalogProduct[] {
  return CATALOG.filter((p) => p.category === category)
}
