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

export const AFFORD_FAIRHOLD = [
  { label: "Yes", colour: "rgb(var(--fairhold-equity-color-rgb))" },
  { label: "Yes, but Fairhold Land Rent only, because the deposit is lower", colour: "rgb(var(--fairhold-interest-color-rgb))" },
  { label: "No, it's still too expensive", colour: "rgb(var(--social-rent-land-color-rgb))" },
] as const;

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
    "Neither support nor oppose", 
    "Somewhat oppose",
    "Strongly oppose",
    "Other",
]