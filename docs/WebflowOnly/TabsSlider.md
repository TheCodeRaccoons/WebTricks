# TabsSlider

## Version
Current Version: 1.0.0

## Description
TabsSlider is a Webflow-specific script that adds automatic sliding functionality to Webflow's native tab components. It enables automatic rotation between tabs with configurable timing and pause-on-hover functionality.

## Functionality
- Automatic rotation between tabs at specified intervals
- Configurable slide timing
- Pause-on-hover capability
- Safari-specific scroll fix
- Maintains focus state during transitions
- Error handling and graceful degradation

## Usage
Add the script to your Webflow project and include the required attributes on your tabs component.

### Installation
```html
<script src="https://cdn.jsdelivr.net/gh/TheCodeRaccoons/WebTricks@1/Dist/WebflowOnly/TabsSlider.min.js"></script>
```

### Required Attributes
- `wt-tabslider-element="tabs"` - Applied to the main tabs container
- `wt-tabslider-element="menu"` - Applied to the tabs menu/navigation container

### Optional Attributes
- `wt-tabslider-speed="5000"` - Set the sliding speed in milliseconds (default: 5000ms)
- `wt-tabslider-pauseonhover="true"` - Enable/disable pause on hover functionality (default: false)

## Considerations
1. **Webflow Dependency**: This script requires Webflow's native tabs component to function
2. **Browser Compatibility**: Includes special handling for Safari browsers
3. **Performance**: Uses debouncing for hover events to optimize performance
4. **Focus Management**: Maintains focus state for form elements during transitions

## Examples

### Basic Implementation
```html
<div class="tabs-component" wt-tabslider-element="tabs">
    <div class="tabs-menu" wt-tabslider-element="menu">
        <!-- Tab menu items here -->
    </div>
    <div class="tabs-content">
        <!-- Tab content here -->
    </div>
</div>
```

### With Custom Speed and Hover Pause
```html
<div class="tabs-component" 
     wt-tabslider-element="tabs"
     wt-tabslider-speed="3000"
     wt-tabslider-pauseonhover="true">
    <div class="tabs-menu" wt-tabslider-element="menu">
        <!-- Tab menu items here -->
    </div>
    <div class="tabs-content">
        <!-- Tab content here -->
    </div>
</div>
```