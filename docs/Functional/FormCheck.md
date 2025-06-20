# FormCheck

## Version
Current Version: 1.0.0

## Description
FormCheck is a comprehensive form validation script that provides real-time validation for form inputs with customizable error handling and submission behavior. It supports various input types including text, email, phone, number, and checkboxes.

## Functionality
- Real-time input validation
- Custom error messages
- Email format validation
- Phone number format validation
- Required field checking
- Custom error styling
- Form reset capability
- Custom submission handling
- Success message display

## Usage
Add the script to your project and include the required attributes on your form and form elements.

### Installation
```html
<script src="https://cdn.jsdelivr.net/gh/TheCodeRaccoons/WebTricks@1/Dist/Functional/FormCheck.min.js"></script>
```

### Required Attributes
- `wt-formcheck-element="form"` - Applied to the form element
- `wt-formcheck-type="submit"` - Applied to the submit button
- `wt-formcheck-type="required"` - Applied to required input fields
- `wt-formcheck-type="error"` - Applied to error message elements

### Optional Attributes
- `wt-formcheck-class="error-class"` - Custom error class for styling
- `wt-formcheck-message="Success!"` - Custom success message
- `wt-formcheck-element="default-submit"` - Default submit button (for CMS forms)
- `wt-formcheck-element="reset"` - Form reset button

## Considerations
1. **Error Display**: Error messages are hidden by default and shown on validation failure
2. **Input Types**: Supports text, email, phone, number, and checkbox inputs
3. **Real-time Validation**: Clears errors on input change or blur
4. **Form Reset**: Optional reset functionality
5. **CMS Integration**: Supports Webflow CMS form submission

## Examples

### Basic Implementation
```html
<form wt-formcheck-element="form" wt-formcheck-class="error">
    <!-- Text input with error message -->
    <div class="form-group">
        <input type="text" wt-formcheck-type="required">
        <div wt-formcheck-type="error">This field is required</div>
    </div>

    <!-- Email input with error message -->
    <div class="form-group">
        <input type="email" wt-formcheck-type="required">
        <div wt-formcheck-type="error">Please enter a valid email</div>
    </div>

    <!-- Submit button -->
    <button wt-formcheck-type="submit">Submit</button>
</form>
```

### Advanced Implementation
```html
<form wt-formcheck-element="form" 
      wt-formcheck-class="error-state"
      wt-formcheck-message="Sending...">
    
    <!-- Phone input -->
    <div class="form-group">
        <input type="tel" wt-formcheck-type="required">
        <div wt-formcheck-type="error">Enter a valid phone number</div>
    </div>

    <!-- Checkbox -->
    <div class="form-group">
        <input type="checkbox" wt-formcheck-type="required">
        <div wt-formcheck-type="error">Please accept the terms</div>
    </div>

    <!-- Buttons -->
    <button wt-formcheck-type="submit">Submit</button>
    <button wt-formcheck-element="reset">Reset</button>
</form>
```

### CSS Styling Example
```css
/* Error state styling */
.error-state {
    border-color: red;
}

/* Error message styling */
[wt-formcheck-type="error"] {
    color: red;
    font-size: 12px;
    margin-top: 5px;
}
```

### Common Use Cases
1. Contact forms
2. Registration forms
3. Newsletter signup
4. Booking forms
5. Survey forms