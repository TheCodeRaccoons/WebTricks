# CountUp

## Version
Current Version: 1.0.0

## Description
CountUp is a lightweight animation script that creates counting animations from zero to a target number. It supports customizable counting speed, step size, and allows adding prefix and suffix text to the displayed number.

## Functionality
- Animated number counting
- Configurable target number
- Adjustable animation speed
- Custom step size
- Prefix and suffix support
- Automatic initialization
- Error handling

## Usage
Add the script to your project and include the required attributes on your counter elements.

### Installation
```html
<script src="https://cdn.jsdelivr.net/gh/TheCodeRaccoons/WebTricks@1/Dist/Functional/CountUp.min.js"></script>
```

### Required Attributes
- `wt-countup-element="counter"` - Applied to the element that will display the counting animation
- `wt-countup-target="100"` - The target number to count up to

### Optional Attributes
- `wt-countup-prefix="$"` - Text to display before the number
- `wt-countup-suffix="+"` - Text to display after the number
- `wt-countup-step="5"` - Number to increment by (default: 1)
- `wt-countup-speed="10"` - Animation speed in milliseconds (default: 10)

## Considerations
1. **Performance**: Uses setInterval for animation timing
2. **Memory Management**: Automatically clears interval when target is reached
3. **Error Handling**: Gracefully handles initialization errors
4. **Format Support**: Numbers only (use FormatNumbers.js for formatted output)
5. **Animation Speed**: Lower speed values create faster animations

## Examples

### Basic Implementation
```html
<div wt-countup-element="counter" 
     wt-countup-target="100">
    0
</div>
```

### Advanced Implementation
```html
<div wt-countup-element="counter"
     wt-countup-target="1000"
     wt-countup-prefix="$"
     wt-countup-suffix=".00"
     wt-countup-step="10"
     wt-countup-speed="20">
    0
</div>
```

### Multiple Counters
```html
<!-- Basic counter -->
<div wt-countup-element="counter" 
     wt-countup-target="500">
    0
</div>

<!-- Percentage counter -->
<div wt-countup-element="counter"
     wt-countup-target="100"
     wt-countup-suffix="%"
     wt-countup-speed="50">
    0
</div>

<!-- Currency counter -->
<div wt-countup-element="counter"
     wt-countup-target="999"
     wt-countup-prefix="$"
     wt-countup-step="3">
    0
</div>
```

### Common Use Cases
1. Statistics displays
2. Progress indicators
3. Achievement counters
4. Price animations
5. Loading indicators