# CookieConsent

## Version
Current Version: 1.0.0

## Description
CookieConsent is a GDPR-compliant cookie consent management system that provides granular control over cookie preferences and script loading. It supports multiple consent categories, manages consent persistence, and controls script loading based on user preferences.

## Functionality
- Cookie consent banner management
- Multiple consent categories
- Granular script loading control
- Consent persistence
- Consent management interface
- Automatic script injection
- Cookie expiration handling
- Category-based script loading

## Usage
Add the script to your project and include the required attributes on your banner and script elements.

### Installation
```html
<script src="https://cdn.jsdelivr.net/gh/TheCodeRaccoons/WebTricks@1/Dist/Functional/CookieConsent.min.js"></script>
```

### Required Attributes
- `wt-cookieconsent-element="banner"` - Applied to the main cookie banner container
- `wt-cookieconsent-script="category"` - Applied to scripts that require consent

### Optional Elements and Attributes
- `wt-cookieconsent-element="accept-all"` - Accept all cookies button
- `wt-cookieconsent-element="accept-necessary"` - Accept necessary cookies only button
- `wt-cookieconsent-element="manage-cookies"` - Manage cookies settings button
- `wt-cookieconsent-element="categories-form"` - Form for custom category selection
- `wt-cookieconsent-category="category-name"` - Category checkbox inputs

## Considerations
1. **GDPR Compliance**: Supports granular consent management
2. **Script Loading**: Automatically handles script loading based on consent
3. **Persistence**: Stores consent in cookies with configurable expiry
4. **Categories**: Supports unlimited custom consent categories
5. **Performance**: Efficient script injection and management

## Examples

### Basic Implementation
```html
<!-- Cookie Banner -->
<div wt-cookieconsent-element="banner">
    <p>We use cookies to improve your experience.</p>
    <button wt-cookieconsent-element="accept-all">Accept All</button>
    <button wt-cookieconsent-element="accept-necessary">Necessary Only</button>
</div>

<!-- Scripts requiring consent -->
<script wt-cookieconsent-script="analytics" src="analytics.js"></script>
<script wt-cookieconsent-script="marketing" src="marketing.js"></script>
```

### Advanced Implementation with Categories
```html
<div wt-cookieconsent-element="banner">
    <p>Choose your cookie preferences</p>
    
    <!-- Categories Form -->
    <form wt-cookieconsent-element="categories-form">
        <label>
            <input type="checkbox" 
                   wt-cookieconsent-category="necessary" 
                   checked disabled>
            Necessary
        </label>
        
        <label>
            <input type="checkbox" 
                   wt-cookieconsent-category="analytics">
            Analytics
        </label>
        
        <label>
            <input type="checkbox" 
                   wt-cookieconsent-category="marketing">
            Marketing
        </label>
        
        <button type="submit">Save Preferences</button>
    </form>
    
    <button wt-cookieconsent-element="accept-all">Accept All</button>
</div>

<!-- Manage Cookies Button (shows banner again) -->
<button wt-cookieconsent-element="manage-cookies">
    Manage Cookie Preferences
</button>

<!-- Categorized Scripts -->
<script wt-cookieconsent-script="necessary" src="essential.js"></script>
<script wt-cookieconsent-script="analytics" src="analytics.js"></script>
<script wt-cookieconsent-script="marketing" src="marketing.js"></script>
```

### Inline Script Implementation
```html
<!-- Inline script with consent -->
<script wt-cookieconsent-script="analytics">
    // Analytics code here
    console.log('Analytics initialized');
</script>
```

### Common Use Cases
1. GDPR compliance implementation
2. Analytics script management
3. Marketing pixel control
4. A/B testing script management
5. Third-party service integration