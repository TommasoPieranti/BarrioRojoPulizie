// Central Italian text file. EVERY user-facing string lives here (Req 16.2, 16.3).
// Identifiers are English; values are Italian. Group keys by feature.
// Never hard-code user-facing text in components.
export const it = {
  common: {
    appName: 'Gestione Casa',
  },
  home: {
    title: 'Gestione Casa',
    subtitle: 'Pulizie, turni e spesa della casa, in un unico posto.',
    startButton: 'Inizia',
  },
} as const;

export type Locale = typeof it;
