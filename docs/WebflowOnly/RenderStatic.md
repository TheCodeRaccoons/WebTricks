# RenderStatic

## Version
Current Version: 1.0.0

## Description
RenderStatic is a Webflow-specific script that allows you to automatically insert cloned elements at specified intervals within a container. It's particularly useful for creating dynamic layouts where you need to repeat certain elements at regular intervals among existing content.

## Functionality
- Automatically clones and inserts elements at specified intervals
- Maintains proper spacing between original and cloned elements
- Supports multiple different cloneable elements
- Automatically handles DOM mutations and updates
- Preserves original content structure
- Smart reinitialization on content changes

## Usage
Add the script to your Webflow project and include the required attributes on your container and cloneable elements.

### Installation
```html
<script src="https://cdn.jsdelivr.net/gh/TheCodeRaccoons/WebTricks@1/Dist/WebflowOnly/RenderStatic.min.js"></script>
```

### Required Attributes
- `wt-renderstatic-element="container"` - Applied to the main container where elements will be inserted
- `wt-renderstatic-element="cloneable"` - Applied to elements that will be cloned and inserted

### Optional Attributes
- `wt-renderstatic-gap="1"` - Number of elements to skip before inserting a clone (default: 1)

## Considerations
1. **DOM Updates**: The script automatically observes container changes and reinitializes when needed
2. **Element Order**: Cloned elements are inserted at calculated positions based on the gap value
3. **Multiple Cloneables**: If multiple cloneable elements are defined, they will be used in sequence
4. **Performance**: Uses MutationObserver for efficient DOM updates
5. **Original Content**: Original elements are preserved while clones are managed dynamically

## Examples

### Basic Implementation
```html
<div class="container" wt-renderstatic-element="container">
    <div>Original Item 1</div>
    <div>Original Item 2</div>
    <div>Original Item 3</div>
    <div wt-renderstatic-element="cloneable">I will be cloned</div>
</div>
```

### With Custom Gap and Multiple Cloneables
```html
<div class="container" wt-renderstatic-element="container" wt-renderstatic-gap="2">
    <div>Original Item 1</div>
    <div>Original Item 2</div>
    <div>Original Item 3</div>
    <div>Original Item 4</div>
    <div wt-renderstatic-element="cloneable">Cloneable 1</div>
    <div wt-renderstatic-element="cloneable">Cloneable 2</div>
</div>
```