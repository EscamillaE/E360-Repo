-- Seed categories
insert into public.categories (slug, name, description, icon, sort_order) values
  ('paquetes-dj', 'Paquetes DJ & Audio', 'Paquetes completos con DJ profesional, audio premium e iluminacion de alto nivel para cualquier tipo de evento.', 'music', 1),
  ('efectos-especiales', 'Efectos Especiales', 'Fuego, CO2, chisperos, humo, laser y confeti. Momentos clave que dejan a todos sin aliento.', 'flame', 2),
  ('shows', 'Shows en Vivo', 'Robot LED interactivo y shows de drones con figuras personalizadas que transforman tu evento.', 'zap', 3),
  ('pistas-baile', 'Pistas de Baile', 'Pistas de pixeles LED, pistas blancas y pistas HD personalizadas para animar tu evento.', 'disc', 4),
  ('mobiliario', 'Mobiliario Premium', 'Sillas, mesas y mobiliario de alta gama para darle elegancia y confort a tu evento.', 'armchair', 5),
  ('energia', 'Plantas de Energia', 'Plantas de luz profesionales para eventos en cualquier ubicacion sin preocuparse por la energia.', 'bolt', 6),
  ('catering', 'Catering & Alimentos', 'Coffee break, snacks y servicio de alimentos para mantener a tus invitados bien atendidos.', 'utensils', 7),
  ('cabinas-foto', 'Cabinas Fotograficas', 'Cabinas 360, 180, espejo magico y mas para capturar momentos inolvidables.', 'camera', 8),
  ('extras', 'Servicios Adicionales', 'Barra de bebidas, fotografia, video y decoracion profesional para complementar tu evento.', 'star', 9)
on conflict (slug) do nothing;

-- Seed catalog items (using subqueries to get category_id)
-- Paquetes DJ & Audio
insert into public.catalog_items (category_id, slug, name, description, price, price_label, unit, image_url, sort_order) values
  ((select id from public.categories where slug = 'paquetes-dj'), 'cabina-blanca', 'Cabina Blanca', 'Cabina + DJ base, ideal para evento mediano. 5 horas de servicio con equipo de audio profesional.', 4830, '$4,830 MXN', '5 hrs', '/images/catalog/dj-white.jpg', 1),
  ((select id from public.categories where slug = 'paquetes-dj'), 'magic', 'Magic', 'Look premium con operacion simple. 5 horas de DJ, audio envolvente y configuracion elegante.', 6820, '$6,820 MXN', '5 hrs', '/images/catalog/dj-magic.jpg', 2),
  ((select id from public.categories where slug = 'paquetes-dj'), 'magic-pixeles', 'Magic Pixeles', 'Paquete Magic con pista de pixeles LED integrada. 5 horas de musica y experiencia visual.', 6820, '$6,820 MXN', '5 hrs', '/images/catalog/dj-magic-pixels.jpg', 3),
  ((select id from public.categories where slug = 'paquetes-dj'), 'party-sin-pantallas', 'Party (sin pantallas)', 'Paquete Party con audio potente para eventos grandes. 5 horas de fiesta sin parar.', 8140, '$8,140 MXN', '5 hrs', '/images/catalog/dj-party.jpg', 4),
  ((select id from public.categories where slug = 'paquetes-dj'), 'party-con-pantallas', 'Party (con pantallas 55")', 'Paquete Party con pantallas de 55 pulgadas para visuales impactantes. 5 horas de servicio completo.', 11000, '$11,000 MXN', '5 hrs', '/images/catalog/dj-party-screens.jpg', 5),
  ((select id from public.categories where slug = 'paquetes-dj'), 'black', 'Black', 'Estilo oscuro y elegante con DJ premium. 5 horas de ambiente sofisticado.', 9900, '$9,900 MXN', '5 hrs', '/images/catalog/dj-black.jpg', 6),
  ((select id from public.categories where slug = 'paquetes-dj'), 'luxury-petite', 'Luxury Petite', 'Lujo compacto: DJ premium, audio de primera y montaje elegante. 6 horas de experiencia de lujo.', 17600, '$17,600 MXN', '6 hrs', '/images/catalog/dj-luxury-petite.jpg', 7),
  ((select id from public.categories where slug = 'paquetes-dj'), 'fancy', 'Fancy', 'Alta gama con DJ de elite, audio superior y ambientacion completa. 6 horas de clase y estilo.', 17600, '$17,600 MXN', '6 hrs', '/images/catalog/dj-fancy.jpg', 8),
  ((select id from public.categories where slug = 'paquetes-dj'), 'luxury', 'Luxury', 'Experiencia de lujo completa. DJ, audio, iluminacion y efectos especiales premium. 6 horas.', 30800, '$30,800 MXN', '6 hrs', '/images/catalog/dj-luxury.jpg', 9),
  ((select id from public.categories where slug = 'paquetes-dj'), 'gold-bar', 'Gold Bar', 'Premium gold: la experiencia dorada con DJ de elite y produccion impecable. 6 horas de evento.', 36300, '$36,300 MXN', '6 hrs', '/images/catalog/dj-gold-bar.jpg', 10),
  ((select id from public.categories where slug = 'paquetes-dj'), 'sweet-dream', 'Sweet Dream', 'El paquete mas completo: DJ, audio, iluminacion, efectos y produccion total. 7 horas de evento.', 46200, '$46,200 MXN', '7 hrs', '/images/catalog/dj-sweet-dream.jpg', 11),
  ((select id from public.categories where slug = 'paquetes-dj'), 'luxury-gold', 'Luxury Gold (todo incluido)', 'Paquete todo incluido por persona: DJ, audio, iluminacion, catering y produccion total.', 1650, '$1,650 MXN', 'por persona', '/images/catalog/dj-luxury-gold.jpg', 12)
on conflict (slug) do nothing;

-- Efectos Especiales
insert into public.catalog_items (category_id, slug, name, description, price, price_label, unit, image_url, sort_order) values
  ((select id from public.categories where slug = 'efectos-especiales'), 'maquina-fuego', 'Maquina de Fuego', '30 disparos de fuego controlado para momentos espectaculares y seguros.', 990, '$990 MXN', 'por hora', '/images/catalog/fx-fire.jpg', 1),
  ((select id from public.categories where slug = 'efectos-especiales'), 'chispero', 'Chispero', 'Chispas frias de pirotecnia controlada para realzar momentos especiales de forma segura.', 385, '$385 MXN', 'por detonacion', '/images/catalog/fx-sparkler.jpg', 2),
  ((select id from public.categories where slug = 'efectos-especiales'), 'maquina-co2', 'Maquina CO2 (papel plata)', 'Efecto de CO2 con papel plata para momentos de alto impacto visual.', 2200, '$2,200 MXN', 'por hora', '/images/catalog/fx-co2.jpg', 3),
  ((select id from public.categories where slug = 'efectos-especiales'), 'papel-mariposa', 'Papel Mariposa', 'Efecto de papel mariposa que cae suavemente para crear un ambiente romantico.', 660, '$660 MXN', 'extra', '/images/catalog/fx-butterfly.jpg', 4),
  ((select id from public.categories where slug = 'efectos-especiales'), 'papel-color', 'Papel de Color', 'Confeti y papel de colores personalizados para celebraciones vibrantes.', 770, '$770 MXN', 'extra', '/images/catalog/fx-confetti.jpg', 5),
  ((select id from public.categories where slug = 'efectos-especiales'), 'maquina-humo', 'Maquina de Humo', 'Humo atmosferico para crear ambientes misteriosos y dramaticos.', 825, '$825 MXN', 'por evento', '/images/catalog/fx-smoke.jpg', 6),
  ((select id from public.categories where slug = 'efectos-especiales'), 'aro-laser', 'Aro Laser', 'Show de laser con aro envolvente para una experiencia visual futurista.', 3300, '$3,300 MXN', 'por evento', '/images/catalog/fx-laser.jpg', 7)
on conflict (slug) do nothing;

-- Shows en Vivo
insert into public.catalog_items (category_id, slug, name, description, price, price_label, unit, image_url, sort_order) values
  ((select id from public.categories where slug = 'shows'), 'robot-led', 'Robot LED', 'Robot LED interactivo que ilumina y anima la fiesta con coreografias y efectos luminosos.', 2145, '$2,145 MXN', 'por show', '/images/catalog/show-robot.jpg', 1),
  ((select id from public.categories where slug = 'shows'), 'show-drones', 'Show de Drones', 'Show aereo con minimo 20 drones creando figuras personalizadas en el cielo nocturno.', 6000, '$6,000 MXN', 'por figura (min. 20 drones)', '/images/catalog/show-drones.jpg', 2)
on conflict (slug) do nothing;

-- Pistas de Baile
insert into public.catalog_items (category_id, slug, name, description, price, price_label, unit, image_url, sort_order) values
  ((select id from public.categories where slug = 'pistas-baile'), 'pista-pixeles-4x4', 'Pista Pixeles 4x4', 'Pista de pixeles LED de 4x4 metros con efectos interactivos y reactivos a la musica.', 5500, '$5,500 MXN', 'por evento', '/images/catalog/floor-pixel.jpg', 1),
  ((select id from public.categories where slug = 'pistas-baile'), 'pista-pixeles-6x5', 'Pista Pixeles 6x5', 'Pista de pixeles LED de 6x5 metros, ideal para eventos grandes con muchos invitados.', 12100, '$12,100 MXN', 'por evento', '/images/catalog/floor-pixel-large.jpg', 2),
  ((select id from public.categories where slug = 'pistas-baile'), 'pista-blanca-4x4', 'Pista Blanca 4x4', 'Pista blanca elegante de 4x4 metros, perfecta para bodas y eventos sofisticados.', 3960, '$3,960 MXN', 'por evento', '/images/catalog/floor-white.jpg', 3),
  ((select id from public.categories where slug = 'pistas-baile'), 'pista-blanca-6x5', 'Pista Blanca 6x5', 'Pista blanca elegante de 6x5 metros para eventos de gran escala.', 8800, '$8,800 MXN', 'por evento', '/images/catalog/floor-white-large.jpg', 4),
  ((select id from public.categories where slug = 'pistas-baile'), 'pista-personalizada-hd', 'Pista Personalizada HD', 'Pista con graficos HD personalizados. Logotipos, imagenes o disenos a tu gusto.', 5500, '$5,500 - $12,100 MXN', 'segun tamano', '/images/catalog/floor-custom.jpg', 5)
on conflict (slug) do nothing;

-- Mobiliario Premium
insert into public.catalog_items (category_id, slug, name, description, price, price_label, unit, image_url, sort_order) values
  ((select id from public.categories where slug = 'mobiliario'), 'silla-tiffany', 'Silla Tiffany', 'Silla Tiffany clasica, ideal para bodas y eventos elegantes. Disponible en varios colores.', 38.50, '$38.50 MXN', 'por unidad', '/images/catalog/chair-tiffany.jpg', 1),
  ((select id from public.categories where slug = 'mobiliario'), 'silla-chanel', 'Silla Chanel (dorada/negra)', 'Silla Chanel en acabado dorado o negro. Elegancia y modernidad en cada detalle.', 44, '$44 MXN', 'por unidad', '/images/catalog/chair-chanel.jpg', 2),
  ((select id from public.categories where slug = 'mobiliario'), 'silla-crossback', 'Silla Crossback', 'Silla Crossback de madera con respaldo cruzado. Estilo rustico-chic para eventos al aire libre.', 82.50, '$82.50 MXN', 'por unidad', '/images/catalog/chair-crossback.jpg', 3),
  ((select id from public.categories where slug = 'mobiliario'), 'silla-thonik', 'Silla Thonik', 'Silla Thonik de diseno contemporaneo, perfecta para eventos corporativos y sociales.', 132, '$132 MXN', 'por unidad', '/images/catalog/chair-thonik.jpg', 4),
  ((select id from public.categories where slug = 'mobiliario'), 'silla-sewing', 'Silla Sewing', 'Silla Sewing premium de alta gama. La opcion mas sofisticada para eventos exclusivos.', 154, '$154 MXN', 'por unidad', '/images/catalog/chair-sewing.jpg', 5)
on conflict (slug) do nothing;

-- Plantas de Energia
insert into public.catalog_items (category_id, slug, name, description, price, price_label, unit, image_url, sort_order) values
  ((select id from public.categories where slug = 'energia'), 'planta-60kva', 'Planta 60 KVA', 'Planta de luz de 60 KVA para eventos grandes con alto consumo de energia. 8 horas.', 10450, '$10,450 MXN', '8 hrs', '/images/catalog/power-60.jpg', 1),
  ((select id from public.categories where slug = 'energia'), 'planta-40kva', 'Planta 40 KVA', 'Planta de luz de 40 KVA para eventos medianos. 8 horas de suministro confiable.', 7700, '$7,700 MXN', '8 hrs', '/images/catalog/power-40.jpg', 2),
  ((select id from public.categories where slug = 'energia'), 'planta-3000w', 'Planta 3000W', 'Planta compacta de 3000W para eventos pequenos o respaldo de energia. 8 horas.', 2750, '$2,750 MXN', '8 hrs', '/images/catalog/power-3000.jpg', 3)
on conflict (slug) do nothing;

-- Catering & Alimentos
insert into public.catalog_items (category_id, slug, name, description, price, price_label, unit, image_url, sort_order) values
  ((select id from public.categories where slug = 'catering'), 'coffee-break', 'Coffee Break', 'Servicio de coffee break con cafe, te, galletas y panes finos para tus invitados.', 90, '$90 MXN', 'por persona', '/images/catalog/catering-coffee.jpg', 1),
  ((select id from public.categories where slug = 'catering'), 'snacks', 'Snacks', 'Seleccion de snacks variados y bocadillos para acompanar cualquier tipo de evento.', 70, '$70 MXN', 'por persona', '/images/catalog/catering-snacks.jpg', 2)
on conflict (slug) do nothing;

-- Cabinas Fotograficas
insert into public.catalog_items (category_id, slug, name, description, price, price_label, unit, image_url, sort_order) values
  ((select id from public.categories where slug = 'cabinas-foto'), 'cabina-360', 'Cabina 360', 'Cabina giratoria que captura videos panoramicos en 360 grados para compartir al instante en redes sociales.', 6000, '$6,000 MXN', 'por evento', '/images/catalog/booth-360.jpg', 1),
  ((select id from public.categories where slug = 'cabinas-foto'), 'cabina-180', 'Cabina 180', 'Cabina semicircular que captura fotos y videos divertidos con accesorios y fondos personalizados.', 5000, '$5,000 MXN', 'por evento', '/images/catalog/booth-180.jpg', 2),
  ((select id from public.categories where slug = 'cabinas-foto'), 'espejo-magico', 'Espejo Magico', 'Espejo fotografico interactivo con impresiones instantaneas, animaciones y accesorios divertidos.', 4500, '$4,500 MXN', 'por evento', '/images/catalog/booth-mirror.jpg', 3)
on conflict (slug) do nothing;

-- Servicios Adicionales
insert into public.catalog_items (category_id, slug, name, description, price, price_label, unit, image_url, sort_order) values
  ((select id from public.categories where slug = 'extras'), 'barra-bebidas', 'Barra de Bebidas', 'Barras moviles con bartenders profesionales y menus de cocteles personalizados.', 3500, '$3,500 MXN', 'por evento', '/images/catalog/extra-bar.jpg', 1),
  ((select id from public.categories where slug = 'extras'), 'fotografia-video', 'Fotografia & Video', 'Equipo de fotografos y videografos profesionales para capturar cada instante de tu evento.', 4500, '$4,500 MXN', 'por evento', '/images/catalog/extra-photo.jpg', 2),
  ((select id from public.categories where slug = 'extras'), 'decoracion', 'Decoracion y Ambientacion', 'Carpas, backdrops, centros de mesa y elementos decorativos personalizados para tu celebracion.', 0, 'Cotizar', 'personalizado', '/images/catalog/extra-decor.jpg', 3)
on conflict (slug) do nothing;

-- Seed gallery media (existing videos from video-showcase)
insert into public.gallery_media (title, description, media_url, media_type, sort_order) values
  ('Boda Elegante', 'Bodas con iluminacion cinematografica y audio premium', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'video', 1),
  ('Evento Corporativo', 'Produccion profesional para eventos empresariales', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'video', 2),
  ('Fiesta VIP', 'Shows de luz y efectos especiales de alto impacto', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'video', 3);
