# DateCountDown

## Version
Current Version: 1.0.0 (Experimental)

## Description
DateCountDown is a countdown timer script that displays the time remaining until a target date. It supports separate displays for years, months, days, hours, minutes, and seconds, with automatic updates every second.

## Functionality
- Countdown to target date
- Separate time unit displays
- Real-time updates
- Date validation
- Automatic expiration handling
- Flexible display options
- Time unit separation

## Usage
Add the script to your project and include the required attributes on your countdown elements.

### Installation
```html
<script src="https://cdn.jsdelivr.net/gh/TheCodeRaccoons/WebTricks@1/Dist/Functional/Experimental/DateCountDown.min.js"></script>
```

### Required Attributes
- `wt-datecount-element="target-date"` - Applied to element containing the target date

### Optional Elements
- `wt-datecount-element="target-year"` - Display years remaining
- `wt-datecount-element="target-month"` - Display months remaining
- `wt-datecount-element="target-day"` - Display days remaining
- `wt-datecount-element="target-hour"` - Display hours remaining
- `wt-datecount-element="target-minute"` - Display minutes remaining
- `wt-datecount-element="target-second"` - Display seconds remaining

## Considerations
1. **Date Format**: Uses standard JavaScript Date parsing
2. **Performance**: Updates every second using setInterval
3. **Validation**: Includes date validation to prevent errors
4. **Time Units**: Each time unit can be displayed independently
5. **Expiration**: Handles countdown completion automatically

## Examples

### Basic Implementation
```html
<!-- Target date -->
<div wt-datecount-element="target-date">2025-12-31</div>

<!-- Display elements -->
<div wt-datecount-element="target-day"></div>
<div wt-datecount-element="target-hour"></div>
<div wt-datecount-element="target-minute"></div>
<div wt-datecount-element="target-second"></div>
```

### Full Implementation
```html
<div class="countdown-wrapper">
    <!-- Target date -->
    <div wt-datecount-element="target-date">2025-12-31T23:59:59</div>
    
    <!-- Years -->
    <div class="countdown-unit">
        <span wt-datecount-element="target-year"></span>
        <label>Years</label>
    </div>
    
    <!-- Months -->
    <div class="countdown-unit">
        <span wt-datecount-element="target-month"></span>
        <label>Months</label>
    </div>
    
    <!-- Days -->
    <div class="countdown-unit">
        <span wt-datecount-element="target-day"></span>
        <label>Days</label>
    </div>
    
    <!-- Hours -->
    <div class="countdown-unit">
        <span wt-datecount-element="target-hour"></span>
        <label>Hours</label>
    </div>
    
    <!-- Minutes -->
    <div class="countdown-unit">
        <span wt-datecount-element="target-minute"></span>
        <label>Minutes</label>
    </div>
    
    <!-- Seconds -->
    <div class="countdown-unit">
        <span wt-datecount-element="target-second"></span>
        <label>Seconds</label>
    </div>
</div>
```

### CSS Styling Example
```css
.countdown-unit {
    text-align: center;
    margin: 0 10px;
}

.countdown-unit span {
    display: block;
    font-size: 2em;
    font-weight: bold;
}

.countdown-unit label {
    font-size: 0.8em;
    text-transform: uppercase;
}
```

### Common Use Cases
1. Event countdown timers
2. Launch date countdowns
3. Sale end time displays
4. Competition deadlines
5. Holiday countdown displays

### Best Practices
1. Always validate the target date
2. Consider timezone differences
3. Use clear labels for time units
4. Provide fallback content for expired dates
5. Consider mobile display layouts