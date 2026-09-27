import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle, ArrowDown, BusFront, ChevronDown, ChevronRight, Clock3,
  Gauge, LocateFixed, LockKeyhole, Mail, Map as MapIcon, MapPin, Menu,
  Minus, Navigation, Plus, Route as RouteIcon, Search, Signal, TrafficCone,
  User, UserRound, UsersRound, X,
} from "lucide-react";
import { useEffect, useRef, useState, type ButtonHTMLAttributes, type PointerEvent as ReactPointerEvent } from "react";
import logoAsset from "@/assets/piurago-logo-circle.png";
import { useIsMobile } from "@/hooks/use-mobile";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PiuraGo — Mapa de rutas urbanas" },
      { name: "description", content: "Consulta rutas, paraderos, tiempos de llegada y congestión en Piura." },
      { property: "og:title", content: "PiuraGo — Mapa de rutas urbanas" },
      { property: "og:description", content: "Tu guía de transporte urbano en Piura." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PiuraGo,
});

type View = "routes" | "map" | "traffic";
type UserMode = "guest" | "logged";
type AuthMode = "login" | "register";
type SheetState = "peek" | "mid" | "full";

const routes = [
  { id: "line10", name: "Línea 10", operator: "El Moradito", badge: "10", path: "Castilla • Catacaos • Mercado Central", eta: "4 min", arrival: "12:28", tone: "blue", stops: ["Mercado Central", "Óvalo Bolognesi", "Universidad Nacional de Piura", "Terminal Catacaos"] },
  { id: "interurban", name: "Ruta B", operator: "Combi Interurbana", badge: "B", path: "Piura • Veintiséis de Octubre", eta: "7 min", arrival: "12:31", tone: "green", stops: ["Plaza de Armas", "Av. Grau", "Complejo de Mercados", "Veintiséis de Octubre"] },
  { id: "line6", name: "Línea 6", operator: "Emutsa", badge: "6", path: "Castilla • Centro • Santa Rosa", eta: "11 min", arrival: "12:35", tone: "orange", stops: ["Castilla", "Puente Sánchez Cerro", "Centro de Piura", "Santa Rosa"] },
];

const popularRoutes = [
  { id: "line1", name: "Línea 1", operator: "San Antonio", badge: "1", path: "Piura • Los Ejidos • Centro", eta: "6 min", arrival: "12:30", tone: "blue", stops: ["Los Ejidos", "Av. Sánchez Cerro", "Plaza de Armas", "Terminal Piura"] },
  { id: "routeA", name: "Ruta A", operator: "Superstar", badge: "A", path: "Castilla • Aeropuerto • Centro", eta: "9 min", arrival: "12:33", tone: "green", stops: ["Castilla", "Aeropuerto", "Puente Cáceres", "Centro de Piura"] },
  { id: "routeC", name: "Ruta C", operator: "Nueva Alternativa", badge: "C", path: "Veintiséis de Octubre • Centro", eta: "12 min", arrival: "12:36", tone: "orange", stops: ["Veintiséis de Octubre", "Av. Chulucanas", "Mercado Modelo", "Centro de Piura"] },
];

const otherRoutes = [
  { id: "line4", name: "Línea 4", operator: "El Piuranito", badge: "4", path: "Piura • Santa Julia • Castilla", eta: "8 min", arrival: "12:32", tone: "blue", stops: ["Santa Julia", "Av. Guardia Civil", "Puente Sánchez Cerro", "Castilla"] },
  { id: "line5", name: "Línea 5", operator: "Sol de Piura", badge: "5", path: "Centro • Miraflores • Catacaos", eta: "10 min", arrival: "12:34", tone: "green", stops: ["Centro de Piura", "Miraflores", "Óvalo Cáceres", "Catacaos"] },
  { id: "routeD", name: "Ruta D", operator: "La Guadalupe", badge: "D", path: "Piura • Tacalá • Castilla", eta: "14 min", arrival: "12:38", tone: "orange", stops: ["Terminal Piura", "Av. Grau", "Tacalá", "Castilla"] },
];

const allRoutes = [...routes, ...popularRoutes, ...otherRoutes];

const defaultMapLine = { d: "M270 545 C330 480 380 425 465 375 S610 290 730 250", from: [270, 545] as [number, number], to: [730, 250] as [number, number] };
const routeLines: Record<string, { d: string; from: [number, number]; to: [number, number] }> = {
  line10: defaultMapLine,
  interurban: { d: "M190 570 C290 500 350 430 420 375 S540 275 610 215", from: [190, 570], to: [610, 215] },
  line6: { d: "M745 160 C630 205 570 315 475 385 S300 470 245 550", from: [745, 160], to: [245, 550] },
  line1: { d: "M150 300 C260 340 330 390 430 400 S600 425 705 470", from: [150, 300], to: [705, 470] },
  routeA: { d: "M820 240 C700 300 620 350 520 400 S360 480 262 520", from: [820, 240], to: [262, 520] },
  routeC: { d: "M110 430 C230 440 330 420 450 380 S610 330 748 300", from: [110, 430], to: [748, 300] },
  line4: { d: "M330 640 C400 560 470 500 540 440 S680 330 800 262", from: [330, 640], to: [800, 262] },
  line5: { d: "M600 130 C560 240 520 330 470 400 S360 540 300 612", from: [600, 130], to: [300, 612] },
  routeD: { d: "M70 200 C190 260 300 300 420 350 S600 430 762 520", from: [70, 200], to: [762, 520] },
};


const navItems = [
  { id: "routes" as const, label: "Rutas", icon: RouteIcon },
  { id: "map" as const, label: "Mapa", icon: MapIcon },
  { id: "traffic" as const, label: "Congestión", icon: TrafficCone },
];

function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`pg-button ${className}`} {...props} />;
}

function Brand({ compact = false }: { compact?: boolean }) {
  return <div className={`brand ${compact ? "brand-compact" : ""}`}><span className="brand-mark"><img src={logoAsset} alt="" /></span>{!compact && <strong>PiuraGo</strong>}</div>;
}

function PiuraGo() {
  const [entered, setEntered] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [userMode, setUserMode] = useState<UserMode>("guest");
  const [showLocation, setShowLocation] = useState(false);
  const [view, setView] = useState<View>("map");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const enter = (mode: UserMode) => {
    setUserMode(mode);
    setEntered(true);
    setView("map");
    window.setTimeout(() => setShowLocation(true), 260);
  };

  if (!entered) return <AuthScreen mode={authMode} setMode={setAuthMode} onEnter={enter} />;

  return (
    <div className="app-shell">
      <aside className={`desktop-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-top">
          {sidebarOpen && <Brand />}
          <Button className="icon-button sidebar-toggle" aria-label={sidebarOpen ? "Contraer menú" : "Expandir menú"} title={sidebarOpen ? "Contraer menú" : "Expandir menú"} onClick={() => setSidebarOpen(v => !v)}><Menu /></Button>
        </div>
        <div className="sidebar-divider" aria-hidden="true" />
        <nav className="side-nav">{navItems.map(item => <Button key={item.id} className={`nav-button ${view === item.id ? "active" : ""}`} aria-label={!sidebarOpen ? item.label : undefined} title={!sidebarOpen ? item.label : undefined} onClick={() => setView(item.id)}><item.icon />{sidebarOpen && <span>{item.label}</span>}</Button>)}</nav>
      </aside>

      <main className="app-main">
        <header className="mobile-header"><Brand /><div className="session-cluster"><span className="user-pill">{userMode === "guest" ? "Anónimo" : "Sesión activa"}</span><Button className={`session-link ${userMode === "guest" ? "prominent" : ""}`} onClick={() => userMode === "guest" ? setEntered(false) : setUserMode("guest")}>{userMode === "guest" ? "Iniciar sesión" : "Hola Ramirez!"}</Button></div></header>
        <div className="desktop-topbar"><div className="topbar-brand">{!sidebarOpen && <Brand />}</div><div className="session-cluster"><span className="user-pill">{userMode === "guest" ? "Anónimo" : "Sesión activa"}</span><Button className={`session-link ${userMode === "guest" ? "prominent" : ""}`} onClick={() => userMode === "guest" ? setEntered(false) : setUserMode("guest")}>{userMode === "guest" ? "Iniciar sesión" : "Hola Ramirez!"}</Button></div></div>
        <section className="view-stage" key={view}>
          {view === "map" && <MapExperience userMode={userMode} />}
          {view === "routes" && <RoutesView onGo={(id) => { setView("map"); sessionStorage.setItem("piurago-route", id); }} />}
          {view === "traffic" && <TrafficView />}
        </section>
      </main>

      <nav className="bottom-nav">{navItems.map(item => <Button key={item.id} className={`bottom-nav-button ${view === item.id ? "active" : ""}`} onClick={() => setView(item.id)}><item.icon /><span>{item.label}</span></Button>)}</nav>
      {showLocation && <LocationModal onClose={() => setShowLocation(false)} />}
    </div>
  );
}

function AuthScreen({ mode, setMode, onEnter }: { mode: AuthMode; setMode: (m: AuthMode) => void; onEnter: (m: UserMode) => void }) {
  const registering = mode === "register";
  return <main className="auth-page">
    <section className="auth-intro"><div className="auth-brand"><Brand /><p>Tu ruta por Piura, más clara y más cerca.</p></div><div className="auth-illustration" aria-hidden="true"><RouteIcon /><span>Rutas en tiempo real</span></div></section>
    <section className="auth-panel"><div className="auth-form-wrap">
      <div className="auth-mobile-brand"><Brand /></div>
      <p className="eyebrow">Bienvenido a PiuraGo</p><h1>{registering ? "Crea tu cuenta" : "Inicia sesión"}</h1><p className="auth-copy">{registering ? "Regístrate para acompañar tu trayecto y colaborar con la comunidad." : "Consulta cómo llegar y cuándo pasará tu próxima combi."}</p>
      <form onSubmit={(e) => { e.preventDefault(); onEnter("logged"); }}>
        {registering && <label>Nombre completo<div className="input-wrap"><User /><input required placeholder="Ramirez Castro" /></div></label>}
        <label>Correo electrónico<div className="input-wrap"><Mail /><input required type="email" placeholder="nombre@correo.com" /></div></label>
        <label>Contraseña<div className="input-wrap"><LockKeyhole /><input required type="password" placeholder="••••••••" /></div></label>
        <Button className="primary wide" type="submit">{registering ? "Crear cuenta" : "Iniciar sesión"}<ChevronRight /></Button>
      </form>
      <div className="alt-label"><span />o Inicia sesión con:<span /></div>
      <div className="auth-pill"><Button onClick={() => onEnter("logged")}><Mail />Correo institucional</Button><i /><Button onClick={() => onEnter("logged")}><span className="google-g">G</span>Cuenta de Google</Button></div>
      <p className="switch-auth">{registering ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}<Button className="text-button" onClick={() => setMode(registering ? "login" : "register")}>{registering ? "Inicia sesión" : "Regístrate aquí"}</Button></p>
      <Button className="guest-button" onClick={() => onEnter("guest")}><UserRound />Continuar como pasajero anónimo</Button>
    </div></section>
  </main>;
}

function LocationModal({ onClose }: { onClose: () => void }) {
  const [closing, setClosing] = useState(false);
  const close = () => { setClosing(true); window.setTimeout(onClose, 180); };
  return <div className={`modal-layer ${closing ? "closing" : ""}`}><div className="location-modal" role="dialog" aria-modal="true" aria-labelledby="location-title"><div className="location-symbol"><LocateFixed /></div><p className="eyebrow">UBICACIÓN SIMULADA</p><h2 id="location-title">Encuentra lo que está cerca</h2><p>PiuraGo usa una ubicación de demostración para mostrar tu posición, las rutas cercanas y sus tiempos de llegada.</p><Button className="primary wide" onClick={close}><Navigation />Activar ubicación</Button><Button className="secondary wide" onClick={close}>Continuar sin activar ubicación</Button><small>No se utilizará tu GPS real.</small></div></div>;
}

function MapExperience({ userMode }: { userMode: UserMode }) {
  const isMobile = useIsMobile();
  const [destination, setDestination] = useState(false);
  const [routeVisible, setRouteVisible] = useState(false);
  const [vehiclesVisible, setVehiclesVisible] = useState(false);
  const [peopleVisible, setPeopleVisible] = useState(false);
  const [locating, setLocating] = useState(false);
  const [sheet, setSheet] = useState<SheetState>("peek");
  const [selected, setSelected] = useState<string | null>(null);
  const [tripOpen, setTripOpen] = useState(false);
  const [stopIndex, setStopIndex] = useState(0);
  const [collaborating, setCollaborating] = useState(false);
  const sheetRef = useRef<HTMLElement | null>(null);
  const dragStart = useRef<{ y: number; translateY: number; time: number } | null>(null);
  const dragLast = useRef<{ y: number; time: number } | null>(null);
  const activeRoute = allRoutes.find(r => r.id === selected);
  const mapLine = routeLines[selected ?? "line10"] ?? defaultMapLine;

  useEffect(() => {
    const queuedRoute = sessionStorage.getItem("piurago-route");
    if (queuedRoute) {
      setSelected(queuedRoute);
      setRouteVisible(true);
      setVehiclesVisible(true);
      setPeopleVisible(true);
      sessionStorage.removeItem("piurago-route");
    }
  }, []);
  useEffect(() => {
    if (!destination) return;
    setRouteVisible(false); setVehiclesVisible(false); setPeopleVisible(false);
    const r = window.setTimeout(() => setRouteVisible(true), 3000);
    const v = window.setTimeout(() => setVehiclesVisible(true), 3380);
    const p = window.setTimeout(() => setPeopleVisible(true), 3760);
    return () => { clearTimeout(r); clearTimeout(v); clearTimeout(p); };
  }, [destination]);

  const chooseRoute = (id: string) => { setSelected(id); setDestination(false); setRouteVisible(true); setVehiclesVisible(true); setPeopleVisible(true); setSheet("peek"); setTripOpen(false); setStopIndex(0); };
  const locate = () => { setLocating(true); window.setTimeout(() => setLocating(false), 700); };
  const sheetPositions = () => {
    const element = sheetRef.current;
    if (!element) return null;
    const height = element.getBoundingClientRect().height;
    const peekHeight = selected ? 260 : 172;
    return { full: height * .04, mid: height * (selected ? .38 : .42), peek: Math.max(0, height - peekHeight) };
  };
  const onDragStart = (e: ReactPointerEvent<HTMLDivElement>) => {
    const element = sheetRef.current;
    if (!element) return;
    const transform = window.getComputedStyle(element).transform;
    const matrix = new DOMMatrixReadOnly(transform === "none" ? undefined : transform);
    const now = performance.now();
    dragStart.current = { y: e.clientY, translateY: matrix.m42, time: now };
    dragLast.current = { y: e.clientY, time: now };
    element.classList.add("dragging");
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onDragMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const element = sheetRef.current;
    const start = dragStart.current;
    const positions = sheetPositions();
    if (!element || !start || !positions) return;
    const nextY = Math.min(positions.peek, Math.max(positions.full, start.translateY + e.clientY - start.y));
    element.style.transform = `translateY(${nextY}px)`;
    const now = performance.now();
    if (!dragLast.current || now - dragLast.current.time > 40) dragLast.current = { y: e.clientY, time: now };
  };
  const onDragEnd = (e: ReactPointerEvent<HTMLDivElement>) => {
    const element = sheetRef.current;
    const start = dragStart.current;
    const last = dragLast.current;
    const positions = sheetPositions();
    if (!element || !start || !positions) return;
    const currentY = Math.min(positions.peek, Math.max(positions.full, start.translateY + e.clientY - start.y));
    const elapsed = Math.max(1, performance.now() - (last?.time ?? start.time));
    const velocity = (e.clientY - (last?.y ?? start.y)) / elapsed;
    const projectedY = currentY + velocity * 180;
    const levels: Array<[SheetState, number]> = [["full", positions.full], ["mid", positions.mid], ["peek", positions.peek]];
    const nextSheet = levels.reduce((closest, candidate) => Math.abs(candidate[1] - projectedY) < Math.abs(closest[1] - projectedY) ? candidate : closest)[0];
    element.classList.remove("dragging");
    element.style.removeProperty("transform");
    dragStart.current = null;
    dragLast.current = null;
    setSheet(nextSheet);
  };

  return <div className="map-experience">
    <div className={`map-canvas ${locating ? "is-locating" : ""}`}>
      <svg className="city-map" viewBox="0 0 1000 720" preserveAspectRatio={isMobile ? "xMidYMin meet" : "xMidYMid slice"} aria-label="Mapa ilustrado de Piura">
        <rect className="map-ground" width="1000" height="720" />
        <path className="river" d="M-40 520 C160 400 290 610 480 485 S760 380 1040 470" />
        <g className="minor-roads"><path d="M40 90H960M10 185H900M70 300H1010M-20 410H930M120 610H980"/><path d="M135 10V700M280-20V680M430 30V720M590-20V680M760 20V720M900-10V700"/><path d="M20 650L860 20M-30 280L560 730M350-20L1040 580"/></g>
        <g className="major-roads"><path d="M0 205C240 250 420 165 660 220S890 350 1040 290"/><path d="M210 -30C260 170 360 300 485 400S720 590 780 750"/><path d="M-20 620C190 515 390 505 560 390S800 180 1020 115"/></g>
        <g className="district-labels"><text x="180" y="120">PIURA</text><text x="690" y="170">CASTILLA</text><text x="130" y="640">VEINTISÉIS DE OCTUBRE</text><text x="720" y="610">CATACAOS</text></g>
        {(routeVisible || selected) && <g className="route-line"><path d={mapLine.d} /><circle cx={mapLine.from[0]} cy={mapLine.from[1]} r="8"/><circle cx={mapLine.to[0]} cy={mapLine.to[1]} r="8"/></g>}
        <g className="current-location"><circle cx="270" cy="545" r="25"/><circle cx="270" cy="545" r="9"/></g>
        {destination && <g className="destination-pin"><path d="M465 335c-17 0-31 14-31 31 0 24 31 52 31 52s31-28 31-52c0-17-14-31-31-31z"/><circle cx="465" cy="366" r="9"/></g>}
        {vehiclesVisible && <g className="vehicle-markers"><g transform="translate(380 430)"><circle r="23"/><text x="-11" y="7">10</text></g><g transform="translate(600 290)"><circle r="23"/><text x="-10" y="7">B</text></g></g>}
        {peopleVisible && <g className="people-markers"><g transform="translate(335 485)"><circle r="14"/><circle cy="-3" r="4"/><path d="M-6 7c2-7 10-7 12 0"/></g><g transform="translate(550 320)"><circle r="14"/><circle cy="-3" r="4"/><path d="M-6 7c2-7 10-7 12 0"/></g><g transform="translate(680 265)"><circle r="14"/><circle cy="-3" r="4"/><path d="M-6 7c2-7 10-7 12 0"/></g></g>}
        <g className="traffic-people" aria-label="Pasajeros simulados en el mapa">
          {[[165, 245], [220, 335], [365, 205], [515, 470], [640, 410], [705, 120], [815, 345], [865, 560]].map(([x, y], index) => <g key={index} transform={`translate(${x} ${y})`}><circle cy="-5" r="4"/><path d="M-7 8c1-9 13-9 14 0M0 8v9M0 11l-7 7M0 11l7 7"/></g>)}
        </g>
      </svg>
      <div className="map-search"><Button aria-label="Buscar destino" onClick={() => { setDestination(true); setSelected(null); }}><Search /><span>{destination ? "Mercado Central de Piura" : "¿A dónde quieres ir?"}</span>{destination && <X className="search-clear" onClick={(e) => { e.stopPropagation(); setDestination(false); setRouteVisible(false); }} />}</Button>{destination && !routeVisible && <div className="finding"><span className="finding-dot" />Buscando la mejor ruta…</div>}</div>
      <div className="map-tools"><Button className="icon-button map-control" aria-label="Acercar"><Plus /></Button><Button className="icon-button map-control" aria-label="Alejar"><Minus /></Button><Button className="icon-button map-control locate" aria-label="Centrar ubicación" onClick={locate}><LocateFixed /></Button></div>
      {routeVisible && !selected && <div className="eta-bubble"><Clock3 /><div><small>Línea 10 más cercana</small><strong>4 min</strong></div></div>}
    </div>

    <section ref={sheetRef} className={`route-sheet ${sheet} ${selected ? "trip-sheet" : ""}`}>
      <div className="drag-zone" onPointerDown={onDragStart} onPointerMove={onDragMove} onPointerUp={onDragEnd} onPointerCancel={onDragEnd}><span className="drag-handle" /><Button className="sheet-toggle" aria-label="Cambiar tamaño del panel" onClick={() => setSheet(sheet === "peek" ? "mid" : sheet === "mid" ? "full" : "peek")}><ChevronDown /></Button></div>
      {activeRoute ? <TripPanel route={activeRoute} userMode={userMode} open={tripOpen} setOpen={setTripOpen} stopIndex={stopIndex} advance={() => setStopIndex(i => Math.min(i + 1, activeRoute.stops.length - 1))} collaborating={collaborating} setCollaborating={setCollaborating} /> : <RouteList onGo={chooseRoute} />}
    </section>
  </div>;
}

function RouteList({ onGo }: { onGo: (id: string) => void }) {
  return <div className="sheet-content"><div className="section-heading"><div><p className="eyebrow">EN MOVIMIENTO</p><h2>Rutas cercanas</h2></div><Button className="text-button">Ver todas</Button></div><div className="route-cards">{routes.map((route) => <article className="route-card" key={route.id}><div className={`route-number ${route.tone}`}><BusFront /><span>{route.badge}</span></div><div className="route-info"><h3>{route.name} - {route.operator}</h3><p>{route.path}</p><div className="route-meta"><span><Clock3 />Llega {route.arrival}</span><strong>ETA {route.eta}</strong></div></div><Button className="primary compact" onClick={() => onGo(route.id)}>Ir<ChevronRight /></Button></article>)}</div></div>;
}

function TripPanel({ route, userMode, open, setOpen, stopIndex, advance, collaborating, setCollaborating }: { route: typeof routes[number]; userMode: UserMode; open: boolean; setOpen: (v: boolean) => void; stopIndex: number; advance: () => void; collaborating: boolean; setCollaborating: (v: boolean) => void }) {
  return <div className="sheet-content trip-content"><div className="trip-summary"><div className={`route-number ${route.tone}`}><BusFront /><span>{route.badge}</span></div><div><p className="eyebrow">RUTA SELECCIONADA</p><h2>{route.name} - {route.operator}</h2><p>{route.path}</p></div><Button className={`icon-button quiet ${open ? "rotated" : ""}`} onClick={() => setOpen(!open)} aria-label="Expandir hoja de ruta"><ChevronDown /></Button></div>
    <div className="current-stop"><div className="current-stop-main"><div><small>Te encuentras en</small><strong>{route.stops[stopIndex]}</strong><span>{stopIndex === route.stops.length - 1 ? "Llegaste a tu destino" : `Siguiente: ${route.stops[stopIndex + 1]}`}</span></div><div className="time-left"><strong>{Math.max(0, 25 - stopIndex * 7)}</strong><small>min restantes</small></div></div>{userMode === "logged" ? <div className="trip-actions"><Button className="primary" onClick={advance} disabled={stopIndex === route.stops.length - 1}>Marcar como superada</Button>{!collaborating && <Button className="secondary" onClick={() => setCollaborating(true)}><Signal />Compartir ubicación</Button>}</div> : <div className="guest-notice"><LockKeyhole /><span>Inicia sesión para confirmar tu avance y compartir tu ubicación.</span></div>}</div>
    <div className={`itinerary ${open ? "open" : ""}`}><div className="itinerary-title"><h3>Hoja de ruta</h3><span>{route.stops.length} paraderos</span></div>{route.stops.map((stop, i) => <div className={`stop-row ${i === stopIndex ? "current" : ""} ${i < stopIndex ? "passed" : ""}`} key={stop}><div className="stop-line"><span className="stop-dot" />{i < route.stops.length - 1 && <i />}</div><div><strong>{stop}</strong><span>{i === 0 ? "0 min" : `+${[6, 14, 25][i - 1] ?? i * 7} min`}</span></div>{i === stopIndex && <em>Actual</em>}</div>)}</div>
  </div>;
}

function RoutesView({ onGo }: { onGo: (id: string) => void }) {
  const renderCard = (route: typeof routes[number]) => <article className="detail-route-card" key={route.id}><div className={`route-number ${route.tone}`}><BusFront /><span>{route.badge}</span></div><div><h3>{route.name} - {route.operator}</h3><p>{route.path}</p></div><div className="stops-preview">{route.stops.slice(0, 3).map((stop, i) => <span key={stop}><i />{stop}{i < 2 && <b />}</span>)}</div><div className="card-footer"><div><small>Próxima unidad</small><strong>{route.eta}</strong></div><Button className="primary" onClick={() => onGo(route.id)}>Ver en mapa<ChevronRight /></Button></div></article>;
  return <div className="content-view"><div className="content-lead"><p className="eyebrow">TRANSPORTE URBANO</p><h2>Encuentra tu ruta</h2><p>Revisa recorridos, paraderos principales y tiempos estimados antes de salir.</p></div><div className="route-search-bar"><Search /><input placeholder="Buscar línea, zona o paradero" /></div><div className="route-grid">{routes.map(renderCard)}</div>
    <h3 className="routes-subtitle">Rutas más usadas</h3><div className="route-grid">{popularRoutes.map(renderCard)}</div>
    <h3 className="routes-subtitle">Otras rutas más usadas</h3><div className="route-grid">{otherRoutes.map(renderCard)}</div>
  </div>;
}

function TrafficView() {
  const [period, setPeriod] = useState("Ahora");
  const bars = [34, 48, 42, 66, 91, 82, 58, 46];
  return <div className="content-view traffic-view"><div className="content-lead"><p className="eyebrow">HORAS CALIENTES</p><h2>Congestión en Piura</h2><p>Estado estimado de los principales corredores de transporte urbano.</p></div><div className="period-tabs">{["Ahora", "Mañana", "Tarde", "Noche"].map(p => <Button key={p} className={period === p ? "active" : ""} onClick={() => setPeriod(p)}>{p}</Button>)}</div><div className="traffic-layout"><section className="traffic-chart"><div className="chart-heading"><div><small>Nivel general</small><strong>Moderado</strong></div><span className="status medium"><Signal />Flujo variable</span></div><div className="bars">{bars.map((h, i) => <div key={i} className="bar-col"><span className={`bar ${h > 80 ? "high" : h >= 55 ? "medium" : "low"}`} style={{ height: `${h}%` }} /><small>{["6", "8", "10", "12", "14", "16", "18", "20"][i]}h</small></div>)}</div></section><section className="metrics"><article><Clock3 /><div><small>Demora promedio</small><strong>+12 min</strong></div></article><article><Gauge /><div><small>Velocidad promedio</small><strong>18 km/h</strong></div></article><article><AlertTriangle /><div><small>Puntos críticos</small><strong>3 activos</strong></div></article></section></div><section className="critical-section"><div className="section-heading"><div><p className="eyebrow">TRAMOS CRÍTICOS</p><h3>Mayor congestión ahora</h3></div></div>{[{name:"Av. Sánchez Cerro — Mercado", delay:"+18 min", level:"Alta"},{name:"Óvalo Grau — Av. Loreto",delay:"+11 min",level:"Media"},{name:"Puente Cáceres — Castilla",delay:"+8 min",level:"Media"}].map((item, i) => <article className="critical-row" key={item.name}><span className={`rank r${i}`}>{i + 1}</span><div><strong>{item.name}</strong><small>Velocidad estimada: {12 + i * 4} km/h</small></div><span className={`level l${i}`}>{item.level}</span><strong>{item.delay}</strong></article>)}</section></div>;
}