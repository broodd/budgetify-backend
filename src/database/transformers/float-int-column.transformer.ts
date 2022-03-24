export const FloatIntColumnTransformer = {
  to: (value: number): number => value && parseFloat(value.toFixed(2)) * 100,
  from: (value: number) => value / 100,
};
