import type { Node } from 'unist';

export interface TextNode extends Node { 
  type: 'text';
  value: string;
}

export const TENURE_COLORS_DARK = {
  marketPurchase: 'rgb(var(--freehold-equity-color-rgb))',
  marketRent: 'rgb(var(--private-rent-land-color-rgb))',
  fairholdLandPurchase: 'rgb(var(--fairhold-equity-color-rgb))',
  fairholdLandRent: 'rgb(var(--fairhold-equity-color-rgb))',
  socialRent: 'rgb(var(--social-rent-land-color-rgb))'
} as const;

export const TENURE_COLORS_LIGHT = {
  marketPurchase: 'rgb(var(--freehold-detail-color-rgb))',
  marketRent: 'rgb(var(--private-rent-detail-color-rgb))',
  fairholdLandPurchase: 'rgb(var(--fairhold-detail-color-rgb))',
  fairholdLandRent: 'rgb(var(--fairhold-detail-color-rgb))',
  socialRent: 'rgb(var(--social-rent-detail-color-rgb))'
} as const;