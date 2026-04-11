import {
  notaColor,
  notaBg,
  notaBgCard,
  situacao,
  situacaoBadge,
  formatNota,
  periodoLabel,
  isAtivo,
  isConcluido,
} from '../utils-app';

describe('notaColor', () => {
  it('returns muted for null', () => {
    expect(notaColor(null)).toBe('text-muted-foreground');
  });

  it('returns red for grade < 5', () => {
    expect(notaColor(0)).toContain('red');
    expect(notaColor(4.9)).toContain('red');
  });

  it('returns amber for grade 5-6.9', () => {
    expect(notaColor(5)).toContain('amber');
    expect(notaColor(6.9)).toContain('amber');
  });

  it('returns emerald for grade >= 7', () => {
    expect(notaColor(7)).toContain('emerald');
    expect(notaColor(10)).toContain('emerald');
  });
});

describe('notaBg', () => {
  it('returns muted bg for null', () => {
    expect(notaBg(null)).toContain('muted');
  });

  it('returns red bg for grade < 5', () => {
    expect(notaBg(0)).toContain('red');
    expect(notaBg(4.9)).toContain('red');
  });

  it('returns amber bg for grade 5-6.9', () => {
    expect(notaBg(5)).toContain('amber');
    expect(notaBg(6.9)).toContain('amber');
  });

  it('returns emerald bg for grade >= 7', () => {
    expect(notaBg(7)).toContain('emerald');
    expect(notaBg(10)).toContain('emerald');
  });
});

describe('notaBgCard', () => {
  it('returns empty string for null', () => {
    expect(notaBgCard(null)).toBe('');
  });

  it('returns red border for grade < 5', () => {
    expect(notaBgCard(3)).toContain('red');
  });

  it('returns amber border for grade 5-6.9', () => {
    expect(notaBgCard(6)).toContain('amber');
  });

  it('returns emerald border for grade >= 7', () => {
    expect(notaBgCard(8)).toContain('emerald');
  });
});

describe('situacao', () => {
  it('returns Pendente for null', () => {
    expect(situacao(null)).toBe('Pendente');
  });

  it('returns Reprovado for grade < 5', () => {
    expect(situacao(0)).toBe('Reprovado');
    expect(situacao(4.9)).toBe('Reprovado');
  });

  it('returns Recuperação for grade 5-6.9', () => {
    expect(situacao(5)).toBe('Recuperação');
    expect(situacao(6.9)).toBe('Recuperação');
  });

  it('returns Aprovado for grade >= 7', () => {
    expect(situacao(7)).toBe('Aprovado');
    expect(situacao(10)).toBe('Aprovado');
  });
});

describe('situacaoBadge', () => {
  it('returns slate for null', () => {
    expect(situacaoBadge(null)).toContain('slate');
  });

  it('returns red for grade < 5', () => {
    expect(situacaoBadge(2)).toContain('red');
  });

  it('returns amber for grade 5-6.9', () => {
    expect(situacaoBadge(5.5)).toContain('amber');
  });

  it('returns emerald for grade >= 7', () => {
    expect(situacaoBadge(9)).toContain('emerald');
  });
});

describe('formatNota', () => {
  it('returns dash for null', () => {
    expect(formatNota(null)).toBe('—');
  });

  it('returns dash for undefined', () => {
    expect(formatNota(undefined)).toBe('—');
  });

  it('formats integer to 1 decimal', () => {
    expect(formatNota(7)).toBe('7.0');
  });

  it('rounds to 1 decimal place', () => {
    expect(formatNota(8.55)).toBe('8.6');
  });

  it('formats zero correctly', () => {
    expect(formatNota(0)).toBe('0.0');
  });

  it('formats 10 correctly', () => {
    expect(formatNota(10)).toBe('10.0');
  });
});

describe('periodoLabel', () => {
  it('converts 2025/1 to first semester label', () => {
    expect(periodoLabel('2025/1')).toBe('1º Semestre de 2025');
  });

  it('converts 2025/2 to second semester label', () => {
    expect(periodoLabel('2025/2')).toBe('2º Semestre de 2025');
  });
});

describe('isAtivo', () => {
  it('returns true for current period', () => {
    const now = new Date();
    const ano = now.getFullYear();
    const sem = now.getMonth() < 6 ? 1 : 2;
    expect(isAtivo(`${ano}/${sem}`)).toBe(true);
  });

  it('returns false for past period', () => {
    expect(isAtivo('2020/1')).toBe(false);
  });

  it('returns false for future period', () => {
    expect(isAtivo('2099/1')).toBe(false);
  });
});

describe('isConcluido', () => {
  it('returns true for past year', () => {
    expect(isConcluido('2020/1')).toBe(true);
  });

  it('returns true for same year earlier semester', () => {
    const now = new Date();
    const ano = now.getFullYear();
    const semAtual = now.getMonth() < 6 ? 1 : 2;
    if (semAtual === 2) {
      expect(isConcluido(`${ano}/1`)).toBe(true);
    }
  });

  it('returns false for future period', () => {
    expect(isConcluido('2099/2')).toBe(false);
  });

  it('returns false for current period', () => {
    const now = new Date();
    const ano = now.getFullYear();
    const sem = now.getMonth() < 6 ? 1 : 2;
    expect(isConcluido(`${ano}/${sem}`)).toBe(false);
  });
});
