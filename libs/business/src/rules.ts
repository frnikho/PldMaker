export const rules = {
  dod: {
    title: {
      length: {
        max: 32,
        min: 16,
      }
    }
  }
}

export const dodRules = rules.dod;

export function getBuisnessRules<T>(key: ''): T {
  return null as T;
}
