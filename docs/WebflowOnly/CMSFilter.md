# CMSFilter

## Version
Current Version: 1.1.0

## Description
CMSFilter is a powerful Webflow-specific script that provides advanced filtering capabilities for CMS collections. It supports multiple filter types, pagination, sorting, dynamic filtering with real-time updates, and performance optimizations including debounced input handling.

## Functionality
- Multiple filter types (checkbox, radio, text, range)
- Advanced filtering with dynamic availability updates
- Pagination support with auto-loading across pages
- Dynamic sorting (numeric, date, alphabetical)
- Active filter tags with individual removal
- Results counter with filtering awareness
- Empty state handling
- Load more/pagination modes
- Filter clearing functionality
- IX2 interaction reset capability
- Debounced input handling for performance optimization
- Global search functionality
- Wildcard (*) category filtering
- Range filtering with from/to values
- Custom pagination controls

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
- `wt-cmsfilter-filtering="advanced"` - Enables advanced filtering mode with dynamic availability updates
- `wt-cmsfilter-trigger="button"` - Changes filter trigger to button submit instead of real-time
- `wt-cmsfilter-class="classname"` - CSS class applied to active filter elements
- `wt-cmsfilter-resetix2="true"` - Reset IX2 interactions on filtered items
- `wt-cmsfilter-debounce="300"` - Debounce delay in milliseconds for input events (default: 300ms)

#### Pagination Attributes
- `wt-cmsfilter-element="pagination-wrapper"` - Container for pagination controls (required for multi-page filtering)
- `wt-cmsfilter-loadmode="paginate|load-all"` - Controls how items are loaded and displayed
- `wt-cmsfilter-pagination="prev|next"` - Default Webflow pagination buttons
- `wt-cmsfilter-element="custom-prev|custom-next"` - Custom pagination button elements
- `wt-cmsfilter-element="page-count"` - Displays current page and total pages

#### Additional Elements
- `wt-cmsfilter-element="results-count"` - Shows the number of filtered results
- `wt-cmsfilter-element="empty"` - Element shown when no results are found
- `wt-cmsfilter-element="clear-all"` - Button to clear all active filters
- `wt-cmsfilter-element="sort-options"` - Select element for sorting options
- `wt-cmsfilter-element="tag-template"` - Template for active filter tags
- `wt-cmsfilter-element="tag-text"` - Text content within tag template
- `wt-cmsfilter-element="tag-remove"` - Remove button within tag template

#### Range Filter Attributes
- `wt-cmsfilter-range="from|to"` - Specifies range filter input type (minimum or maximum)
- `wt-cmsfilter-default="value"` - Default value for range inputs (used for comparison)

#### Tag Template Attributes
- `wt-cmsfilter-tag-category="true|false"` - Whether to show category name in tags (default: true)

## Considerations
1. **Initialization**: Automatically initializes when DOM is ready
2. **Performance**: Optimized for large collections with pagination and debounced inputs
3. **Compatibility**: Works with Webflow's native CMS and IX2
4. **Data Attributes**: Uses data attributes for filtering values
5. **Error Handling**: Graceful degradation with error logging
6. **Multi-page Loading**: Automatically loads all CMS pages when pagination wrapper is present
7. **Range Filtering**: Supports numerical range filters with min/max values
8. **Global Search**: Use category "*" for search across all data attributes
9. **Tag Management**: Individual tag removal with automatic filter updates
10. **IX2 Reset**: Optionally reset Webflow interactions after filtering

## Examples

### Basic Filter Implementation
```html
<form wt-cmsfilter-element="filter-form" wt-cmsfilter-debounce="250">
    <!-- Checkbox filters -->
    <label wt-cmsfilter-category="category">
        <input type="checkbox">
        <span>Category 1</span>
    </label>
    
    <!-- Text search -->
    <input type="text" wt-cmsfilter-category="search" placeholder="Search...">
    
    <!-- Global search across all data attributes -->
    <input type="text" wt-cmsfilter-category="*" placeholder="Search everything...">
    
    <!-- Results counter -->
    <div wt-cmsfilter-element="results-count"></div>
    
    <!-- Clear all filters -->
    <button wt-cmsfilter-element="clear-all">Clear All</button>
    
    <!-- Results list -->
    <div wt-cmsfilter-element="list">
        <!-- CMS items here -->
    </div>
    
    <!-- Empty state -->
    <div wt-cmsfilter-element="empty" style="display: none;">
        No results found.
    </div>
</form>
```

### Advanced Implementation with Pagination and Tags
```html
<form wt-cmsfilter-element="filter-form" 
      wt-cmsfilter-filtering="advanced"
      wt-cmsfilter-debounce="300"
      wt-cmsfilter-class="active-filter">
    
    <!-- Range filter -->
    <div>
        <label>Price Range:</label>
        <input type="text" 
               wt-cmsfilter-category="price" 
               wt-cmsfilter-range="from"
               wt-cmsfilter-default="0"
               placeholder="Min">
        <input type="text" 
               wt-cmsfilter-category="price" 
               wt-cmsfilter-range="to"
               wt-cmsfilter-default="1000"
               placeholder="Max">
    </div>

    <!-- Sort options -->
    <select wt-cmsfilter-element="sort-options">
        <option value="">Sort by...</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name-asc">Name: A to Z</option>
        <option value="date-desc">Newest First</option>
    </select>

    <!-- Active filter tags container -->
    <div>
        <h4>Active Filters:</h4>
        <!-- Tag template (hidden by default) -->
        <div wt-cmsfilter-element="tag-template" 
             wt-cmsfilter-tag-category="true"
             style="display: none;">
            <span wt-cmsfilter-element="tag-text"></span>
            <button wt-cmsfilter-element="tag-remove" type="button">×</button>
        </div>
    </div>

    <!-- Results info -->
    <div>
        Showing <span wt-cmsfilter-element="results-count"></span> results
    </div>

    <!-- Results list -->
    <div wt-cmsfilter-element="list" 
         wt-cmsfilter-loadmode="paginate"
         wt-cmsfilter-resetix2="true">
        <!-- CMS items here with data attributes for filtering -->
        <!-- Example item:
        <div data-category="electronics" data-price="299" data-name="Laptop">
            Content...
        </div>
        -->
    </div>

    <!-- Empty state -->
    <div wt-cmsfilter-element="empty" style="display: none;">
        <h3>No results found</h3>
        <p>Try adjusting your filters or search terms.</p>
    </div>

    <!-- Pagination controls -->
    <div wt-cmsfilter-element="pagination-wrapper">
        <button wt-cmsfilter-element="custom-prev" type="button">Previous</button>
        <span wt-cmsfilter-element="page-count">1 / 1</span>
        <button wt-cmsfilter-element="custom-next" type="button">Next</button>
    </div>
</form>
```

### Button-Triggered Filtering
```html
<form wt-cmsfilter-element="filter-form" wt-cmsfilter-trigger="button">
    <!-- Filters -->
    <input type="text" wt-cmsfilter-category="search" placeholder="Search...">
    
    <label wt-cmsfilter-category="type">
        <input type="checkbox">
        <span>Type A</span>
    </label>
    
    <!-- Submit button -->
    <button type="submit">Apply Filters</button>
    
    <!-- Results -->
    <div wt-cmsfilter-element="list">
        <!-- CMS items here -->
    </div>
</form>
```

### Common Use Cases
1. E-commerce product filtering with price ranges and categories
2. Blog post categorization with tags and search
3. Portfolio filtering by project type and skills
4. Real estate listing filters with price, location, and features
5. Event calendar filtering by date, category, and location
6. Team member directory with department and skill filters
7. Recipe collection with ingredient and cuisine filters
8. Job board with location, salary, and category filters

### Performance Tips
- Use debouncing for text inputs in large collections (adjust `wt-cmsfilter-debounce` value)
- Enable pagination for collections with 50+ items
- Use advanced filtering mode only when needed for better performance
- Implement IX2 reset (`wt-cmsfilter-resetix2="true"`) sparingly as it impacts performance
- Consider using button-triggered filtering for complex filter sets

### Data Attribute Requirements
Your CMS items should include data attributes that match your filter categories. For example:
```html
<div class="cms-item" data-category="electronics" data-price="299" data-brand="apple">
    <!-- Item content -->
</div>
```

### JavaScript API
Access the filter instance globally:
```javascript
// Get the filter instance
const filterInstance = window.webtricks.find(item => item.CMSFilter)?.CMSFilter;

// Get current filter data
const filterData = filterInstance.GetFilterData();

// Apply filters programmatically
filterInstance.ApplyFilters();

// Clear all filters
filterInstance.ClearAllFilters();
```