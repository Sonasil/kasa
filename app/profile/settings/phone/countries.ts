export type Country = {
  id: string
  name: string
  dial: string
  flag: string
}

export const COUNTRIES: Country[] = [
    // Top / nearby
    { id: "TR", name: "Türkiye", dial: "+90", flag: "🇹🇷" },
    { id: "CY", name: "Kıbrıs", dial: "+357", flag: "🇨🇾" },
    { id: "GR", name: "Ελλάδα", dial: "+30", flag: "🇬🇷" },
    { id: "BG", name: "България", dial: "+359", flag: "🇧🇬" },
    { id: "RO", name: "România", dial: "+40", flag: "🇷🇴" },
  
    // Europe
    { id: "DE", name: "Deutschland", dial: "+49", flag: "🇩🇪" },
    { id: "NL", name: "Nederland", dial: "+31", flag: "🇳🇱" },
    { id: "BE", name: "België", dial: "+32", flag: "🇧🇪" },
    { id: "FR", name: "France", dial: "+33", flag: "🇫🇷" },
    { id: "ES", name: "España", dial: "+34", flag: "🇪🇸" },
    { id: "IT", name: "Italia", dial: "+39", flag: "🇮🇹" },
    { id: "PT", name: "Portugal", dial: "+351", flag: "🇵🇹" },
    { id: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧" },
    { id: "IE", name: "Ireland", dial: "+353", flag: "🇮🇪" },
    { id: "CH", name: "Schweiz", dial: "+41", flag: "🇨🇭" },
    { id: "AT", name: "Österreich", dial: "+43", flag: "🇦🇹" },
    { id: "SE", name: "Sverige", dial: "+46", flag: "🇸🇪" },
    { id: "NO", name: "Norge", dial: "+47", flag: "🇳🇴" },
    { id: "DK", name: "Danmark", dial: "+45", flag: "🇩🇰" },
    { id: "FI", name: "Suomi", dial: "+358", flag: "🇫🇮" },
    { id: "PL", name: "Polska", dial: "+48", flag: "🇵🇱" },
    { id: "CZ", name: "Česko", dial: "+420", flag: "🇨🇿" },
    { id: "HU", name: "Magyarország", dial: "+36", flag: "🇭🇺" },
    { id: "UA", name: "Україна", dial: "+380", flag: "🇺🇦" },
  
    // Middle East
    { id: "IL", name: "Israel", dial: "+972", flag: "🇮🇱" },
    { id: "SA", name: "Saudi Arabia", dial: "+966", flag: "🇸🇦" },
    { id: "AE", name: "United Arab Emirates", dial: "+971", flag: "🇦🇪" },
    { id: "QA", name: "Qatar", dial: "+974", flag: "🇶🇦" },
    { id: "KW", name: "Kuwait", dial: "+965", flag: "🇰🇼" },
    { id: "JO", name: "Jordan", dial: "+962", flag: "🇯🇴" },
    { id: "LB", name: "Lebanon", dial: "+961", flag: "🇱🇧" },
    { id: "EG", name: "Egypt", dial: "+20", flag: "🇪🇬" },
  
    // Americas
    { id: "US", name: "United States", dial: "+1", flag: "🇺🇸" },
    { id: "CA", name: "Canada", dial: "+1", flag: "🇨🇦" },
    { id: "MX", name: "México", dial: "+52", flag: "🇲🇽" },
    { id: "BR", name: "Brasil", dial: "+55", flag: "🇧🇷" },
    { id: "AR", name: "Argentina", dial: "+54", flag: "🇦🇷" },
  
    // Asia
    { id: "RU", name: "Россия", dial: "+7", flag: "🇷🇺" },
    { id: "KZ", name: "Қазақстан", dial: "+7", flag: "🇰🇿" },
    { id: "AZ", name: "Azərbaycan", dial: "+994", flag: "🇦🇿" },
    { id: "GE", name: "საქართველო", dial: "+995", flag: "🇬🇪" },
    { id: "IN", name: "India", dial: "+91", flag: "🇮🇳" },
    { id: "PK", name: "Pakistan", dial: "+92", flag: "🇵🇰" },
    { id: "BD", name: "Bangladesh", dial: "+880", flag: "🇧🇩" },
    { id: "CN", name: "中国", dial: "+86", flag: "🇨🇳" },
    { id: "JP", name: "日本", dial: "+81", flag: "🇯🇵" },
    { id: "KR", name: "대한민국", dial: "+82", flag: "🇰🇷" },
    { id: "ID", name: "Indonesia", dial: "+62", flag: "🇮🇩" },
    { id: "MY", name: "Malaysia", dial: "+60", flag: "🇲🇾" },
    { id: "SG", name: "Singapore", dial: "+65", flag: "🇸🇬" },
    { id: "TH", name: "Thailand", dial: "+66", flag: "🇹🇭" },
    { id: "VN", name: "Việt Nam", dial: "+84", flag: "🇻🇳" },
  
    // Oceania
    { id: "AU", name: "Australia", dial: "+61", flag: "🇦🇺" },
    { id: "NZ", name: "New Zealand", dial: "+64", flag: "🇳🇿" },
  ]