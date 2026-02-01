export function useBorderColours() {
  const colors = [
    'oklab(0.67 0.29 -0.09)',
    'oklab(86% -0.12 0.07)',
    'oklab(73% 0 -0.1)',
    'oklab(76% 0.13 -0.06)',
    'oklab(87% 0 0.09)',
  ]

  return useState('borderColours', () => colors.sort(() => Math.random() - 0.5))
}
