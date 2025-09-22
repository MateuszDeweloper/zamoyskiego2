// Stałe aplikacji

// Dane kontaktowe
export const CONTACT_INFO = {
  phone: "+48 516 516 440",
  email: "biuro@ascana.pl",
  address: {
    street: "ul. Jana Zamoyskiego",
    city: "Stalowa Wola",
    postalCode: "37-450"
  }
} as const;

// Dane firmy
export const COMPANY_INFO = {
  name: "ASCANA",
  legalForm: "SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ",
  krs: "0000643374",
  nip: "6762515504",
  regon: "365693032",
  website: "https://ascana.pl/"
} as const;

// Dane siedziby firmy
export const COMPANY_ADDRESS = {
  voivodeship: "podkarpackie",
  district: "mielecki", 
  commune: "Mielec",
  city: "Mielec",
  street: "ul. Wojska Polskiego",
  buildingNumber: "3",
  postalCode: "39-300"
} as const;

// Dane inwestycji
export const INVESTMENT_INFO = {
  name: "Zamoyskiego 2",
  location: {
    voivodeship: "podkarpackie",
    district: "stalowowolski",
    commune: "Stalowa Wola",
    city: "Stalowa Wola",
    street: "ul. Jana Zamoyskiego",
    postalCode: "37-450"
  }
} as const;

// Ukryte ścieżki panelu admin
export const ADMIN_PATHS = {
  login: "/b3e7a9c2-4f8d-1e6b-9a5c-7d2f8e1b4c6a-login",
  admin: "/78d9f2a1-6b5c-4e8a-9d3f-1c7b2e4f6a8d-admin",
  adminInvestment: "/78d9f2a1-6b5c-4e8a-9d3f-1c7b2e4f6a8d-admin/zamoyskiego-2"
} as const;

// Statusy lokali  
export const UNIT_STATUS = {
  AVAILABLE: 'available',
  RESERVED: 'reserved',
  SOLD_TRANSFERRED: 'sold-transferred',
  SOLD_NOT_TRANSFERRED: 'sold-not-transferred',
  UNAVAILABLE: 'unavailable'
} as const;

// Typy podłóg
export const FLOOR_TYPES = {
  GROUND_FLOOR: 'parter',
  FIRST_FLOOR: 'piętro',
  FIRST_FLOOR_WITH_GARDEN: 'piętro + ogródek'
} as const;

// Limity bezpieczeństwa
export const SECURITY_LIMITS = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_BLOCK_TIME: 15 * 60 * 1000, // 15 minut
  RESET_AFTER: 60 * 60 * 1000, // 1 godzina
  JWT_EXPIRY: '24h',
  SESSION_DURATION_REMEMBER: 60 * 60 * 24 * 30, // 30 dni
  SESSION_DURATION_DEFAULT: 60 * 60 * 12 // 12 godzin
} as const;
