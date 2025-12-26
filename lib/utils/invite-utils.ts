// Normalize an invite code to uppercase and trimmed
export const normalizeInviteCode = (code: string): string => {
    return code.trim().toUpperCase()
}

// Generate a random invite code (6 characters, alphanumeric)
export const generateInviteCode = (): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let code = ""
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
}

// Validate an invite code format
export const isValidInviteCode = (code: string): boolean => {
    const normalized = normalizeInviteCode(code)
    return /^[A-Z0-9]{6}$/.test(normalized)
}
