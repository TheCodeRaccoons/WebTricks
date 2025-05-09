# ReadTime

## Version
Current Version: 1.0.0

## Description
ReadTime is a script that calculates and displays estimated reading time for articles or text content. It uses configurable words-per-minute rates and supports custom suffix formatting for the time display.

## Functionality
- Automatic reading time calculation
- Configurable words per minute rate
- Custom suffix support
- Multiple display locations
- Special handling for short content
- Automatic initialization

## Usage
Add the script to your project and include the required attributes on your article container and display elements.

### Installation
```html
<script src="https://cdn.jsdelivr.net/gh/TheCodeRaccoons/WebTricks@1/Dist/Functional/ReadTime.min.js"></script>
```

### Required Attributes
- `wt-readtime-element="article"` - Applied to the container with the text content
- `wt-readtime-element="display"` - Applied to elements that will display the reading time

### Optional Attributes
- `wt-readtime-words="225"` - Set custom words per minute (default: 225)
- `wt-readtime-suffix="min read"` - Custom suffix for reading time
- `wt-readtime-smallsuffix="Quick read"` - Custom text for content under 1 minute

## Considerations
1. **Word Count**: Uses space-based word counting
2. **Display Format**: 
   - Under 1 minute: Shows "less than a minute" or custom smallsuffix
   - 1 minute: Shows "a minute"
   - Over 1 minute: Shows "X minutes" or custom suffix
3. **Multiple Displays**: Supports multiple display locations for the same article
4. **Performance**: Lightweight calculation with minimal overhead
5. **Initialization**: Automatically initializes when DOM is ready

## Examples

### Basic Implementation
```html
<article wt-readtime-element="article">
    <!-- Article content here -->
</article>
<div wt-readtime-element="display">
    <!-- Reading time will appear here -->
</div>
```

### Custom Configuration
```html
<article 
    wt-readtime-element="article"
    wt-readtime-words="200"
    wt-readtime-suffix="minute read"
    wt-readtime-smallsuffix="Quick read">
    <!-- Article content here -->
</article>

<!-- Multiple display locations -->
<div wt-readtime-element="display">
    <!-- Reading time in header -->
</div>
<div wt-readtime-element="display">
    <!-- Reading time in sidebar -->
</div>
```

### Common Use Cases
1. Blog post reading time estimates
2. Article length indicators
3. Content engagement metrics
4. User experience enhancement
5. Content planning and organization