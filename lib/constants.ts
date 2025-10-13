/**
 * Shared constants that can be used in both client and server components
 */

/**
 * Birth decade options for user profiles
 */
export const BIRTH_DECADES = [
  { value: '1900-1940', label: 'Born 1900-1940 (Silent Generation and earlier)' },
  { value: '1940-1950', label: 'Born 1940-1950 (Silent Generation)' },
  { value: '1950-1960', label: 'Born 1950-1960 (Baby Boomers)' },
  { value: '1960-1970', label: 'Born 1960-1970 (Baby Boomers / Gen X)' },
  { value: '1970-1980', label: 'Born 1970-1980 (Gen X)' },
  { value: '1980-1990', label: 'Born 1980-1990 (Millennials)' },
  { value: '1990-2000', label: 'Born 1990-2000 (Millennials / Gen Z)' },
  { value: '2000-2010', label: 'Born 2000-2010 (Gen Z)' },
] as const

export type BirthDecade = typeof BIRTH_DECADES[number]['value']
