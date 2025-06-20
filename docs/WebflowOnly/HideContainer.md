# HideContainer

## Version
Current Version: 1.0.0

## Description
HideContainer is a Webflow-specific script that manages container visibility based on empty states. It's particularly useful for handling CMS collections or dynamic content containers where you want to hide or remove the container when specific conditions are met.

## Functionality
- Automatically hides or removes containers based on empty states
- Supports both hiding and complete removal of containers
- Simple configuration through HTML attributes
- Automatic initialization on page load
- Lightweight and efficient

## Usage
Add the script to your Webflow project and include the required attributes on your container elements.

### Installation
```html
<script src="https://cdn.jsdelivr.net/gh/TheCodeRaccoons/WebTricks@1/Dist/WebflowOnly/HideContainer.min.js"></script>
```

### Required Attributes
- `wt-hidecontainer-element="container"` - Applied to the main container that might need hiding
- `wt-hidecontainer-element="empty"` - Applied to the element that indicates an empty state

### Optional Attributes
- `wt-hidecontainer-remove="true"` - If present, the container will be removed from DOM instead of being hidden

## Considerations
1. **Display Handling**: By default, containers are hidden using `display: none`
2. **DOM Removal**: When using the remove attribute, the container is completely removed from the DOM
3. **Empty State Detection**: Relies on the presence of an element with the empty state attribute
4. **Performance**: Minimal impact on page load and performance
5. **CMS Integration**: Particularly useful with Webflow CMS collections

## Examples

### Basic Implementation (Hide Container)
```html
<div wt-hidecontainer-element="container">
    <div class="content">
        <!-- Content here -->
    </div>
    <div wt-hidecontainer-element="empty">No items found</div>
</div>
```

### Implementation with Container Removal
```html
<div wt-hidecontainer-element="container" wt-hidecontainer-remove="true">
    <div class="content">
        <!-- Content here -->
    </div>
    <div wt-hidecontainer-element="empty">No items found</div>
</div>
```

### Common Use Cases
1. Hiding empty CMS collection lists
2. Managing visibility of dynamic content containers
3. Handling no-results states in search functionality
4. Conditional content display
5. Empty state management in filtered content