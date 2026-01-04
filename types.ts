
export enum Language {
  AUTO = 'Auto-Detect',
  ENGLISH = 'English',
  HINDI = 'Hindi',
  ODIA = 'Odia'
}

export interface TranslationHistory {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: Language;
  targetLang: Language;
  timestamp: number;
}
