const svgDataUri = (svg) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

const createAvatar = ({ initials, top, bottom, accent }) =>
  svgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="Avatar ${initials}">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${top}" />
          <stop offset="100%" stop-color="${bottom}" />
        </linearGradient>
      </defs>
      <rect width="128" height="128" rx="64" fill="url(#g)" />
      <circle cx="96" cy="34" r="20" fill="${accent}" opacity="0.26" />
      <circle cx="32" cy="94" r="26" fill="#ffffff" opacity="0.16" />
      <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="44" font-weight="700" fill="#ffffff">${initials}</text>
    </svg>
  `);

export const dogs = [
  {
    id: "lukas",
    name: "Lukas",
    breed: "Golden Retriever",
    status: "connected",
    battery: 92,
    lastSeen: "Hace 1 min",
    heartRate: 78,
    temperature: 38.4,
    oxygen: 98,
    respiration: 21,
    deviceCode: "PLK-8842",
    avatar: createAvatar({
      initials: "LU",
      top: "#00A3E0",
      bottom: "#57C7F2",
      accent: "#E041E4",
    }),
  },
  {
    id: "max",
    name: "Max",
    breed: "Border Collie",
    status: "connected",
    battery: 15,
    lastSeen: "Hace 4 min",
    heartRate: 96,
    temperature: 38.9,
    oxygen: 95,
    respiration: 28,
    deviceCode: "PLK-1190",
    avatar: createAvatar({
      initials: "MA",
      top: "#0b1b28",
      bottom: "#00A3E0",
      accent: "#E40046",
    }),
  },
  {
    id: "nala",
    name: "Nala",
    breed: "Labrador",
    status: "disconnected",
    battery: 64,
    lastSeen: "Hace 18 min",
    heartRate: 72,
    temperature: 37.9,
    oxygen: 99,
    respiration: 18,
    deviceCode: "PLK-5601",
    avatar: createAvatar({
      initials: "NA",
      top: "#E041E4",
      bottom: "#F497EA",
      accent: "#00A3E0",
    }),
  },
  {
    id: "toro",
    name: "Toro",
    breed: "Pastor Alemán",
    status: "connected",
    battery: 58,
    lastSeen: "Hace 7 min",
    heartRate: 83,
    temperature: 38.0,
    oxygen: 97,
    respiration: 20,
    deviceCode: "PLK-2416",
    avatar: createAvatar({
      initials: "TO",
      top: "#00a3e0",
      bottom: "#0b1b28",
      accent: "#E041E4",
    }),
  },
];

export const alerts = [
  {
    id: 1,
    severity: "critical",
    title: "Ritmo cardiaco elevado en Lukas",
    detail: "Pico sostenido de 118 lpm detectado por 3 minutos.",
    time: "Hace 10 min",
  },
  {
    id: 2,
    severity: "warning",
    title: "Batería baja en Max (15%)",
    detail: "Se recomienda conectar el módulo biosensorial pronto.",
    time: "Hace 18 min",
  },
  {
    id: 3,
    severity: "critical",
    title: "Desconexión temporal de Nala",
    detail: "El dispositivo perdió señal durante 42 segundos.",
    time: "Hace 27 min",
  },
  {
    id: 4,
    severity: "warning",
    title: "Temperatura fuera de rango en Toro",
    detail: "El sensor marcó 38.8 °C durante el último chequeo.",
    time: "Hace 1 h",
  },
];

export const profile = {
  name: "Camila Ríos",
  email: "camila@polyluk.app",
  avatar: createAvatar({
    initials: "CR",
    top: "#00A3E0",
    bottom: "#E041E4",
    accent: "#E40046",
  }),
};

export const settings = [
  {
    id: "notifications",
    label: "Notificaciones",
    value: "Alertas críticas activadas",
  },
  {
    id: "units",
    label: "Unidades de medida",
    value: "Métricas biométricas",
  },
  {
    id: "support",
    label: "Soporte",
    value: "Centro de ayuda y contacto",
  },
];