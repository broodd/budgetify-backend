export const FloatIntColumnTransformer = {
  to: (value: number): number => value * 100,
  from: (value: number) => value / 100,
};
