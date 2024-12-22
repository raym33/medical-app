export function validateRequired<T>(value: T | null | undefined, fieldName: string): string | null {
  if (!value) {
    return `${fieldName} is required`;
  }
  return null;
}

export function validateLength(value: string, min: number, max: number, fieldName: string): string | null {
  if (value.length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  if (value.length > max) {
    return `${fieldName} cannot exceed ${max} characters`;
  }
  return null;
}