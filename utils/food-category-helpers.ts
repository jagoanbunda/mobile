import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type IconName = keyof typeof MaterialIcons.glyphMap;

/**
 * Food category icon mapping
 * Using icons confirmed available in MaterialIcons
 */
const CATEGORY_ICONS: Record<string, string> = {
  buah: 'apple',
  'buah-buahan': 'apple',
  sayuran: 'eco',
  daging: 'local-dining',
  ikan: 'restaurant',
  susu: 'local-cafe',
  'produk olahan susu': 'local-cafe',
  nasi: 'rice-bowl',
  'beras dan hasil olahan': 'rice-bowl',
  roti: 'bakery-dining',
  telur: 'egg',
  kacang: 'grain',
  'kacang-kacangan': 'grain',
  minuman: 'local-cafe',
  'makanan-olahan': 'fastfood',
  'minyak dan lemak': 'opacity',
  'gula dan sirup': 'cookie',
  lainnya: 'restaurant',
};

/**
 * Food category color mapping
 */
const CATEGORY_COLORS: Record<string, string> = {
  buah: '#F97316', // orange
  'buah-buahan': '#EC4899', // pink
  sayuran: '#22C55E', // green
  daging: '#D4004A', // red
  ikan: '#0066CC', // blue
  susu: '#8B5CF6', // violet
  'produk olahan susu': '#8B5CF6', // violet
  nasi: '#EA580C', // orange-amber
  'beras dan hasil olahan': '#EA580C', // orange-amber
  roti: '#D97706', // brown
  telur: '#CA8A04', // yellow
  kacang: '#84CC16', // lime
  'kacang-kacangan': '#84CC16', // lime
  minuman: '#06B6D4', // cyan
  'makanan-olahan': '#F43F5E', // rose
  'minyak dan lemak': '#F59E0B', // amber
  'gula dan sirup': '#06B6D4', // cyan
  lainnya: '#6B7280', // gray
};

/**
 * Get MaterialIcons name for a food category
 * @param category - Food category string
 * @returns MaterialIcons icon name as string
 */
export function getCategoryIcon(category: string): string {
  const normalizedCategory = category.toLowerCase().trim();
  return CATEGORY_ICONS[normalizedCategory] || CATEGORY_ICONS['lainnya'];
}

/**
 * Get hex color for a food category
 * @param category - Food category string
 * @returns Hex color string
 */
export function getCategoryColor(category: string): string {
  const normalizedCategory = category.toLowerCase().trim();
  return CATEGORY_COLORS[normalizedCategory] || CATEGORY_COLORS['lainnya'];
}

/**
 * Get both icon and color for a food category
 * @param category - Food category string
 * @returns Object with icon name and color
 */
export function getCategoryStyle(category: string): { icon: string; color: string } {
  return {
    icon: getCategoryIcon(category),
    color: getCategoryColor(category),
  };
}

/**
 * Cast an icon name to the proper type for MaterialIcons
 * Use this when you need strict typing for the name prop
 */
export function asIconName(name: string): IconName {
  return name as IconName;
}
