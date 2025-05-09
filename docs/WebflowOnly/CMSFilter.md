# CMSFilter

## Version
Current Version: 1.0.0

## Description
CMSFilter is a powerful Webflow-specific script that provides advanced filtering capabilities for CMS collections. It supports multiple filter types, pagination, sorting, and dynamic filtering with real-time updates.

## Functionality
- Multiple filter types (checkbox, radio, text, range)
- Advanced filtering options
- Pagination support
- Dynamic sorting
- Active filter tags
- Results counter
- Empty state handling
- Load more/pagination modes
- Filter clearing
- Interaction reset capability

## Usage
Add the script to your Webflow project and include the required attributes on your filtering elements.

### Installation
```html
<script src="https://cdn.jsdelivr.net/gh/TheCodeRaccoons/WebTricks@1/Dist/WebflowOnly/CMSFilter.min.js"></script>
```

### Required Attributes
- `wt-cmsfilter-element="filter-form"` - Applied to the form container
- `wt-cmsfilter-element="list"` - Applied to the CMS list container
- `wt-cmsfilter-category="category-name"` - Applied to filter inputs

### Optional Attributes
#### Core Filter Attributes
- `wt-cmsfilter-filtering="advanced"` - Enables advanced filtering mode
- `wt-cmsfilter-trigger="button"` - Changes filter trigger to button submit
- `wt-cmsfilter-class="classname"` - Active filter class name
- `wt-cmsfilter-resetix2="true"` - Reset IX2 interactions on filter

#### Pagination Attributes
- `wt-cmsfilter-element="pagination-wrapper"` - Pagination container
- `wt-cmsfilter-loadmode="paginate|load-all"` - Load mode selection
- `wt-cmsfilter-pagination="prev|next"` - Pagination controls
- `wt-cmsfilter-element="custom-prev|custom-next"` - Custom pagination controls
- `wt-cmsfilter-element="page-count"` - Page counter element

#### Additional Elements
- `wt-cmsfilter-element="results-count"` - Results counter
- `wt-cmsfilter-element="empty"` - Empty state element
- `wt-cmsfilter-element="clear-all"` - Clear filters button
- `wt-cmsfilter-element="sort-options"` - Sort options select
- `wt-cmsfilter-element="tag-template"` - Active filter tag template

#### Range Filter Attributes
- `wt-cmsfilter-range="from|to"` - Range filter inputs
- `wt-cmsfilter-default="value"` - Default value for range inputs

## Considerations
1. **Initialization**: Automatically initializes when DOM is ready
2. **Performance**: Optimized for large collections with pagination
3. **Compatibility**: Works with Webflow's native CMS and IX2
4. **Data Attributes**: Uses data attributes for filtering values
5. **Error Handling**: Graceful degradation with error logging

## Examples

### Basic Filter Implementation
```html
<form wt-cmsfilter-element="filter-form">
    <!-- Checkbox filters -->
    <label wt-cmsfilter-category="category">
        <input type="checkbox">
        <span>Category 1</span>
    </label>
    
    <!-- Text search -->
    <input type="text" wt-cmsfilter-category="search">
    
    <!-- Results list -->
    <div wt-cmsfilter-element="list">
        <!-- CMS items here -->
    </div>
</form>
```

### Advanced Implementation with Pagination
```html
<form wt-cmsfilter-element="filter-form" wt-cmsfilter-filtering="advanced">
    <!-- Range filter -->
    <div>
        <input type="text" 
               wt-cmsfilter-category="price" 
               wt-cmsfilter-range="from"
               wt-cmsfilter-default="0">
        <input type="text" 
               wt-cmsfilter-category="price" 
               wt-cmsfilter-range="to"
               wt-cmsfilter-default="1000">
    </div>

    <!-- Sort options -->
    <select wt-cmsfilter-element="sort-options">
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
    </select>

    <!-- Active filters -->
    <div wt-cmsfilter-element="tag-template">
        <span wt-cmsfilter-element="tag-text"></span>
        <button wt-cmsfilter-element="tag-remove">×</button>
    </div>

    <!-- Results -->
    <div wt-cmsfilter-element="list" wt-cmsfilter-loadmode="paginate">
        <!-- CMS items here -->
    </div>

    <!-- Pagination -->
    <div wt-cmsfilter-element="pagination-wrapper">
        <button wt-cmsfilter-pagination="prev">Previous</button>
        <span wt-cmsfilter-element="page-count"></span>
        <button wt-cmsfilter-pagination="next">Next</button>
    </div>
</form>
```

### Common Use Cases
1. E-commerce product filtering
2. Blog post categorization
3. Portfolio filtering
4. Real estate listing filters
5. Event calendar filtering