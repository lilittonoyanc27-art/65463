export function normalizeText(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()¡¿?"']/g, '')
    .replace(/\s+/g, ' ');
}

export function checkWordOrder(userWords: string[], targetWords: string[]): boolean {
  if (userWords.length !== targetWords.length) {
    return false;
  }
  for (let i = 0; i < userWords.length; i++) {
    if (normalizeText(userWords[i]) !== normalizeText(targetWords[i])) {
      return false;
    }
  }
  return true;
}

export function calculatePercentage(score: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((score / total) * 100);
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function isCorrectAnswer(chosen: string, correct: string): boolean {
  return chosen.trim().toLowerCase() === correct.trim().toLowerCase();
}

export function getPerformanceTier(score: number, maxScore: number): {
  tier: 'galactico' | 'titular' | 'canterano' | 'principiante';
  titleEs: string;
  titleHy: string;
  badge: string;
  minPercent: number;
} {
  const percent = calculatePercentage(score, maxScore);
  if (percent >= 90) {
    return {
      tier: 'galactico',
      titleEs: '¡Galáctico del Real Madrid! 🌟',
      titleHy: '«Ռեալ Մադրիդի» Գալակտիկոս 🌟',
      badge: '🏆',
      minPercent: 90,
    };
  }
  if (percent >= 75) {
    return {
      tier: 'titular',
      titleEs: '¡Jugador Titular del Primer Equipo! ⚽',
      titleHy: 'Հիմնական կազմի ֆուտբոլիստ ⚽',
      badge: '🥇',
      minPercent: 75,
    };
  }
  if (percent >= 50) {
    return {
      tier: 'canterano',
      titleEs: 'Promesa de la Cantera (La Fábrica) 🏃',
      titleHy: 'Ակադեմիայի խոստումնալից երիտասարդ 🏃',
      badge: '🥈',
      minPercent: 50,
    };
  }
  return {
    tier: 'principiante',
    titleEs: 'En periodo de adaptación táctica 📋',
    titleHy: 'Նախապատրաստական փուլում 📋',
    badge: '🥉',
    minPercent: 0,
  };
}
