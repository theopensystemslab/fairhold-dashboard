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

export const WHY_FAIRHOLD_LABELS = {
  "To own a home": "Home ownership",
  "To spend less money on housing": "Affordability",
  "To get a better home": "Quality home",
  "I want to build my own home": "Self-build",
  "To live in a better location": "Location",
  "Environmental sustainability is important to me": "Environmental sustainability",
  "I want to see a fairer society": "Fairness"
}

export const WHY_NOT_FAIRHOLD_LABELS = {
  "It's too expensive for me": "Too expensive",
  "I don't want the responsibility of maintaining a home": "Maintenance burden",
  "I want my home to appreciate in value as an investment asset": "Want investment gains",
  "I want to be able to make money from letting my home out": "Want rental income", 
  "I'd be worried about moving house in future": "Moving concerns",
  "It feels too complicated": "Too complicated",
  "I don't know enough about it yet": "Not enough information"
}

export const SUPPORT_DEVELOPMENT_LABELS = {
  "Homes that are affordable to keyworkers": "Prioritise keyworkers",
  "Homes that are affordable to low-income families": "Prioritise low-income",
  "Homes that are affordable to me": "Affordable to me",
  "Priority given to local residents and their families (to allow downsizing, for example)": "Prioritise locals",
  "Community-led or self-build development (designed for people, not profit)": "Community-led or self-build",
  "Council or social housing provider led (designed for people, not profit)": "Social housing",
  "Beautiful design that improves the local character": "Beautiful design",
  "Traditional design, with a heritage character": "Traditional design",
  "Supported by new infrastructure (eg. public transport, cycle lanes, schools, GPs, parks)": "New infrastructure", 
  "Walkable streets with trees and green spaces": "Pedestrianisation",
  "Includes shops, cafés and community facilities": "Local amenities",
  "Small-scale development spread across the area": "Small-scale development",
  "Infill development on gap sites, increasing the density of existing neighbourhoods instead of developing greenfield land": "Infill development",
  "Only build new neighbourhoods on sites away from existing homes": "Away from existing homes",
  "Environmentally sustainable, zero-carbon homes": "Environmentally sustainable",
  "Development that protects and enhances biodiversity": "Biodiversity gain",
  "Built by local companies, supporting local jobs": "Local jobs",
  "Includes a financial return for me and my family": "Financial return",
  "Includes a financial return for the local community": "Community financial return",
  "No new build. We should only convert existing buildings or bring empty homes back into use": "No new builds",
  "None of these, there shouldn't be any new homes": "No new homes",
}

export const HOUSING_OUTCOMES_LABELS = {
  "Security from being evicted": "No eviction",
  "Lower cost": "Lower cost",
  "Proximity to work": "Close to work",
  "Proximity to friends and family": "Close to friends & family",
  "Proximity to good schools": "Good schools",
  "To get my money back when I sell": "Money back on sale",
  "To retire with low outgoings": "Low retirement costs",
  "Lower energy bills": "Lower energy bills",
  "Freedom to improve or repair my home myself": "Freedom to improve",
  "Home kept in good state of repair by others": "Repair by others",
  "Quality of space": "Quality of space",
  "More space": "More space",
  "Sense of community / shared spaces within the neighbourhood": "Sense of community",
  "Better public transport connections": "Public transport",
  "Walkable neighbourhood": "Walkable neighbourhood",
  "Lower crime / antisocial behaviour": "Safer neighbourhood",
  "Being able to easily move home whenever I want to": "Easy to move",
  "My home to increase in value as an investment": "Investment value",
  "Rent as a source of income": "Rental income",
  "Freedom from stress or exploitation (for example, debt, bills, bad landlords or exploitative management companies)": "Freedom from stress",
  "Freedom from a bad relationship": "Freedom from bad relationship",
  "None of these. My current situation is fine.": "Nothing"
}

export const LABEL_MAP: Record<string, { labels: Record<string, string>, defaultLabel?: string }> = {
  whyFairhold: { labels: WHY_FAIRHOLD_LABELS, defaultLabel: "Other;" },
  whyNotFairhold: { labels: WHY_NOT_FAIRHOLD_LABELS },
  supportDevelopmentFactors: { labels: SUPPORT_DEVELOPMENT_LABELS }
};
