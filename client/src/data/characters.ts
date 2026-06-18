export interface Toon {
  id: string;
  name: string;
  category: "regular" | "main" | "event" | "lethal";
}

export interface Trinket {
  id: string;
  name: string;
  category: "shop" | "common" | "uncommon" | "rare" | "main" | "lethal";
  rarity?: string;
}

export const TOONS: Toon[] = [
  // Regular Toons
  { id: "astro", name: "Astro", category: "regular" },
  { id: "bassie", name: "Bassie", category: "regular" },
  { id: "blot", name: "Blot", category: "regular" },
  { id: "bobette", name: "Bobette", category: "regular" },
  { id: "boxten", name: "Boxten", category: "regular" },
  { id: "brightney", name: "Brightney", category: "regular" },
  { id: "brusha", name: "Brusha", category: "regular" },
  { id: "coal", name: "Coal", category: "regular" },
  { id: "cocoa", name: "Cocoa", category: "regular" },
  { id: "connie", name: "Connie", category: "regular" },
  { id: "cosmo", name: "Cosmo", category: "regular" },
  { id: "eclipse", name: "Eclipse", category: "regular" },
  { id: "eggson", name: "Eggson", category: "regular" },
  { id: "finn", name: "Finn", category: "regular" },
  { id: "flutter", name: "Flutter", category: "regular" },
  { id: "flyte", name: "Flyte", category: "regular" },
  { id: "gigi", name: "Gigi", category: "regular" },
  { id: "ginger", name: "Ginger", category: "regular" },
  { id: "glisten", name: "Glisten", category: "regular" },
  { id: "goob", name: "Goob", category: "regular" },
  { id: "gourdy", name: "Gourdy", category: "regular" },
  { id: "looey", name: "Looey", category: "regular" },
  { id: "pebble", name: "Pebble", category: "regular" },
  { id: "poppy", name: "Poppy", category: "regular" },
  { id: "razzle-dazzle", name: "Razzle & Dazzle", category: "regular" },
  { id: "ribecca", name: "Ribecca", category: "regular" },
  { id: "rudie", name: "Rudie", category: "regular" },
  { id: "shelly", name: "Shelly", category: "regular" },
  { id: "shrimpo", name: "Shrimpo", category: "regular" },
  { id: "soulvester", name: "Soulvester", category: "regular" },
  { id: "sprout", name: "Sprout", category: "regular" },
  { id: "squirm", name: "Squirm", category: "regular" },
  { id: "teagan", name: "Teagan", category: "regular" },
  { id: "tisha", name: "Tisha", category: "regular" },
  { id: "toodles", name: "Toodles", category: "regular" },
  { id: "vee", name: "Vee", category: "regular" },
];

export const TRINKETS: Trinket[] = [
  // Shop / Mastery Trinkets
  { id: "alarm", name: "Alarm", category: "shop" },
  { id: "blushy-bat", name: "Blushy Bat", category: "shop" },
  { id: "cardboard-armor", name: "Cardboard 'Armor'", category: "shop" },
  { id: "coin-purse", name: "Coin Purse", category: "shop" },
  { id: "cooler", name: "Cooler", category: "shop" },
  { id: "machine-manual", name: "Machine Manual", category: "shop" },
  { id: "megaphone", name: "Megaphone", category: "shop" },
  { id: "pop-pack", name: "Pop Pack", category: "shop" },
  { id: "pull-toy", name: "Pull Toy", category: "shop" },
  { id: "research-map", name: "Research Map", category: "shop" },
  { id: "speedometer", name: "Speedometer", category: "shop" },
  { id: "speedy-shoes", name: "Speedy Shoes", category: "shop" },
  { id: "thermos", name: "Thermos", category: "shop" },
  { id: "thinking-cap", name: "Thinking Cap", category: "shop" },
  { id: "wrench", name: "Wrench", category: "shop" },

  // Common Twisted Research Trinkets
  { id: "blue-bandana", name: "Blue Bandana", category: "common", rarity: "Common" },
  { id: "brick", name: "Brick", category: "common", rarity: "Common" },
  { id: "clown-horn", name: "Clown Horn", category: "common", rarity: "Common" },
  { id: "feather-duster", name: "Feather Duster", category: "common", rarity: "Common" },
  { id: "paint-bucket", name: "Paint Bucket", category: "common", rarity: "Common" },
  { id: "party-popper", name: "Party Popper", category: "common", rarity: "Common" },
  { id: "pink-bow", name: "Pink Bow", category: "common", rarity: "Common" },
  { id: "sweet-charm", name: "Sweet Charm", category: "common", rarity: "Common" },

  // Uncommon Twisted Research Trinkets
  { id: "dog-plush", name: "Dog Plush", category: "uncommon", rarity: "Uncommon" },
  { id: "fancy-purse", name: "Fancy Purse", category: "uncommon", rarity: "Uncommon" },
  { id: "fishing-rod", name: "Fishing Rod", category: "uncommon", rarity: "Uncommon" },
  { id: "ghost-snakes", name: "Ghost Snakes In A Can", category: "uncommon", rarity: "Uncommon" },
  { id: "magnifying-glass", name: "Magnifying Glass", category: "uncommon", rarity: "Uncommon" },
  { id: "ribbon-spool", name: "Ribbon Spool", category: "uncommon", rarity: "Uncommon" },
  { id: "spare-bulb", name: "Spare Bulb", category: "uncommon", rarity: "Uncommon" },

  // Rare Twisted Research Trinkets
  { id: "crayon-set", name: "Crayon Set", category: "rare", rarity: "Rare" },
  { id: "diary", name: "Diary", category: "rare", rarity: "Rare" },
  { id: "friendship-bracelet", name: "Friendship Bracelet", category: "rare", rarity: "Rare" },
  { id: "lucky-coin", name: "Lucky Coin", category: "rare", rarity: "Rare" },
  { id: "mime-makeup", name: "Mime Makeup", category: "rare", rarity: "Rare" },
  { id: "stress-ball", name: "Stress Ball", category: "rare", rarity: "Rare" },
  { id: "vanity-mirror", name: "Vanity Mirror", category: "rare", rarity: "Rare" },

  // Main Character Twisted Research Trinkets
  { id: "bone", name: "Bone", category: "main", rarity: "Main Character" },
  { id: "participation-award", name: "Participation Award", category: "main", rarity: "Main Character" },
  { id: "savory-charm", name: "Savory Charm", category: "main", rarity: "Main Character" },
  { id: "star-pillow", name: "Star Pillow", category: "main", rarity: "Main Character" },
  { id: "vees-remote", name: "Vee's Remote", category: "main", rarity: "Main Character" },

  // Lethal Trinkets
  { id: "train-whistle", name: "Train Whistle", category: "lethal", rarity: "Lethal" },
  { id: "dandy-plush", name: "Dandy Plush", category: "lethal", rarity: "Lethal" },
];

export const TRINKET_CATEGORIES = {
  shop: "Shop / Mastery",
  common: "Common Twisted",
  uncommon: "Uncommon Twisted",
  rare: "Rare Twisted",
  main: "Main Character Twisted",
  lethal: "Lethal",
};

export const TOON_CATEGORIES = {
  regular: "Regular Toons",
  main: "Main Characters",
  event: "Event Toons",
  lethal: "Lethal Toons",
};
