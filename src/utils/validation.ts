export interface ValidationRule {
  test: (value: any) => boolean;
  message: string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

export const validate = (data: any, schema: ValidationSchema): ValidationResult => {
  const errors: { [key: string]: string } = {};

  Object.keys(schema).forEach(field => {
    const value = data[field];
    const rules = schema[field];

    for (const rule of rules) {
      if (!rule.test(value)) {
        errors[field] = rule.message;
        break;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Common validation rules
export const rules = {
  required: (message = 'This field is required'): ValidationRule => ({
    test: value => value !== undefined && value !== null && value !== '',
    message
  }),
  
  email: (message = 'Invalid email address'): ValidationRule => ({
    test: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message
  }),
  
  minLength: (length: number, message?: string): ValidationRule => ({
    test: value => String(value).length >= length,
    message: message || `Must be at least ${length} characters`
  }),
  
  maxLength: (length: number, message?: string): ValidationRule => ({
    test: value => String(value).length <= length,
    message: message || `Must be no more than ${length} characters`
  }),
  
  numeric: (message = 'Must be a number'): ValidationRule => ({
    test: value => !isNaN(parseFloat(value)) && isFinite(value),
    message
  }),
  
  min: (min: number, message?: string): ValidationRule => ({
    test: value => parseFloat(value) >= min,
    message: message || `Must be at least ${min}`
  }),
  
  max: (max: number, message?: string): ValidationRule => ({
    test: value => parseFloat(value) <= max,
    message: message || `Must be no more than ${max}`
  })
};

export const decimalToFraction = (decimal: number | string): string => {
  if (decimal === '' || decimal === null || decimal === undefined) return '';

  const num = typeof decimal === 'string' ? parseFloat(decimal) : decimal;

  if (isNaN(num)) return '';

  if (num === 0) return '0';

  const isNegative = num < 0;
  const absDecimal = Math.abs(num);
  const wholeNumber = Math.floor(absDecimal);
  const fractionalPart = absDecimal - wholeNumber;

  if (fractionalPart === 0 || fractionalPart < 0.001) {
    if (wholeNumber === 0) return '0';
    return (isNegative ? '-' : '') + wholeNumber.toString();
  }

  const fractionMap: { [key: string]: string } = {
    '0.125': '1/8',
    '0.25': '1/4',
    '0.375': '3/8',
    '0.5': '1/2',
    '0.625': '5/8',
    '0.75': '3/4',
    '0.875': '7/8'
  };

  const roundedFraction = fractionalPart.toFixed(3);
  const fractionStr = fractionMap[roundedFraction];

  if (fractionStr) {
    if (wholeNumber === 0) {
      return (isNegative ? '-' : '') + fractionStr;
    }
    return (isNegative ? '-' : '') + wholeNumber + ' ' + fractionStr;
  }

  return num.toString();
};