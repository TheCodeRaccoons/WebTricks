# CMSSelect

## Version
Current Version: 1.0.0

## Description
CMSSelect is a Webflow-specific script that automatically populates select elements with options from CMS content. It's particularly useful for creating dynamic dropdowns from CMS collection items or when you need to convert CMS content into selectable options.

## Functionality
- Automatically populates select elements with options from CMS content
- Supports multiple select elements on the same page
- Handles custom values and text content
- Error handling and validation
- Automatic initialization on page load

## Usage
Add the script to your Webflow project and include the required attributes on your select element and option sources.

### Installation
```html
<script src="https://cdn.jsdelivr.net/gh/TheCodeRaccoons/WebTricks@1/Dist/WebflowOnly/CMSSelect.min.js"></script>
```

### Required Attributes
For a single select:
- `wt-cmsselect-element="select"` - Applied to the select element
- `wt-cmsselect-element="target"` - Applied to elements that will become options

For multiple selects:
- `wt-cmsselect-element="select-1"` - Applied to the first select element
- `wt-cmsselect-element="target-1"` - Applied to options for the first select
- `wt-cmsselect-element="select-2"` - Applied to the second select element
- `wt-cmsselect-element="target-2"` - Applied to options for the second select

### Optional Attributes
- `wt-cmsselect-value="custom-value"` - Custom value for the option (if different from text content)

## Considerations
1. **Empty Values**: Options with empty text content are ignored
2. **Value Handling**: Uses text content as value if no custom value is provided
3. **Multiple Instances**: Supports multiple independent select elements
4. **Error Handling**: Gracefully handles missing or invalid targets
5. **CMS Integration**: Works with any CMS collection item or static content

## Examples

### Basic Implementation
```html
<select wt-cmsselect-element="select">
    <!-- Will be populated automatically -->
</select>

<!-- Source elements (e.g., from CMS collection) -->
<div wt-cmsselect-element="target">Option 1</div>
<div wt-cmsselect-element="target">Option 2</div>
<div wt-cmsselect-element="target">Option 3</div>
```

### Multiple Selects Implementation
```html
<!-- First select -->
<select wt-cmsselect-element="select-1"></select>
<div wt-cmsselect-element="target-1">Option A</div>
<div wt-cmsselect-element="target-1">Option B</div>

<!-- Second select -->
<select wt-cmsselect-element="select-2"></select>
<div wt-cmsselect-element="target-2">Option X</div>
<div wt-cmsselect-element="target-2">Option Y</div>
```

### Custom Values Implementation
```html
<select wt-cmsselect-element="select"></select>

<div wt-cmsselect-element="target" wt-cmsselect-value="value-1">Display Text 1</div>
<div wt-cmsselect-element="target" wt-cmsselect-value="value-2">Display Text 2</div>
```

### Common Use Cases
1. Creating dropdowns from CMS collections
2. Dynamic filtering interfaces
3. Form select population
4. Category selection
5. Dynamic navigation menus