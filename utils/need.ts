export function need<T extends unknown>(
  value: T | undefined | null,
  msg: string = 'Missing value',
) {
  if (!value) {
    throw new Error(msg);
  }
  return value;
}
