# RangeSlider

## Version
Current Version: 1.1.0

## Description
RangeSlider is a highly customizable dual-handle range slider component that allows users to select value ranges. It provides real-time visual updates, form integration, and supports custom styling including SVG/image thumbnails.

## Functionality
- Dual handles for range selection
- Real-time value updates
- Form input integration
- Custom display elements
- Customizable thumbs with SVG/image support
- Mutation observer for programmatic changes
- Configurable min/max values and step size
- Constraint handling between handles
- Mobile-friendly interaction

## Usage
Add the script to your project and include the required attributes and elements structure.

### Installation
```html
<script src="https://cdn.jsdelivr.net/gh/TheCodeRaccoons/WebTricks@1/Dist/Functional/RangeSlider.min.js"></script>
```

### Required Attributes
- `wt-rangeslider-element="slider-wrapper"` - Container element
- `wt-rangeslider-element="slider"` - Main slider element
- `wt-rangeslider-element="input-left"` - Left range input
- `wt-rangeslider-element="input-right"` - Right range input
- `wt-rangeslider-element="thumb-left"` - Left thumb element
- `wt-rangeslider-element="thumb-right"` - Right thumb element
- `wt-rangeslider-element="range"` - Range indicator element

### Optional Attributes
- `wt-rangeslider-min="0"` - Minimum value (default: 0)
- `wt-rangeslider-max="100"` - Maximum value (default: 100)
- `wt-rangeslider-steps="1"` - Step size (default: 1)

### Optional Elements
- `wt-rangeslider-range="from"` - Form input for start value
- `wt-rangeslider-range="to"` - Form input for end value
- `wt-rangeslider-display="from"` - Display element for start value
- `wt-rangeslider-display="to"` - Display element for end value

## Considerations
1. **Form Integration**: Automatically updates connected form inputs
2. **Value Constraints**: Ensures left value never exceeds right value
3. **Visual Updates**: Real-time updates of all connected elements
4. **Mobile Support**: Touch-friendly interaction
5. **Customization**: Supports custom styling and thumb elements

## Examples

### Basic Implementation
```html
<div wt-rangeslider-element="slider-wrapper">
    <!-- Display Elements -->
    <div wt-rangeslider-display="from">0</div>
    <div wt-rangeslider-display="to">100</div>
    
    <!-- Form Inputs -->
    <input wt-rangeslider-range="from" type="text">
    <input wt-rangeslider-range="to" type="text">
    
    <!-- Slider Structure -->
    <div wt-rangeslider-element="slider"
         wt-rangeslider-min="0"
         wt-rangeslider-max="100"
         wt-rangeslider-steps="1">
        <div wt-rangeslider-element="range"></div>
        <div wt-rangeslider-element="thumb-left"></div>
        <div wt-rangeslider-element="thumb-right"></div>
        <input type="range" wt-rangeslider-element="input-left">
        <input type="range" wt-rangeslider-element="input-right">
    </div>
</div>
```

### Custom Thumb Implementation
```html
<div wt-rangeslider-element="slider-wrapper">
    <div wt-rangeslider-element="slider">
        <div wt-rangeslider-element="range"></div>
        <div wt-rangeslider-element="thumb-left">
            <svg width="20" height="20">
                <circle cx="10" cy="10" r="8" fill="white" stroke="black"/>
            </svg>
        </div>
        <div wt-rangeslider-element="thumb-right">
            <svg width="20" height="20">
                <circle cx="10" cy="10" r="8" fill="white" stroke="black"/>
            </svg>
        </div>
        <input type="range" wt-rangeslider-element="input-left">
        <input type="range" wt-rangeslider-element="input-right">
    </div>
</div>
```

### Common Use Cases
1. Price range selectors
2. Date range pickers
3. Filter interfaces
4. Numerical range inputs
5. Custom range controls