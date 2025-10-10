// DMV (DC, Maryland, Virginia) Area Codes
const DC_AREA_CODES = ['202', '771']
const MD_AREA_CODES = ['240', '301', '443', '667']
const VA_AREA_CODES = ['276', '434', '540', '571', '703', '757', '804', '826', '948']

export type RegionCode = 'DC' | 'MD' | 'VA' | 'OTHER'

/**
 * Extracts area code from a phone number string
 * Handles various formats: (202) 555-0123, 202-555-0123, 2025550123, +12025550123, etc.
 */
export function extractAreaCode(phone: string): string | null {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '')

  // Handle international format (+1...)
  if (digits.length >= 10) {
    // If starts with 1 and has 11+ digits, skip the 1
    if (digits.startsWith('1') && digits.length >= 11) {
      return digits.substring(1, 4)
    }
    // Otherwise take first 3 digits
    return digits.substring(0, 3)
  }

  return null
}

/**
 * Determines the region based on phone number area code
 * Returns 'DC', 'MD', 'VA', or 'OTHER'
 */
export function detectRegionFromPhone(phone: string): RegionCode {
  const areaCode = extractAreaCode(phone)

  if (!areaCode) {
    return 'OTHER'
  }

  if (DC_AREA_CODES.includes(areaCode)) {
    return 'DC'
  }

  if (MD_AREA_CODES.includes(areaCode)) {
    return 'MD'
  }

  if (VA_AREA_CODES.includes(areaCode)) {
    return 'VA'
  }

  return 'OTHER'
}

/**
 * Validates if a phone number is from the DMV area
 */
export function isDMVPhone(phone: string): boolean {
  const region = detectRegionFromPhone(phone)
  return region === 'DC' || region === 'MD' || region === 'VA'
}

/**
 * Formats a phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '')

  if (digits.length === 10) {
    return `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6)}`
  }

  if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.substring(1, 4)}) ${digits.substring(4, 7)}-${digits.substring(7)}`
  }

  return phone
}

/**
 * Gets a human-readable region name
 */
export function getRegionName(regionCode: RegionCode): string {
  switch (regionCode) {
    case 'DC':
      return 'Washington, DC'
    case 'MD':
      return 'Maryland'
    case 'VA':
      return 'Virginia'
    case 'OTHER':
      return 'Tourist, transplant, or metaverse'
    default:
      return 'Unknown'
  }
}
