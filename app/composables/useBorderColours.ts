export function useBorderColours() {
  const colors = [
    'oklab(94% -0.05 0.03)',
    'oklab(86% -0.12 0.07)',
    'oklab(73% 0 -0.1)',
    'oklab(76% 0.13 -0.06)',
    'oklab(87% 0 0.09)',
  ]

  return useState('borderColours', () => colors.sort(() => Math.random() - 0.5))
}
