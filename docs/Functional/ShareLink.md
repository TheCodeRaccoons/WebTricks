# ShareLink

## Version
Current Version: 1.0.0

## Description
ShareLink is a lightweight script that enables easy social media sharing functionality. It automatically generates sharing URLs for various social media platforms and handles the sharing process through their respective APIs.

## Functionality
- Supports multiple social media platforms
- Automatic URL encoding
- Title and description handling
- Copy to clipboard functionality
- Open in new tab behavior
- Error handling for unsupported platforms

## Usage
Add the script to your project and include the required attributes on your sharing elements.

### Installation
```html
<script src="https://cdn.jsdelivr.net/gh/TheCodeRaccoons/WebTricks@1/Dist/Functional/ShareLink.min.js"></script>
```

### Required Attributes
- `wt-share-element="platform"` - Applied to the sharing link/button, where platform is one of:
  - `facebook`
  - `twitter`
  - `linkedin`
  - `whatsapp`
  - `pinterest`
  - `reddit`
  - `copy` (for copy to clipboard functionality)

## Considerations
1. **URL Encoding**: Automatically handles URL encoding for special characters
2. **Meta Data**: Uses document title for sharing descriptions
3. **Multiple Instances**: Supports multiple share buttons on the same page
4. **Error Handling**: Gracefully handles unsupported platforms
5. **Performance**: Lightweight with minimal overhead

## Examples

### Basic Implementation
```html
<!-- Facebook share button -->
<a wt-share-element="facebook">Share on Facebook</a>

<!-- Twitter share button -->
<a wt-share-element="twitter">Share on Twitter</a>

<!-- Copy link button -->
<button wt-share-element="copy">Copy Link</button>
```

### Complete Social Media Implementation
```html
<div class="social-share">
    <a wt-share-element="facebook">Facebook</a>
    <a wt-share-element="twitter">Twitter</a>
    <a wt-share-element="linkedin">LinkedIn</a>
    <a wt-share-element="whatsapp">WhatsApp</a>
    <a wt-share-element="pinterest">Pinterest</a>
    <a wt-share-element="reddit">Reddit</a>
    <button wt-share-element="copy">Copy Link</button>
</div>
```

### Common Use Cases
1. Blog post sharing
2. Product sharing on e-commerce sites
3. Social media integration
4. Content distribution
5. Portfolio sharing