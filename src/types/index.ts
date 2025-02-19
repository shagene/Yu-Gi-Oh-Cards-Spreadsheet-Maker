export interface Card {
  id: number;
  name: string;
  type: string;
  description: string;
  card_data: string; // JSON string
  image_url: string;
}

export interface YGOCard {
  id: number;
  name: string;
  type: string;
  desc: string;
  race: string;
  archetype?: string;
  card_sets?: Array<{
    set_name: string;
    set_code: string;
    set_rarity: string;
    set_price: string;
  }>;
  card_images?: Array<{
    id: number;
    image_url: string;
    image_url_small: string;
  }>;
  card_prices?: Array<{
    cardmarket_price: string;
    tcgplayer_price: string;
    ebay_price: string;
    amazon_price: string;
    coolstuffinc_price: string;
  }>;
}

export interface YGOAPIResponse {
  data: YGOCard[];
}

export interface Step {
  note: string;
  cards: Card[];
}