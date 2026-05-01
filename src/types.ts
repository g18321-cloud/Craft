export type Theme = 'sakura' | 'zoo' | 'fuji' | 'city';
export type Weather = 'sunny' | 'rainy' | 'snowy';

export interface GameObject {
  id: string;
  type: string;
  position: [number, number, number];
  rotation: number;
  theme: Theme;
  scale: number;
}

export interface ItemTemplate {
  type: string;
  name: string;
  icon: string;
  theme: Theme;
  color: string;
}

export const ITEM_TEMPLATES: ItemTemplate[] = [
  // Sakura Theme
  { type: 'sakura_tree', name: '櫻花樹', icon: '🌸', theme: 'sakura', color: '#ffb7c5' },
  { type: 'lantern', name: '燈籠', icon: '🏮', theme: 'sakura', color: '#ff4d4d' },
  { type: 'torii', name: '鳥居', icon: '⛩️', theme: 'sakura', color: '#cc0000' },
  { type: 'bridge', name: '紅橋', icon: '🌉', theme: 'sakura', color: '#a52a2a' },
  { type: 'grass', name: '草地', icon: '🌿', theme: 'sakura', color: '#90be6d' },
  { type: 'gravel_path', name: '碎石步道', icon: '🛤️', theme: 'sakura', color: '#ced4da' },
  
  // Zoo Theme
  { type: 'panda', name: '熊貓', icon: '🐼', theme: 'zoo', color: '#ffffff' },
  { type: 'elephant', name: '大象', icon: '🐘', theme: 'zoo', color: '#888888' },
  { type: 'bamboo', name: '竹子', icon: '🎋', theme: 'zoo', color: '#2d5a27' },
  { type: 'fence', name: '圍欄', icon: '🚧', theme: 'zoo', color: '#8b4513' },
  { type: 'dog', name: '小狗', icon: '🐶', theme: 'zoo', color: '#e6ccb2' },
  { type: 'cat', name: '小貓', icon: '🐱', theme: 'zoo', color: '#adb5bd' },
  { type: 'grandpa', name: '老爺爺', icon: '👴', theme: 'zoo', color: '#dee2e6' },
  { type: 'grandma', name: '老奶奶', icon: '👵', theme: 'zoo', color: '#dee2e6' },
  { type: 'boy', name: '小男孩', icon: '👦', theme: 'zoo', color: '#dee2e6' },
  { type: 'girl', name: '小女孩', icon: '👧', theme: 'zoo', color: '#dee2e6' },
  { type: 'man', name: '男人', icon: '👨', theme: 'zoo', color: '#dee2e6' },
  { type: 'woman', name: '女人', icon: '👩', theme: 'zoo', color: '#dee2e6' },

  // Fuji Theme
  { type: 'fuji_mountain', name: '富士山', icon: '🗻', theme: 'fuji', color: '#3a5a8c' },
  { type: 'shrine', name: '神社', icon: '🛕', theme: 'fuji', color: '#d4af37' },
  { type: 'pine_tree', name: '松樹', icon: '🌲', theme: 'fuji', color: '#1a331a' },
  { type: 'rock', name: '景石', icon: '🪨', theme: 'fuji', color: '#555555' },
  { type: 'cloud', name: '雲朵', icon: '☁️', theme: 'fuji', color: '#ffffff' },
  { type: 'lake', name: '湖泊', icon: '💧', theme: 'fuji', color: '#48cae4' },

  // City Theme
  { type: 'taipei101', name: '台北101', icon: '🏢', theme: 'city', color: '#008b8b' },
  { type: 'office_building', name: '商業大樓', icon: '🏙️', theme: 'city', color: '#404040' },
  { type: 'house', name: '一般住家', icon: '🏠', theme: 'city', color: '#f4a460' },
  { type: 'convenience_store', name: '便利商店', icon: '🏪', theme: 'city', color: '#ffffff' },
  { type: 'road', name: '馬路', icon: '🛣️', theme: 'city', color: '#333333' },
  { type: 'traffic_light', name: '紅綠燈', icon: '🚥', theme: 'city', color: '#222222' },
  { type: 'street_light', name: '路燈', icon: '💡', theme: 'city', color: '#ffff00' },
  { type: 'car', name: '汽車', icon: '🚗', theme: 'city', color: '#ff0000' },
  { type: 'motorcycle', name: '機車', icon: '🛵', theme: 'city', color: '#ffcc00' },
  { type: 'apartment', name: '公寓', icon: '🏢', theme: 'city', color: '#a5a5a5' },
  { type: 'large_park', name: '大型公園', icon: '🌳', theme: 'city', color: '#7cb342' },
];
