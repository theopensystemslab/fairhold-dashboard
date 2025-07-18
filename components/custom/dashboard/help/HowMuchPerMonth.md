### Freehold
Monthly mortgage payments are calculated using the parameters displayed in the form: {{DEFAULT_INTEREST_RATE}}% interest rate, {{DEFAULT_MORTGAGE_TERM}} year mortgage term and {{DEFAULT_INITIAL_DEPOSIT}}% initial deposit. 

### Private Rent
Rental market data from October 2021-2022 comes from the [ONS](https://www.ons.gov.uk/peoplepopulationandcommunity/housing/datasets/privaterentalmarketsummarystatisticsinengland). Mean data for all categories (Table 2.7) is used.

### Fairhold - Land Purchase
The same mortgage parameters as freehold purchase are used. 

Instead of average market price, the total combined value is the home (treated as a consumer durable) and land (market price discounted with the Fairhold formula).

### Fairhold - Land Rent
Mortgage payments for the house (treated as a consumer durable) and the community ground rent comprise the monthly cost. This ground rent discounts private rent land costs using the Fairhold formula. 

### Social Rent
This value comes from the [national social rent formula](https://www.gov.uk/government/publications/direction-on-the-rent-standard-from-1-april-2020/policy-statement-on-rents-for-social-housing#chapter-2-social-rent). 

___

_For more detailed documentation, please see the [Fairhold calculator wiki](https://github.com/theopensystemslab/fairhold-dashboard/wiki)._