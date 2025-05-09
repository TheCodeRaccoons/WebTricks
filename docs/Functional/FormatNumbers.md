# FormatNumbers

## Version
Current Version: 1.0.0

## Description
FormatNumbers is a utility script that provides internationalization and formatting for numbers, supporting various formats including currency, decimals, percentages, and units. It uses the native Intl.NumberFormat API for reliable and locale-aware number formatting.

## Functionality
- International number formatting
- Currency formatting
- Percentage formatting
- Unit formatting
- Decimal formatting
- Locale-specific formatting
- Error handling
- Automatic initialization

## Usage
Add the script to your project and include the required attributes on elements containing numbers to format.

### Installation
```html
<script src="https://cdn.jsdelivr.net/gh/TheCodeRaccoons/WebTricks@1/Dist/Functional/FormatNumbers.min.js"></script>
```

### Required Attributes
- `wt-formatnumber-element="number"` - Applied to elements containing numbers to format

### Optional Attributes
- `wt-formatnumber-locales="en-US"` - Locale code for formatting
- `wt-formatnumber-style="style"` - Format style (currency, decimal, percent, unit)
- `wt-formatnumber-currency="USD"` - Currency code (required when style is currency)
- `wt-formatnumber-unit="kilometer"` - Unit type (required when style is unit)

## Considerations
1. **Number Parsing**: Handles numbers with or without commas
2. **Locale Support**: Uses browser's Intl API for localization
3. **Currency Codes**: Requires valid ISO 4217 currency codes
4. **Unit Support**: Uses standard unit types from Intl API
5. **Error Handling**: Graceful error handling with console messages

## Examples

### Basic Number Formatting
```html
<!-- Basic decimal formatting -->
<div wt-formatnumber-element="number" 
     wt-formatnumber-style="decimal"
     wt-formatnumber-locales="en-US">
    1234.56
</div>
```

### Currency Formatting
```html
<!-- Currency formatting -->
<div wt-formatnumber-element="number"
     wt-formatnumber-style="currency"
     wt-formatnumber-currency="EUR"
     wt-formatnumber-locales="de-DE">
    1234.56
</div>
```

### Percentage and Unit Formatting
```html
<!-- Percentage -->
<div wt-formatnumber-element="number"
     wt-formatnumber-style="percent"
     wt-formatnumber-locales="en-US">
    0.45
</div>

<!-- Unit -->
<div wt-formatnumber-element="number"
     wt-formatnumber-style="unit"
     wt-formatnumber-unit="kilometer"
     wt-formatnumber-locales="en-US">
    123
</div>
```

### Different Locales Example
```html
<!-- Same number, different locales -->
<div wt-formatnumber-element="number"
     wt-formatnumber-style="currency"
     wt-formatnumber-currency="USD"
     wt-formatnumber-locales="en-US">
    1234.56
</div>

<div wt-formatnumber-element="number"
     wt-formatnumber-style="currency"
     wt-formatnumber-currency="EUR"
     wt-formatnumber-locales="fr-FR">
    1234.56
</div>
```

### Common Use Cases
1. Price displays
2. Financial statistics
3. Measurement displays
4. Percentage indicators
5. Localized number formatting