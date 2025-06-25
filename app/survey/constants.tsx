export const TENURE_COLORS: Record<string, string> = {
    "Social rent": "rgb(var(--social-rent-land-color-rgb))",
    "Shared ownership": "rgb(var(--shared-ownership-color-rgb))",
    "Private rent": "rgb(var(--private-rent-land-color-rgb))",
    "Market purchase": "rgb(var(--freehold-equity-color-rgb))",
    "Fairhold": "rgb(var(--fairhold-equity-color-rgb))"
};

export const AGE_ORDER = [
  "0-18",
  "19-24",
  "25-34",
  "35-44",
  "45-54",
  "65+"
]

export const AFFORD_FAIRHOLD_ORDER = [
  "Yes",
  "Yes, but Fairhold Land Rent only, because the deposit is lower",
  "No, it's still too expensive",
];

export const SUPPORT_DEVELOPMENT_ORDER = [
    "Strongly supportive of any development", 
    "Quite supportive of any development", 
    "It depends", 
    "Quite opposed to most development",
    "Strongly opposed to any development",
    "Don't know",
]

export const SUPPORT_FAIRHOLD_ORDER = [
    "Strongly support", 
    "Somewhat support", 
    "Neighter support nor oppose", 
    "Somewhat oppose",
    "Strongly oppose",
    "Other",
]