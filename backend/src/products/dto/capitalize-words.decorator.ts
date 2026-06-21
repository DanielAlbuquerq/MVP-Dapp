import { Transform, TransformOptions } from 'class-transformer';

export function CapitalizeWords(options?: TransformOptions) {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    
    return value
      .toLowerCase()
      .trim() // Removes accidental extra spaces at start/end
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }, options);
}
