"use client";

import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "e360.simple.v1";

const CATALOG = [
  { id: "PKG-CAB-001", name: "Cabina Blanca", category: "Packages", subcategory: "DJ / Audio", unit: "paquete", price: 4830, hrs: 5 },
  { id: "PKG-MAG-002", name: "Magic", category: "Packages", subcategory: "DJ / Audio", unit: "paquete", price: 6820, hrs: 5 },
  { id: "PKG-MAGP-003", name: "Magic Pixeles", category: "Packages", subcategory: "DJ / Audio", unit: "paquete", price: 6820, hrs: 5 },
  { id: "PKG-PTY-004", name: "Party (sin pantallas)", category: "Packages", subcategory: "DJ / Audio", unit: "paquete", price: 8140, hrs: 5 },
  { id: "PKG-PTY-005", name: "Party (con pantallas 55”)", category: "Packages", subcategory: "DJ / Audio", unit: "paquete", price: 11000, hrs: 5 },
  { id: "PKG-BLK-006", name: "Black", category: "Packages", subcategory: "DJ / Audio", unit: "paquete", price: 9900, hrs: 5 },
  { id: "PKG-LP-007", name: "Luxury Petite", category: "Packages", subcategory: "DJ / Audio", unit: "paquete", price: 17600, hrs: 6 },
  { id: "PKG-FNC-008", name: "Fancy", category: "Packages", subcategory: "DJ / Audio", unit: "paquete", price: 17600, hrs: 6 },
  { id: "PKG-LUX-009", name: "Luxury", category: "Packages", subcategory: "DJ / Audio", unit: "paquete", price: 30800, hrs: 6 },
  { id: "PKG-GB-010", name: "Gold Bar", category: "Packages", subcategory: "DJ / Audio", unit: "paquete", price: 36300, hrs: 6 },
  { id: "PKG-SD-011", name: "Sweet Dream", category: "Packages", subcategory: "DJ / Audio", unit: "paquete", price: 46200, hrs: 7 },
  { id: "PKG-LG-012", name: "Luxury Gold (todo incluido)", category: "Packages", subcategory: "Full Event", unit: "persona", price: 1650, hrs: null },

  { id: "FX-FIRE-001", name: "Máquina de fuego (30 disparos)", category: "Effects", unit: "hora", price: 990 },
  { id: "FX-SPARK-002", name: "Chispero", category: "Effects", unit: "detonación", price: 385 },
  { id: "FX-CO2-003", name: "Máquina CO2 (papel plata)", category: "Effects", unit: "hora", price: 2200 },
  { id: "FX-CO2-004", name: "Papel mariposa", category: "Effects", unit: "extra", price: 660 },
  { id: "FX-CO2-005", name: "Papel color", category: "Effects", unit: "extra", price: 770 },
  { id: "FX-ROBOT-006", name: "Robot LED", category: "Shows", unit: "show", price: 2145 },
  { id: "FX-SMOKE-007", name: "Máquina de humo", category: "Effects", unit: "evento", price: 825 },
  { id: "FX-AROL-008", name: "Aro Láser", category: "Effects", unit: "evento", price: 3300 },
  { id: "FX-DRONE-009", name: "Show de Drones (mín. 20)", category: "Shows", unit: "figura", price: 6000 },

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
  { id: "FL-CST-017", name: "Pista Personalizada HD", category: "Dance Floor", size: "4x4–6x5", unit: "evento", price: 5500, priceNote: "Rango $5,500–$12,100" },

  { id: "LZ-TRI-001", name: "Plato trinche negro", category: "Loza", unit: "pieza", price: 22 },
  { id: "LZ-CUA-002", name: "Plato cuadrado", category: "Loza", unit: "pieza", price: 16 },
  { id: "LZ-ECO-003", name: "Plato económico", category: "Loza", unit: "pieza", price: 11 },
  { id: "LZ-VDR-004", name: "Sobre plato vidrio", category: "Loza", unit: "pieza", price: 18 },

  { id: "CU-STD-001", name: "Cuchara", category: "Cubiertos", unit: "pieza", price: 8 },
  { id: "CU-STD-002", name: "Cuchillo", category: "Cubiertos", unit: "pieza", price: 8 },
  { id: "CU-STD-003", name: "Tenedor", category: "Cubiertos", unit: "pieza", price: 8 },
  { id: "CU-GLD-004", name: "Cubiertos dorados", category: "Cubiertos", unit: "pieza", price: 17 },

  { id: "GL-JAI-001", name: "Vaso jaibolero", category: "Cristalería", unit: "pieza", price: 11 },
  { id: "GL-GLO-002", name: "Copa globo", category: "Cristalería", unit: "pieza", price: 15 },
  { id: "GL-MAR-003", name: "Copa margarita", category: "Cristalería", unit: "pieza", price: 14 },
  { id: "GL-CHA-004", name: "Copa champagne", category: "Cristalería", unit: "pieza", price: 14 },
  { id: "GL-OLD-005", name: "Old Fashion", category: "Cristalería", unit: "pieza", price: 15 },

  { id: "PWR-60-001", name: "Planta de luz 60 KVA", category: "Power", unit: "bloque", hours: 8, price: 10450 },
  { id: "PWR-40-002", name: "Planta de luz 40 KVA", category: "Power", unit: "bloque", hours: 8, price: 7700 },
  { id: "PWR-3K-003", name: "Planta 3000W", category: "Power", unit: "bloque", hours: 8, price: 2750 },

  { id: "FB-CFE-001", name: "Coffee Break", category: "Food", unit: "persona", price: 90 },
  { id: "FB-SNK-002", name: "Snacks", category: "Food", unit: "persona", price: 70 }
];

const CATEGORY_META = {
  Packages: {
    label: "Paquetes (DJ / Audio)",
    desc: "Paquetes completos por evento: cabina, DJ y experiencias. Ideal si quieres algo listo sin armar todo pieza por pieza."
  },
  Effects: {
    label: "Efectos (FX)",
    desc: "Efectos puntuales para momentos clave: fuego, CO2, humo, láser, papel y extras."
  },
  Shows: {
    label: "Shows",
    desc: "Shows especiales para impactar: robot LED y drones (según disponibilidad)."
  },
  Furniture: {
    label: "Mobiliario (Sillas)",
    desc: "Sillas por unidad. Multiplica por la cantidad de invitados."
  },
  "Dance Floor": {
    label: "Pistas de baile",
    desc: "Pistas por tamaño. Elige la medida según el aforo y el layout."
  },
  Loza: {
    label: "Loza",
    desc: "Platos y sobre platos por pieza."
  },
  Cubiertos: {
    label: "Cubiertos",
    desc: "Cubiertos por pieza (cuchara, cuchillo, tenedor; opción dorada)."
  },
  Cristalería: {
    label: "Cristalería",
    desc: "Vasos y copas por pieza."
  },
  Power: {
    label: "Energía (Plantas)",
    desc: "Plantas de luz por bloque de tiempo. Útil cuando el venue no garantiza energía estable."
  },
  Food: {
    label: "Alimentos (por persona)",
    desc: "Extras por persona: coffee break y snacks."
  }
};

const PRODUCT_DESC = {
  "PKG-CAB-001": "Cabina + DJ base para 5 hrs. Ideal para evento mediano.",
  "PKG-MAG-002": "Paquete con look premium y operación simple (5 hrs).",
  "PKG-PTY-005": "Party con pantallas 55\" para visuales (5 hrs).",
  "FX-FIRE-001": "Efecto de fuego para momentos clave (entrada / brindis / baile).",
  "CH-TIF-001": "Silla Tiffany clásica. Precio por unidad.",
  "PWR-60-001": "Respaldo de energía para venues sin suministro confiable (8 hrs)."
};

function getProductDesc(p) {
  return PRODUCT_DESC[p.id] || "Descripción pendiente (placeholder).";
}

function uid(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function clampInt(n, min, max) {
  const x = Number.isFinite(n) ? Math.floor(n) : 0;
  return Math.max(min, Math.min(max, x));
}

function currencyMXN(n) {
  try {
    return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
  } catch {
    return `$${(n || 0).toFixed(2)}`;
  }
}

function safeText(s) {
  return String(s ?? "").replace(/\s+/g, " ").trim();
}

function makeWhatsAppLink(text) {
  const encoded = encodeURIComponent(text);
  return `https://wa.me/?text=${encoded}`;
}

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveState(next) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    return;
  }
}

export default function Eventos360SimpleApp() {
  const [tab, setTab] = useState("inicio");

  const [data, setData] = useState(() => ({
    schema: "e360-simple-v1",
    clients: [],
    events: [],
    ui: {
      catalogQuery: "",
      catalogCategory: "",
      selectedClientId: "",
      selectedEventId: "",
      debug: false,
      lastAction: "",
      lastAt: 0
    }
  }));

  useEffect(() => {
    const loaded = loadState();
    if (loaded && loaded.schema === "e360-simple-v1") {
      setData((prev) => ({
        ...prev,
        ...loaded,
        ui: { ...prev.ui, ...(loaded.ui || {}) }
      }));
    }
  }, []);

  useEffect(() => {
    saveState(data);
  }, [data]);

  const clientsById = useMemo(() => {
    const map = {};
    for (const c of data.clients) map[c.id] = c;
    return map;
  }, [data.clients]);

  const eventsById = useMemo(() => {
    const map = {};
    for (const e of data.events) map[e.id] = e;
    return map;
  }, [data.events]);

  const categories = useMemo(() => {
    const set = new Set();
    for (const p of CATALOG) set.add(p.category);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, []);

  const filteredCatalog = useMemo(() => {
    const q = safeText(data.ui.catalogQuery).toLowerCase();
    const cat = safeText(data.ui.catalogCategory);
    return CATALOG.filter((p) => {
      const okCat = !cat || p.category === cat;
      const okQ = !q || `${p.id} ${p.name} ${p.category}`.toLowerCase().includes(q);
      return okCat && okQ;
    });
  }, [data.ui.catalogQuery, data.ui.catalogCategory]);

  const selectedEvent = data.ui.selectedEventId ? eventsById[data.ui.selectedEventId] : null;

  const selectedEventTotals = useMemo(() => {
    if (!selectedEvent) return { items: 0, subtotal: 0 };
    const items = Array.isArray(selectedEvent.items) ? selectedEvent.items : [];
    let subtotal = 0;
    let count = 0;
    for (const it of items) {
      const qty = it.qty || 0;
      count += qty;
      subtotal += (it.price || 0) * qty;
    }
    return { items: count, subtotal };
  }, [selectedEvent]);

  function updateUI(patch) {
    setData((d) => ({ ...d, ui: { ...d.ui, ...patch } }));
  }

  function logAction(msg) {
    updateUI({ lastAction: msg, lastAt: Date.now() });
  }

  function addClient() {
    const name = safeText(prompt("Nombre del cliente:") || "");
    if (!name) return;
    const phone = safeText(prompt("Teléfono (opcional):") || "");
    const notes = safeText(prompt("Notas (opcional):") || "");

    const client = { id: uid("CLI"), name, phone, notes, createdAt: Date.now() };
    setData((d) => ({
      ...d,
      clients: [client, ...d.clients],
      ui: { ...d.ui, selectedClientId: client.id }
    }));
    logAction(`Cliente: ${client.id}`);
  }

  function editClient(id) {
    const c = clientsById[id];
    if (!c) return;
    const name = safeText(prompt("Editar nombre:", c.name) || "");
    if (!name) return;
    const phone = safeText(prompt("Editar teléfono:", c.phone || "") || "");
    const notes = safeText(prompt("Editar notas:", c.notes || "") || "");

    setData((d) => ({
      ...d,
      clients: d.clients.map((x) => (x.id === id ? { ...x, name, phone, notes } : x))
    }));
    logAction(`Editar cliente: ${id}`);
  }

  function deleteClient(id) {
    const c = clientsById[id];
    if (!c) return;
    if (!confirm(`¿Eliminar cliente: ${c.name}?`)) return;

    setData((d) => ({
      ...d,
      clients: d.clients.filter((x) => x.id !== id),
      events: d.events.map((e) => (e.clientId === id ? { ...e, clientId: "" } : e)),
      ui: {
        ...d.ui,
        selectedClientId: d.ui.selectedClientId === id ? "" : d.ui.selectedClientId
      }
    }));
    logAction(`Eliminar cliente: ${id}`);
  }

  function addEvent() {
    const title = safeText(prompt("Nombre del evento:") || "");
    if (!title) return;

    const date = safeText(prompt("Fecha (YYYY-MM-DD):", todayISO()) || "");
    const location = safeText(prompt("Lugar (opcional):") || "");

    let clientId = data.ui.selectedClientId || "";
    if (data.clients.length) {
      const useSelected = clientId ? clientsById[clientId]?.name : "";
      const choice = safeText(
        prompt(`Cliente (opcional) — escribe el nombre exacto o deja vacío.\nSeleccionado: ${useSelected || "(ninguno)"}`) || ""
      );

      if (choice) {
        const found = data.clients.find((c) => c.name.toLowerCase() === choice.toLowerCase());
        if (found) clientId = found.id;
      }
    }

    const event = {
      id: uid("EVT"),
      title,
      date,
      location,
      clientId,
      notes: "",
      items: [],
      createdAt: Date.now()
    };

    setData((d) => ({
      ...d,
      events: [event, ...d.events],
      ui: { ...d.ui, selectedEventId: event.id }
    }));
    logAction(`Evento: ${event.id}`);
  }

  function editEvent(id) {
    const e = eventsById[id];
    if (!e) return;

    const title = safeText(prompt("Editar nombre del evento:", e.title) || "");
    if (!title) return;
    const date = safeText(prompt("Editar fecha (YYYY-MM-DD):", e.date || todayISO()) || "");
    const location = safeText(prompt("Editar lugar:", e.location || "") || "");
    const notes = safeText(prompt("Editar notas:", e.notes || "") || "");

    setData((d) => ({
      ...d,
      events: d.events.map((x) => (x.id === id ? { ...x, title, date, location, notes } : x))
    }));
    logAction(`Editar evento: ${id}`);
  }

  function deleteEvent(id) {
    const e = eventsById[id];
    if (!e) return;
    if (!confirm(`¿Eliminar evento: ${e.title}?`)) return;

    setData((d) => ({
      ...d,
      events: d.events.filter((x) => x.id !== id),
      ui: { ...d.ui, selectedEventId: d.ui.selectedEventId === id ? "" : d.ui.selectedEventId }
    }));
    logAction(`Eliminar evento: ${id}`);
  }

  function linkEventClient(eventId) {
    const e = eventsById[eventId];
    if (!e) return;
    if (!data.clients.length) {
      alert("Primero crea un cliente.");
      setTab("clientes");
      return;
    }

    const list = data.clients.map((c) => `• ${c.name}`).join("\n");
    const choice = safeText(prompt(`Elige cliente (escribe el nombre exacto):\n\n${list}`) || "");
    if (!choice) return;
    const found = data.clients.find((c) => c.name.toLowerCase() === choice.toLowerCase());
    if (!found) {
      alert("No se encontró ese cliente. Verifica el nombre.");
      return;
    }

    setData((d) => ({
      ...d,
      events: d.events.map((x) => (x.id === eventId ? { ...x, clientId: found.id } : x))
    }));
    logAction(`Vincular cliente: ${eventId}`);
  }

  function addItemToSelectedEvent(product) {
    if (!selectedEvent) {
      alert("Primero selecciona o crea un evento.");
      setTab("eventos");
      return;
    }

    setData((d) => ({
      ...d,
      events: d.events.map((e) => {
        if (e.id !== selectedEvent.id) return e;
        const items = Array.isArray(e.items) ? e.items.slice() : [];
        const idx = items.findIndex((it) => it.productId === product.id);
        if (idx >= 0) {
          items[idx] = { ...items[idx], qty: clampInt((items[idx].qty || 0) + 1, 0, 9999) };
        } else {
          items.push({
            productId: product.id,
            name: product.name,
            unit: product.unit,
            price: product.price,
            qty: 1
          });
        }
        return { ...e, items };
      })
    }));
    logAction(`Agregar: ${product.id}`);
  }

  function decItemFromSelectedEvent(productId) {
    if (!selectedEvent) {
      alert("Primero selecciona o crea un evento.");
      setTab("eventos");
      return;
    }

    setData((d) => ({
      ...d,
      events: d.events.map((e) => {
        if (e.id !== selectedEvent.id) return e;
        const items = Array.isArray(e.items) ? e.items.slice() : [];
        const idx = items.findIndex((it) => it.productId === productId);
        if (idx < 0) return e;
        const nextQty = clampInt((items[idx].qty || 0) - 1, 0, 9999);
        if (nextQty === 0) items.splice(idx, 1);
        else items[idx] = { ...items[idx], qty: nextQty };
        return { ...e, items };
      })
    }));
    logAction(`Quitar: ${productId}`);
  }

  function setItemQty(productId, nextQty) {
    if (!selectedEvent) return;
    const qty = clampInt(nextQty, 0, 9999);

    setData((d) => ({
      ...d,
      events: d.events.map((e) => {
        if (e.id !== selectedEvent.id) return e;
        const items = Array.isArray(e.items) ? e.items.slice() : [];
        const idx = items.findIndex((it) => it.productId === productId);
        if (idx < 0) return e;
        if (qty === 0) items.splice(idx, 1);
        else items[idx] = { ...items[idx], qty };
        return { ...e, items };
      })
    }));
    logAction(`Qty: ${productId} -> ${qty}`);
  }

  function buildWhatsAppMessage(e) {
    const client = e.clientId ? clientsById[e.clientId] : null;
    const lines = [];
    lines.push("EVENTOS 360 — Cotización");
    lines.push("--------------------------");
    lines.push(`Evento: ${e.title}`);
    if (e.date) lines.push(`Fecha: ${e.date}`);
    if (e.location) lines.push(`Lugar: ${e.location}`);
    if (client) {
      lines.push(`Cliente: ${client.name}`);
      if (client.phone) lines.push(`Tel: ${client.phone}`);
    }
    lines.push("--------------------------");

    const items = Array.isArray(e.items) ? e.items : [];
    if (!items.length) {
      lines.push("(Sin items aún)");
    } else {
      for (const it of items) {
        const subtotal = (it.price || 0) * (it.qty || 0);
        lines.push(`${it.qty} x ${it.name} (${it.unit}) — ${currencyMXN(subtotal)} [${it.productId}]`);
      }
    }

    const total = items.reduce((acc, it) => acc + (it.price || 0) * (it.qty || 0), 0);
    lines.push("--------------------------");
    lines.push(`TOTAL: ${currencyMXN(total)}`);
    lines.push("\n¿Te confirmo disponibilidad y te mando contrato? ✅");

    return lines.join("\n");
  }

  function resetAll() {
    if (!confirm("Esto borrará TODO (clientes, eventos y estado). ¿Seguro?")) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      return;
    }
    setData({
      schema: "e360-simple-v1",
      clients: [],
      events: [],
      ui: {
        catalogQuery: "",
        catalogCategory: "",
        selectedClientId: "",
        selectedEventId: "",
        debug: false,
        lastAction: "",
        lastAt: 0
      }
    });
    setTab("inicio");
  }

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <div>
            <div style={styles.title}>Eventos 360</div>
            <div style={styles.subtitle}>Panel simple (estable) — catálogo + clientes + eventos</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              style={styles.ghostBtn}
              onClick={() => updateUI({ debug: !data.ui.debug })}
              title="Ver estado interno"
            >
              Debug
            </button>
            <button style={styles.ghostBtn} onClick={resetAll} title="Borrar todo">
              Reset
            </button>
          </div>
        </header>

        <main style={styles.main}>
          {tab === "inicio" && (
            <Inicio
              data={data}
              clientsById={clientsById}
              onGo={(t) => setTab(t)}
              selectedEvent={selectedEvent}
              totals={selectedEventTotals}
            />
          )}

          {tab === "catalogo" && (
            <Catalogo
              query={data.ui.catalogQuery}
              category={data.ui.catalogCategory}
              categories={categories}
              products={filteredCatalog}
              onQuery={(v) => updateUI({ catalogQuery: v })}
              onCategory={(v) => updateUI({ catalogCategory: v })}
              onAddToQuote={addItemToSelectedEvent}
              onDecFromQuote={decItemFromSelectedEvent}
              selectedEvent={selectedEvent}
            />
          )}

          {tab === "clientes" && (
            <Clientes
              clients={data.clients}
              selectedClientId={data.ui.selectedClientId}
              onSelect={(id) => updateUI({ selectedClientId: id })}
              onAdd={addClient}
              onEdit={editClient}
              onDelete={deleteClient}
            />
          )}

          {tab === "eventos" && (
            <Eventos
              events={data.events}
              clientsById={clientsById}
              selectedEventId={data.ui.selectedEventId}
              onSelect={(id) => updateUI({ selectedEventId: id })}
              onAdd={addEvent}
              onEdit={editEvent}
              onDelete={deleteEvent}
              onLinkClient={linkEventClient}
              onQty={setItemQty}
              onWhatsApp={(e) => {
                const msg = buildWhatsAppMessage(e);
                window.open(makeWhatsAppLink(msg), "_blank", "noopener,noreferrer");
              }}
            />
          )}

          {data.ui.debug ? <DebugPanel tab={tab} data={data} selectedEvent={selectedEvent} totals={selectedEventTotals} /> : null}
        </main>

        <nav style={styles.bottomNav}>
          <TabBtn label="Inicio" active={tab === "inicio"} onClick={() => setTab("inicio")} />
          <TabBtn label="Catálogo" active={tab === "catalogo"} onClick={() => setTab("catalogo")} />
          <TabBtn label="Clientes" active={tab === "clientes"} onClick={() => setTab("clientes")} />
          <TabBtn label="Eventos" active={tab === "eventos"} onClick={() => setTab("eventos")} />
        </nav>
      </div>
    </div>
  );
}

function DebugPanel({ tab, data, selectedEvent, totals }) {
  const safe = {
    tab,
    schema: data.schema,
    counts: { clients: data.clients.length, events: data.events.length },
    ui: data.ui,
    selectedEvent: selectedEvent
      ? {
          id: selectedEvent.id,
          title: selectedEvent.title,
          date: selectedEvent.date,
          items: Array.isArray(selectedEvent.items) ? selectedEvent.items.length : 0
        }
      : null,
    totals
  };

  return (
    <div style={styles.debugWrap}>
      <div style={styles.debugTop}>
        <div style={{ fontWeight: 900 }}>Debug</div>
        <div style={styles.mutedSmall}>
          Última acción: {data.ui.lastAction || "(ninguna)"}
          {data.ui.lastAt ? ` • ${new Date(data.ui.lastAt).toLocaleString("es-MX")}` : ""}
        </div>
      </div>
      <pre style={styles.debugPre}>{JSON.stringify(safe, null, 2)}</pre>
    </div>
  );
}

function TabBtn({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ ...styles.tabBtn, ...(active ? styles.tabBtnActive : null) }}>
      {label}
    </button>
  );
}

function Inicio({ data, clientsById, onGo, selectedEvent, totals }) {
  const nextEvent = useMemo(() => {
    const list = [...data.events];
    const dated = list.filter((x) => safeText(x.date));
    dated.sort((a, b) => String(a.date).localeCompare(String(b.date)));
    return dated[0] || list[0] || null;
  }, [data.events]);

  const galleryItems = [
    {
      id: "1",
      url: "https://res.cloudinary.com/dpnkrz8c8/video/upload/v1722652865/20220910_190614_cqbqgk.mp4",
      title_es: "Eventos Corporativos",
      title_en: "Corporate Events",
      description_es: "Producción profesional para eventos empresariales",
      type: "video"
    },
    {
      id: "2",
      url: "https://res.cloudinary.com/dpnkrz8c8/video/upload/v1722652866/20221126_234749_qpbx4o.mp4",
      title_es: "Bodas de Ensueño",
      title_en: "Dream Weddings",
      description_es: "Momentos mágicos para tu día especial",
      type: "video"
    },
    {
      id: "3",
      url: "https://res.cloudinary.com/dpnkrz8c8/video/upload/v1722652866/20230323_222942_lwxuwb.mp4",
      title_es: "Fiestas Privadas",
      title_en: "Private Parties",
      description_es: "Ambiente perfecto para celebraciones íntimas",
      type: "video"
    },
    {
      id: "4",
      url: "https://res.cloudinary.com/dpnkrz8c8/video/upload/v1722652850/20230323_224002_xpuuvd.mp4",
      title_es: "Shows Especiales",
      title_en: "Special Shows",
      description_es: "Robot LED y efectos que impresionan",
      type: "video"
    },
    {
      id: "5",
      url: "https://res.cloudinary.com/dpnkrz8c8/video/upload/v1722652863/VID_20231014_235307_1_v1hfnm.mp4",
      title_es: "XV Años",
      title_en: "Quinceanera",
      description_es: "La fiesta perfecta para tus quince años",
      type: "video"
    },
    {
      id: "6",
      url: "https://res.cloudinary.com/dpnkrz8c8/video/upload/v1722652864/20230210_233455_i54biz.mp4",
      title_es: "Producción Integral",
      title_en: "Full Production",
      description_es: "Audio, iluminación y efectos profesionales",
      type: "video"
    }
  ];

  // Canvas animation for hero
  useEffect(() => {
    const canvas = document.getElementById("heroCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let particles = [];
    const particleCount = 80;

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 80 + Math.random() * 40;
      particles.push({
        x: canvas.width / 2 + Math.cos(angle) * radius,
        y: canvas.height / 2 + Math.sin(angle) * radius,
        z: Math.random() * 200 - 100,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        vz: (Math.random() - 0.5) * 2,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3
      });
    }

    let audioLevel = 0;
    let frameCount = 0;

    const animate = () => {
      ctx.fillStyle = "rgba(3, 7, 18, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Slow animation without audio
      frameCount += 1;
      audioLevel = (Math.sin(frameCount * 0.005) + 1) * 0.3;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Gravity towards center
        const dx = centerX - p.x;
        const dy = centerY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
          p.vx += (dx / distance) * 0.08 * (1 + audioLevel);
          p.vy += (dy / distance) * 0.08 * (1 + audioLevel);
        }

        // Damping
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.vz *= 0.98;

        // Perspective
        const scale = 200 / (200 + p.z);
        const x = centerX + (p.x - centerX) * scale;
        const y = centerY + (p.y - centerY) * scale;
        const size = p.size * scale;

        // Draw particle
        const hue = (Math.atan2(p.y - centerY, p.x - centerX) * 180) / Math.PI + 180;
        ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${p.opacity * (0.5 + audioLevel)})`;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(size, 1), 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw center orb
      const orbRadius = 25 + audioLevel * 15;
      const orbGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, orbRadius);
      orbGradient.addColorStop(0, `hsla(38, 100%, 50%, ${0.8 + audioLevel * 0.2})`);
      orbGradient.addColorStop(1, `hsla(38, 100%, 50%, ${0.1})`);
      ctx.fillStyle = orbGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw glow ring
      ctx.strokeStyle = `hsla(38, 100%, 60%, ${0.3 + audioLevel * 0.3})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbRadius * 0.8, 0, Math.PI * 2);
      ctx.stroke();

      requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Hero with Audio Particles */}
      <div style={{ position: "relative", width: "100%", minHeight: "600px" }}>
        <iframe
          src="about:blank"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
            borderRadius: "12px"
          }}
        />
        <div style={{
          position: "relative",
          width: "100%",
          height: "600px",
          background: "linear-gradient(135deg, #030712 0%, #1a1f35 100%)",
          borderRadius: "12px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1
        }}>
          <canvas
            id="heroCanvas"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0
            }}
          />
          <div style={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            color: "white",
            padding: "20px"
          }}>
            <h1 style={{
              fontSize: "3.5rem",
              fontWeight: 900,
              marginBottom: "16px",
              backgroundImage: "linear-gradient(135deg, #ff8c00, #ffd700, #ffff00)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              EVENTOS 360
            </h1>
            <p style={{
              fontSize: "1.25rem",
              color: "#999",
              maxWidth: "600px"
            }}>
              Producción de eventos integral con tecnología de punta
            </p>
          </div>
        </div>
      </div>

      {/* Gallery 3D Slider */}
      <div style={{
        background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(51,27,0,0.1) 100%)",
        padding: "60px 20px",
        marginTop: "40px"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{
              backgroundImage: "linear-gradient(135deg, #ff8c00, #ffd700, #ffff00)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.15em",
              marginBottom: "16px",
              textTransform: "uppercase"
            }}>
              Galería
            </div>
            <h2 style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              color: "#f5f5f5",
              marginBottom: "16px"
            }}>
              Nuestros Eventos
            </h2>
            <p style={{
              fontSize: "1rem",
              color: "#888",
              maxWidth: "600px",
              margin: "0 auto"
            }}>
              Explora nuestros proyectos más destacados
            </p>
          </div>

          {/* Simple Gallery Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px"
          }}>
            {galleryItems.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  position: "relative",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "2px solid #333",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  aspectRatio: "1",
                  background: "#000"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#ffd700";
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(255, 215, 0, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#333";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <video
                  src={item.url}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                  poster={`${item.url}?quality=auto`}
                />
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.8))",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "16px",
                  opacity: 0,
                  transition: "opacity 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "0";
                }}
                >
                  <h3 style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#fff",
                    margin: "0 0 4px 0"
                  }}>
                    {item.title_es}
                  </h3>
                  <p style={{
                    fontSize: "0.75rem",
                    color: "#bbb",
                    margin: 0
                  }}>
                    {item.description_es}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rest of Inicio Component */}
      <div style={styles.section}>
        <div style={styles.rowBetween}>
          <div>
            <div style={styles.h2}>Panel de Control</div>
            <div style={styles.muted}>Tu dashboard rápido para operar.</div>
          </div>
          <div style={styles.pills}>
            <span style={styles.pill}>{data.clients.length} clientes</span>
            <span style={styles.pill}>{data.events.length} eventos</span>
          </div>
        </div>

        <div style={styles.grid2}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Acciones rápidas</div>
            <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
              <button style={styles.primaryBtn} onClick={() => onGo("eventos")}>
                Crear / abrir evento
              </button>
              <button style={styles.secondaryBtn} onClick={() => onGo("clientes")}>
                Crear / abrir cliente
              </button>
              <button style={styles.secondaryBtn} onClick={() => onGo("catalogo")}>
                Ver catálogo
              </button>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>Evento seleccionado</div>
            {!selectedEvent ? (
              <div style={styles.muted}>No hay evento seleccionado. Ve a <b>Eventos</b> y elige uno.</div>
            ) : (
              <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                <div>
                  <b>{selectedEvent.title}</b>
                </div>
                <div style={styles.muted}>
                  {selectedEvent.date || "(sin fecha)"} • {selectedEvent.location || "(sin lugar)"}
                </div>
                <div style={styles.muted}>
                  Cliente: {selectedEvent.clientId ? clientsById[selectedEvent.clientId]?.name || "(no encontrado)" : "(sin cliente)"}
                </div>
                <div style={styles.mutedSmall}>
                  Items: {totals.items} • Subtotal: {currencyMXN(totals.subtotal)}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button style={styles.primaryBtn} onClick={() => onGo("eventos")}>
                    Abrir evento
                  </button>
                  <button style={styles.secondaryBtn} onClick={() => onGo("catalogo")}>
                    Abrir catálogo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Próximo evento</div>
          {!nextEvent ? (
            <div style={styles.muted}>Aún no hay eventos. Crea el primero.</div>
          ) : (
            <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
              <div style={{ fontWeight: 800 }}>{nextEvent.title}</div>
              <div style={styles.mutedSmall}>
                {nextEvent.date || "(sin fecha)"} • {nextEvent.location || "(sin lugar)"}
              </div>
              <div style={styles.mutedSmall}>
                Cliente: {nextEvent.clientId ? clientsById[nextEvent.clientId]?.name || "(no encontrado)" : "(sin cliente)"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Catalogo({ query, category, categories, products, onQuery, onCategory, onAddToQuote, onDecFromQuote, selectedEvent }) {
  const meta = CATEGORY_META[category] || null;

  const qtyMap = useMemo(() => {
    const m = {};
    const items = selectedEvent && Array.isArray(selectedEvent.items) ? selectedEvent.items : [];
    for (const it of items) m[it.productId] = it.qty || 0;
    return m;
  }, [selectedEvent]);

  return (
    <div style={styles.section}>
      <div style={styles.rowBetween}>
        <div>
          <div style={styles.h2}>Catálogo</div>
          <div style={styles.muted}>{meta ? meta.desc : "Toca un producto para agregarlo al evento seleccionado."}</div>
        </div>
        <span style={styles.pill}>{products.length} items</span>
      </div>

      <div style={styles.filters}>
        <input value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Buscar por nombre o ID…" style={styles.input} />
        <select value={category} onChange={(e) => onCategory(e.target.value)} style={styles.select}>
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_META[c]?.label || c}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.noteBox}>
        <div style={{ fontWeight: 600 }}>Evento destino:</div>
        <div style={styles.muted}>{selectedEvent ? selectedEvent.title : "(ninguno seleccionado)"}</div>
      </div>

      <div style={styles.gallery}>
        {products.map((p) => (
          <div
            key={p.id}
            role="button"
            tabIndex={0}
            style={styles.productCard}
            onClick={() => onAddToQuote(p)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onAddToQuote(p);
            }}
            title="Agregar al evento"
          >
            <div style={styles.thumb} aria-hidden>
              <div style={styles.thumbInner} />
            </div>

            <div style={styles.productTop}>
              <div style={styles.productName}>{p.name}</div>
              <div style={styles.productPrice}>{currencyMXN(p.price)}</div>
            </div>

            <div style={styles.productDesc}>{getProductDesc(p)}</div>

            <div style={styles.productMeta}>
              <span style={styles.badge}>{CATEGORY_META[p.category]?.label || p.category}</span>
              {p.subcategory ? <span style={styles.badge}>{p.subcategory}</span> : null}
              {p.size ? <span style={styles.badge}>{p.size}</span> : null}
              {Number.isFinite(p.hrs) ? <span style={styles.badge}>{p.hrs} hrs</span> : null}
              {Number.isFinite(p.hours) ? <span style={styles.badge}>{p.hours} hrs</span> : null}
              <span style={styles.badge}>{p.unit}</span>
            </div>

            {p.priceNote ? <div style={styles.mutedSmall}>{p.priceNote}</div> : null}

            <div style={styles.productId}>{p.id}</div>

            <div style={styles.catalogCtas}>
              <div style={styles.inEventRow}>
                {qtyMap[p.id] ? <span style={styles.inEventPill}>En evento: {qtyMap[p.id]}</span> : <span style={styles.inEventPillMuted}>En evento: 0</span>}
              </div>

              <div style={styles.catalogMiniBtns}>
                <button
                  type="button"
                  style={styles.minusMini}
                  onClick={(ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    onDecFromQuote(p.id);
                  }}
                  aria-label={`Quitar ${p.name}`}
                  title="Quitar"
                >
                  −
                </button>
                <button
                  type="button"
                  style={styles.plusMini}
                  onClick={(ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    onAddToQuote(p);
                  }}
                  aria-label={`Agregar ${p.name}`}
                  title="Agregar"
                >
                  +
                </button>
              </div>
            </div>

            <div style={styles.addHint}>Toca tarjeta o +</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Clientes({ clients, selectedClientId, onSelect, onAdd, onEdit, onDelete }) {
  return (
    <div style={styles.section}>
      <div style={styles.rowBetween}>
        <div>
          <div style={styles.h2}>Clientes</div>
          <div style={styles.muted}>Crea, edita o elimina. Selecciona uno para usarlo al crear eventos.</div>
        </div>
        <button style={styles.primaryBtn} onClick={onAdd}>
          + Nuevo
        </button>
      </div>

      {!clients.length ? (
        <div style={styles.empty}>No hay clientes aún.</div>
      ) : (
        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          {clients.map((c) => (
            <div key={c.id} style={{ ...styles.listRow, ...(c.id === selectedClientId ? styles.listRowActive : null) }}>
              <button style={styles.listMain} onClick={() => onSelect(c.id)}>
                <div style={{ fontWeight: 700 }}>{c.name}</div>
                <div style={styles.mutedSmall}>
                  {c.phone || "(sin teléfono)"}
                  {c.notes ? ` • ${c.notes}` : ""}
                </div>
              </button>
              <div style={styles.rowBtns}>
                <button style={styles.smallBtn} onClick={() => onEdit(c.id)}>
                  Editar
                </button>
                <button style={styles.smallDanger} onClick={() => onDelete(c.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function buildQuoteId(eventId, date) {
  const prefix = "COT";
  const datePart = date ? date.replace(/-/g, "").slice(2) : "000000";
  const idPart = (eventId || "").replace(/\D/g, "").padStart(3, "0").slice(-3);
  return `${prefix}-${datePart}-${idPart}`;
}

function openQuotePDF({ quoteId, clientName, eventTitle, eventDate, location, notes, items }) {
  function fmt(n) {
    return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
  }
  const today = new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" });
  const subtotal = items.reduce((s, li) => s + (li.price || 0) * (li.qty || 0), 0);
  const iva = subtotal * 0.16;
  const total = subtotal + iva;
  const deposit = total * 0.5;
  const balance = total - deposit;

  const rows = items.map((li) => {
    const lineTotal = (li.price || 0) * (li.qty || 0);
    return `<tr>
      <td class="td-sku">${li.productId || ""}</td>
      <td class="td-name">${li.name}${li.unit ? ` <span class="unit">(${li.unit})</span>` : ""}</td>
      <td class="td-num">${li.qty}</td>
      <td class="td-num">${fmt(li.price || 0)}</td>
      <td class="td-num td-bold">${fmt(lineTotal)}</td>
    </tr>`;
  }).join("");

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"/>
  <title>Cotización ${quoteId} — ${clientName}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    @page{size:Letter;margin:18mm 16mm 22mm 16mm}
    html,body{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:#1a1a2e;background:#fff}
    .watermark{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-35deg);width:420px;opacity:.045;pointer-events:none;z-index:0}
    .watermark img{width:100%;display:block;filter:grayscale(1)}
    .doc-header{display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid #f59e0b;padding-bottom:14px;margin-bottom:20px}
    .doc-header-left{display:flex;align-items:center;gap:14px}
    .doc-logo{width:72px;height:72px;object-fit:cover;border-radius:10px}
    .doc-brand-name{font-size:22px;font-weight:900;letter-spacing:-.5px;color:#1a1a2e}
    .doc-brand-sub{font-size:10px;color:#888;letter-spacing:.08em;text-transform:uppercase;margin-top:2px}
    .doc-header-right{text-align:right}
    .doc-quote-label{font-size:9px;text-transform:uppercase;letter-spacing:.2em;color:#888}
    .doc-quote-id{font-size:20px;font-weight:900;color:#f59e0b;letter-spacing:-.5px}
    .doc-quote-date{font-size:9px;color:#888;margin-top:2px}
    .meta-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px}
    .meta-card{background:#f8f8fa;border:1px solid #e5e7eb;border-radius:10px;padding:12px 14px}
    .meta-label{font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#aaa;margin-bottom:4px}
    .meta-value{font-size:12px;font-weight:700;color:#1a1a2e}
    .meta-value-sub{font-size:10px;color:#666;margin-top:2px}
    .section-title{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.15em;color:#f59e0b;margin-bottom:8px}
    table{width:100%;border-collapse:collapse;margin-bottom:20px}
    thead th{background:#1a1a2e;color:#fff;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;padding:8px 10px;text-align:left}
    thead th:first-child{border-radius:6px 0 0 6px}thead th:last-child{border-radius:0 6px 6px 0}
    tbody tr:nth-child(even){background:#f9f9fb}tbody tr:nth-child(odd){background:#fff}
    td{padding:7px 10px;vertical-align:middle;border-bottom:1px solid #f0f0f5;font-size:10.5px;color:#333}
    .td-sku{font-family:monospace;font-size:9px;color:#aaa;white-space:nowrap}
    .td-name{min-width:160px;font-weight:600}
    .td-num{text-align:right;white-space:nowrap}
    .td-bold{font-weight:800;color:#1a1a2e}
    .unit{font-size:9px;color:#aaa;font-weight:400}
    .totals-wrap{display:flex;justify-content:flex-end;margin-bottom:20px}
    .totals-box{background:#f8f8fa;border:1px solid #e5e7eb;border-radius:10px;padding:14px 20px;min-width:260px}
    .totals-row{display:flex;justify-content:space-between;align-items:center;padding:4px 0;font-size:11px;color:#555}
    .totals-row.divider{border-top:1px solid #e5e7eb;margin-top:6px;padding-top:8px}
    .tot-main .tot-label{font-size:13px;font-weight:900;color:#1a1a2e}
    .tot-main .tot-value{font-size:18px;font-weight:900;color:#1a1a2e}
    .tot-deposit .tot-value{font-weight:800;color:#f59e0b}
    .doc-footer{position:fixed;bottom:8mm;left:0;right:0;padding:0 16mm;display:flex;align-items:center;justify-content:space-between;border-top:1px solid #e5e7eb;padding-top:6px}
    .footer-badge{display:inline-block;background:#1a1a2e;color:#f59e0b;font-size:7px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;padding:2px 8px;border-radius:20px}
    .footer-txt{font-size:8px;color:#bbb}
    @media screen{body{background:#e5e7eb;padding:20px}.page{background:#fff;max-width:816px;margin:0 auto;padding:40px;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,.12)}}
  </style></head>
  <body>
    <div class="watermark" aria-hidden="true"><img src="/images/e360-logo.jpg" alt=""/></div>
    <div class="page">
      <div class="doc-header">
        <div class="doc-header-left">
          <img class="doc-logo" src="/images/e360-logo.jpg" alt="Eventos 360"/>
          <div><div class="doc-brand-name">Eventos 360</div><div class="doc-brand-sub">Producción de eventos integral</div></div>
        </div>
        <div class="doc-header-right">
          <div class="doc-quote-label">Cotización</div>
          <div class="doc-quote-id">${quoteId}</div>
          <div class="doc-quote-date">Emitida el ${today}</div>
        </div>
      </div>
      <div class="meta-grid">
        <div class="meta-card"><div class="meta-label">Cliente / Prospecto</div><div class="meta-value">${clientName}</div></div>
        <div class="meta-card">
          <div class="meta-label">Evento</div>
          <div class="meta-value">${eventTitle}</div>
          ${eventDate ? `<div class="meta-value-sub">${eventDate}${location ? ` &bull; ${location}` : ""}</div>` : ""}
        </div>
      </div>
      <div class="section-title">Detalle de servicios</div>
      <table>
        <thead><tr><th>SKU</th><th>Descripción</th><th style="text-align:right">Cant.</th><th style="text-align:right">P. Unit.</th><th style="text-align:right">Subtotal</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="5" style="text-align:center;color:#aaa;padding:20px">Sin items</td></tr>`}</tbody>
      </table>
      <div class="totals-wrap">
        <div class="totals-box">
          <div class="totals-row"><span class="tot-label">Subtotal</span><span class="tot-value">${fmt(subtotal)}</span></div>
          <div class="totals-row"><span class="tot-label">IVA (16%)</span><span class="tot-value">${fmt(iva)}</span></div>
          <div class="totals-row divider tot-main"><span class="tot-label">Total</span><span class="tot-value">${fmt(total)}</span></div>
          <div class="totals-row tot-deposit"><span class="tot-label">Anticipo (50%)</span><span class="tot-value">${fmt(deposit)}</span></div>
          <div class="totals-row"><span class="tot-label">Saldo</span><span class="tot-value">${fmt(balance)}</span></div>
        </div>
      </div>
      ${notes ? `<div style="background:#fffdf5;border:1px solid #fde68a;border-left:4px solid #f59e0b;border-radius:6px;padding:10px 14px;margin-bottom:20px;font-size:10px;color:#555"><strong>Notas:</strong> ${notes}</div>` : ""}
      <div class="doc-footer">
        <div class="footer-txt">Eventos 360 &mdash; Producción integral de eventos</div>
        <div class="footer-txt"><span class="footer-badge">${quoteId}</span> &nbsp;&bull;&nbsp; ${clientName} &nbsp;&bull;&nbsp; ${today}</div>
        <div class="footer-txt">Página 1</div>
      </div>
    </div>
    <script>window.onload=function(){window.print()}<\/script>
  </body></html>`;

  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) { alert("Activa las ventanas emergentes para generar el PDF."); return; }
  win.document.write(html);
  win.document.close();
}

function Eventos({ events, clientsById, selectedEventId, onSelect, onAdd, onEdit, onDelete, onLinkClient, onQty, onWhatsApp }) {
  const selected = selectedEventId ? events.find((e) => e.id === selectedEventId) : null;

  return (
    <div style={styles.section}>
      <div style={styles.rowBetween}>
        <div>
          <div style={styles.h2}>Eventos</div>
          <div style={styles.muted}>Selecciona un evento para armar la cotización.</div>
        </div>
        <button style={styles.primaryBtn} onClick={onAdd}>
          + Nuevo
        </button>
      </div>

      <div style={styles.grid2}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Lista de eventos</div>
          {!events.length ? (
            <div style={styles.empty}>No hay eventos aún.</div>
          ) : (
            <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
              {events.map((e) => (
                <div key={e.id} style={{ ...styles.listRow, ...(e.id === selectedEventId ? styles.listRowActive : null) }}>
                  <button style={styles.listMain} onClick={() => onSelect(e.id)}>
                    <div style={{ fontWeight: 700 }}>{e.title}</div>
                    <div style={styles.mutedSmall}>
                      {e.date || "(sin fecha)"} • {e.location || "(sin lugar)"}
                      {e.clientId ? ` • ${clientsById[e.clientId]?.name || "(cliente)"}` : " • (sin cliente)"}
                    </div>
                  </button>
                  <div style={styles.rowBtns}>
                    <button style={styles.smallBtn} onClick={() => onEdit(e.id)}>
                      Editar
                    </button>
                    <button style={styles.smallDanger} onClick={() => onDelete(e.id)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Cotización</div>
          {!selected ? (
            <div style={styles.muted}>Selecciona un evento para ver/editar items.</div>
          ) : (
            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{selected.title}</div>
                <div style={styles.mutedSmall}>
                  {selected.date || "(sin fecha)"} • {selected.location || "(sin lugar)"}
                </div>
              </div>

              <div style={styles.rowBetween}>
                <div>
                  <div style={styles.mutedSmall}>Cliente</div>
                  <div style={{ fontWeight: 700 }}>
                    {selected.clientId ? clientsById[selected.clientId]?.name || "(no encontrado)" : "(sin cliente)"}
                  </div>
                </div>
                <button style={styles.smallBtn} onClick={() => onLinkClient(selected.id)}>
                  Vincular
                </button>
              </div>

              <div style={styles.divider} />

              <QuoteItems items={Array.isArray(selected.items) ? selected.items : []} onQty={onQty} />

              <div style={styles.divider} />

              <div style={styles.rowBetween}>
                <div>
                  <div style={styles.mutedSmall}>Total</div>
                  <div style={{ fontWeight: 900, fontSize: 18 }}>
                    {currencyMXN(
                      (Array.isArray(selected.items) ? selected.items : []).reduce(
                        (acc, it) => acc + (it.price || 0) * (it.qty || 0),
                        0
                      )
                    )}
                  </div>
                  <div style={{ fontSize: 10, color: "#f59e0b", fontWeight: 700, marginTop: 2, fontFamily: "monospace" }}>
                    {buildQuoteId(selected.id, selected.date)}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={styles.primaryBtn} onClick={() => onWhatsApp(selected)}>
                    WhatsApp
                  </button>
                  <button
                    style={{ ...styles.secondaryBtn, borderColor: "rgba(245,158,11,0.4)", color: "#f59e0b" }}
                    onClick={() => {
                      const client = selected.clientId ? clientsById[selected.clientId] : null;
                      openQuotePDF({
                        quoteId: buildQuoteId(selected.id, selected.date),
                        clientName: client?.name || "Sin cliente",
                        eventTitle: selected.title,
                        eventDate: selected.date,
                        location: selected.location,
                        notes: selected.notes,
                        items: Array.isArray(selected.items) ? selected.items : [],
                      });
                    }}
                  >
                    PDF
                  </button>
                </div>
              </div>

              <div style={styles.mutedSmall}>
                Tip: agrega productos desde <b>Catálogo</b>. Aquí solo ajustas cantidades.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuoteItems({ items, onQty }) {
  if (!items.length) {
    return <div style={styles.empty}>Sin items. Ve a Catálogo y toca productos para agregarlos.</div>;
  }

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {items.map((it) => {
        const subtotal = (it.price || 0) * (it.qty || 0);
        return (
          <div key={it.productId} style={styles.quoteRow}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.name}</div>
              <div style={styles.mutedSmall}>
                {it.productId} • {it.unit} • {currencyMXN(it.price)} c/u
              </div>
            </div>

            <div style={styles.qtyBox}>
              <button style={styles.qtyBtn} onClick={() => onQty(it.productId, (it.qty || 0) - 1)} aria-label="menos">
                −
              </button>
              <div style={styles.qtyVal}>{it.qty || 0}</div>
              <button style={styles.qtyBtn} onClick={() => onQty(it.productId, (it.qty || 0) + 1)} aria-label="más">
                +
              </button>
              <button style={styles.trashBtn} onClick={() => onQty(it.productId, 0)} aria-label="eliminar">
                🗑
              </button>
            </div>

            <div style={styles.money}>{currencyMXN(subtotal)}</div>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0b0c10",
    color: "#e9eaee",
    display: "flex",
    justifyContent: "center",
    padding: 16,
    boxSizing: "border-box"
  },
  shell: {
    width: "min(1100px, 100%)",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 18,
    overflow: "hidden",
    boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
    position: "relative"
  },
  header: {
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)"
  },
  title: { fontSize: 18, fontWeight: 900, letterSpacing: 0.2 },
  subtitle: { fontSize: 12, opacity: 0.75, marginTop: 2 },
  main: { padding: 16, paddingBottom: 78, boxSizing: "border-box" },
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 8,
    padding: 10,
    background: "rgba(10,10,14,0.72)",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)"
  },
  tabBtn: {
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    color: "#e9eaee",
    padding: "10px 10px",
    borderRadius: 12,
    fontWeight: 800,
    cursor: "pointer"
  },
  tabBtnActive: {
    border: "1px solid rgba(255,215,0,0.35)",
    background: "rgba(255,215,0,0.10)"
  },
  section: { display: "grid", gap: 14 },
  rowBetween: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
  h2: { fontSize: 18, fontWeight: 900 },
  muted: { opacity: 0.78 },
  mutedSmall: { opacity: 0.72, fontSize: 12 },
  pills: { display: "flex", gap: 8, flexWrap: "wrap" },
  pill: {
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    opacity: 0.95
  },
  grid2: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 },
  card: {
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    padding: 14
  },
  cardTitle: { fontWeight: 900 },
  primaryBtn: {
    border: "1px solid rgba(255,215,0,0.35)",
    background: "rgba(255,215,0,0.12)",
    color: "#fff",
    padding: "10px 12px",
    borderRadius: 12,
    fontWeight: 900,
    cursor: "pointer"
  },
  secondaryBtn: {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    padding: "10px 12px",
    borderRadius: 12,
    fontWeight: 800,
    cursor: "pointer"
  },
  ghostBtn: {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "transparent",
    color: "#e9eaee",
    padding: "8px 10px",
    borderRadius: 12,
    fontWeight: 800,
    cursor: "pointer"
  },
  filters: { display: "grid", gridTemplateColumns: "1fr 240px", gap: 10 },
  input: {
    width: "100%",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#e9eaee",
    padding: "10px 12px",
    borderRadius: 12,
    outline: "none"
  },
  select: {
    width: "100%",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "#e9eaee",
    padding: "10px 12px",
    borderRadius: 12,
    outline: "none"
  },
  noteBox: {
    border: "1px dashed rgba(255,215,0,0.35)",
    background: "rgba(255,215,0,0.06)",
    borderRadius: 14,
    padding: 12,
    display: "grid",
    gap: 4
  },
  gallery: {
    display: "flex",
    gap: 12,
    overflowX: "auto",
    paddingBottom: 6,
    scrollSnapType: "x mandatory",
    WebkitOverflowScrolling: "touch"
  },
  productCard: {
    textAlign: "left",
    minWidth: 280,
    scrollSnapAlign: "start",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    padding: 12,
    cursor: "pointer",
    color: "#e9eaee",
    display: "grid",
    gap: 8,
    outline: "none"
  },
  productTop: { display: "flex", justifyContent: "space-between", alignItems: "start", gap: 8 },
  productName: { fontWeight: 900, lineHeight: 1.15 },
  productPrice: { fontWeight: 900, opacity: 0.95 },
  productDesc: { fontSize: 12, opacity: 0.78, lineHeight: 1.25 },
  productMeta: { display: "flex", gap: 8, flexWrap: "wrap" },
  badge: {
    fontSize: 11,
    padding: "4px 8px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    opacity: 0.92
  },
  productId: {
    fontSize: 11,
    opacity: 0.75,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
  },
  addHint: { fontSize: 12, opacity: 0.85, fontWeight: 800 },
  inEventRow: { display: "flex", justifyContent: "flex-start" },
  inEventPill: {
    fontSize: 11,
    padding: "4px 8px",
    borderRadius: 999,
    border: "1px solid rgba(255,215,0,0.35)",
    background: "rgba(255,215,0,0.10)",
    fontWeight: 900
  },
  inEventPillMuted: {
    fontSize: 11,
    padding: "4px 8px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.04)",
    fontWeight: 800,
    opacity: 0.75
  },
  catalogCtas: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 },
  catalogMiniBtns: { display: "flex", alignItems: "center", gap: 8 },
  minusMini: {
    width: 34,
    height: 34,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    fontWeight: 1000,
    cursor: "pointer"
  },
  plusMini: {
    width: 34,
    height: 34,
    borderRadius: 12,
    border: "1px solid rgba(255,215,0,0.35)",
    background: "rgba(255,215,0,0.12)",
    color: "#fff",
    fontWeight: 1000,
    cursor: "pointer"
  },
  thumb: {
    width: "100%",
    height: 92,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  thumbInner: {
    width: 46,
    height: 46,
    borderRadius: 14,
    border: "1px solid rgba(255,215,0,0.30)",
    background: "rgba(255,215,0,0.06)"
  },
  empty: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    opacity: 0.85
  },
  listRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 10,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    borderRadius: 14,
    overflow: "hidden"
  },
  listRowActive: {
    border: "1px solid rgba(255,215,0,0.35)",
    background: "rgba(255,215,0,0.06)"
  },
  listMain: {
    textAlign: "left",
    padding: 12,
    color: "#e9eaee",
    background: "transparent",
    border: "none",
    cursor: "pointer"
  },
  rowBtns: { display: "flex", alignItems: "center", gap: 8, padding: 10 },
  smallBtn: {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    padding: "8px 10px",
    borderRadius: 12,
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap"
  },
  smallDanger: {
    border: "1px solid rgba(255,80,80,0.35)",
    background: "rgba(255,80,80,0.10)",
    color: "#fff",
    padding: "8px 10px",
    borderRadius: 12,
    fontWeight: 900,
    cursor: "pointer",
    whiteSpace: "nowrap"
  },
  divider: { height: 1, background: "rgba(255,255,255,0.10)" },
  quoteRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto auto",
    gap: 10,
    alignItems: "center",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    borderRadius: 14,
    padding: 12
  },
  qtyBox: { display: "flex", alignItems: "center", gap: 8 },
  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer"
  },
  qtyVal: { minWidth: 30, textAlign: "center", fontWeight: 900 },
  trashBtn: {
    width: 40,
    height: 34,
    borderRadius: 10,
    border: "1px solid rgba(255,80,80,0.35)",
    background: "rgba(255,80,80,0.10)",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer"
  },
  money: { fontWeight: 900, textAlign: "right", minWidth: 110 },
  debugWrap: {
    marginTop: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    padding: 12
  },
  debugTop: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 8
  },
  debugPre: {
    margin: 0,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontSize: 11,
    lineHeight: 1.35,
    opacity: 0.9
  }
};
