
'use strict';

class CMSFilter {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 0;
        this.filterForm = document.querySelector('[wt-cmsfilter-element="filter-form"]');
        this.listElement = document.querySelector('[wt-cmsfilter-element="list"]');
        this.tagTemplate = document.querySelector('[wt-cmsfilter-element="tag-template"]');
        this.tagTemplateContainer = (this.tagTemplate) ? this.tagTemplate.parentElement : null;
        this.emptyElement = document.querySelector('[wt-cmsfilter-element="empty"]');
        this.paginationElements = document.querySelectorAll('[wt-cmsfilter-pagination]');
        this.filterElements = this.filterForm.querySelectorAll('[wt-cmsfilter-category]');
        this.allItems = [];
        this.filteredItems = [];
        this.totalPages = 1;
        this.activeFilterClass = this.filterForm.getAttribute('wt-cmsfilter-class');
        this.activeFilters = {};
        this.availableFilters = {};
        this.resultCount = document.querySelector('[wt-cmsfilter-element="results-count"]');
        this.clearAll = document.querySelector('[wt-cmsfilter-element="clear-all"]');
        this.sortOptions = document.querySelector('[wt-cmsfilter-element="sort-options"]');
        this.init();
    }

    async init() {
        if (this.loadAll) {
            await this.LoadAllItems();
        } else {
            this.allItems = Array.from(this.listElement.children);
            this.itemsPerPage = this.allItems.length;
        }
        this.allItems = Array.from(this.listElement.children);
        this.itemsPerPage = this.allItems.length;
        this.SetupPagination();
        this.SetupEventListeners();
        this.LoadItems();
        this.UpdateAvailableFilters();
        this.activeFilters = this.GetFilters();
        this.ShowResultCount();
        this.InitializeTagTemplate();
    }

    SetupEventListeners() {
        if(this.filterForm.hasAttribute('wt-cmsfilter-trigger')){ 
            if (this.filterForm.getAttribute('wt-cmsfilter-trigger') === 'button') {
                this.filterForm.addEventListener('submit', (event) => {
                    event.preventDefault();
                    this.ApplyFilters();
                });
            } else {
                this.filterForm.addEventListener('change', () => {
                    this.ApplyFilters();
                });
                this.filterForm.addEventListener('input', () => {
                    this.ApplyFilters();
                });
            }
        } else {
            this.filterForm.addEventListener('change', () => {
                this.ApplyFilters();
            });
            this.filterForm.addEventListener('input', () => {
                this.ApplyFilters();
            });
        }

        if(!this.paginationElements) return;
        this.paginationElements.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const direction = button.getAttribute('wt-cmsfilter-pagination');
                if (direction === 'next') this.NextPage();
                if (direction === 'prev') this.PrevPage();
            });
        });

        if(this.clearAll) {
            this.clearAll.addEventListener('click', (event) => {
                event.preventDefault();
                this.ClearAllFilters();
            });
        }
        if (this.sortOptions) {
            this.sortOptions.addEventListener('change', (event) => {
                event.preventDefault();
                this.ApplyFilters();
            });
        }
    }

    async LoadAllItems() {
        const paginationWrapper = this.listElement.closest('.w-pagination-wrapper');
        if (!paginationWrapper) return;

        const links = Array.from(paginationWrapper.querySelectorAll('a'));
        if (!links || links.length === 0) return;

        for (const link of links) {
            try {
                const htmlDoc = await this.FetchHTML(link.href);
                if (htmlDoc) {
                    const cards = htmlDoc.querySelectorAll('.w-dyn-item');
                    cards.forEach(card => {
                        this.listElement.appendChild(card.cloneNode(true));
                        this.allItems.push(card);
                    });
                } else {
                    console.log('Failed to fetch HTML from the URL:', link.href);
                }
            } catch (error) {
                console.error('Error fetching HTML:', error);
            }
        }

        this.itemsPerPage = this.allItems.length;
        paginationWrapper.remove();
    }

    async FetchHTML(url) {
        const response = await fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
        const text = await response.text();
        const parser = new DOMParser();
        return parser.parseFromString(text, 'text/html');
    }

    SetupPagination() {
        const totalPagesElement = document.getElementById('total-pages');
        if (totalPagesElement) {
            this.totalPages = parseInt(totalPagesElement.innerText, 10);
        } else {
            this.totalPages = Math.ceil(this.allItems.length / this.itemsPerPage);
        }
    }

    LoadItems() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = this.currentPage * this.itemsPerPage;
        this.filteredItems = this.allItems.slice(start, end);
        this.RenderItems();
    }

    RenderItems() {
        this.listElement.innerHTML = '';
        this.filteredItems.forEach(item => {
            this.listElement.appendChild(item);
        });
        this.ToggleEmptyState();
    }

    SortItems() {
        if(!this.sortOptions) return;

        let [key, order] = this.sortOptions.value.split('-');
        this.filteredItems.sort((a, b) => {
            let aValue = a.dataset[key];
            let bValue = b.dataset[key];
            
            // If sorting by number (like price or year)
            if (!isNaN(aValue) && !isNaN(bValue)) {
                aValue = parseFloat(aValue);
                bValue = parseFloat(bValue);
            }
        
            if (order === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
            });
    }

    
    ApplyFilters() {
        const filters = this.GetFilters();
    
        this.filteredItems = this.allItems.filter(item => {
            return Object.keys(filters).every(category => {
                const values = [...filters[category]];
                if(values.length === 0) return values.length === 0;
    
                let matchingText = item.querySelector(`[wt-cmsfilter-category="${category}"]`)?.innerText.toLowerCase() || '';
                matchingText = matchingText.replace(/(?:&nbsp;|\s)+/gi, ' ');
    
                if (category === '*') {
                    return values.length === 0 || 
                        values.some(value => matchingText.includes(value.toLowerCase())) ||
                        Object.values(item.dataset).some(dataValue => 
                            values.some(value => dataValue.toLowerCase().includes(value.toLowerCase()))
                        );
                } else {
                    return values.length === 0 || values.some(value => {
                        if (typeof value === 'object') {
                            const itemValue = parseFloat(item.dataset[category]);
                            if(value.from !== null && value.to !== null) {
                                return itemValue >= value.from && itemValue <= value.to;
                            } else if (value.from !== null && value.to == null) {
                                return itemValue >= value.from;
                            } else if (value.from == null && value.to !== null) {
                                return itemValue <= value.to;
                            }
                        } else {
                            return item.dataset[category]?.toLowerCase().includes(value.toLowerCase()) || 
                                matchingText.includes(value.toLowerCase());
                        }
                    });
                }
            });
        });
    
        this.activeFilters = filters;
        this.SortItems();
        this.RenderItems();
        this.UpdateAvailableFilters();
        this.ShowResultCount();
        this.SetActiveTags();
    }


    ShowResultCount() {
        if(!this.resultCount) return;
        this.resultCount.innerText = this.GetResults();
    }

    GetFilters() {
        const filters = {};
        const rangeFilters = {};
    
        this.filterElements.forEach(element => {
            const category = element.getAttribute('wt-cmsfilter-category');
            
            if (!filters[category]) {
                filters[category] = [];
            }
    
            const input = (element.tagName === "INPUT") ? element : element.querySelector('input[type="checkbox"], input[type="radio"], input[type="text"]');
    
            if (input) {
                if (input.type === 'text') {
                    const rangeType = element.getAttribute('wt-cmsfilter-range');
                    if (rangeType === 'from' || rangeType === 'to') {
                        if (!rangeFilters[category]) {
                            rangeFilters[category] = { from: null, to: null };
                        }
    
                        const value = parseFloat(input.value.trim());
                        if (!isNaN(value)) {
                            if(!input.hasAttribute('wt-cmsfilter-default')){
                                input.setAttribute('wt-cmsfilter-default', value)
                            }
                            else {
                                let _default = input.getAttribute('wt-cmsfilter-default');
                                if (rangeType === 'from' && _default != value ) {
                                    rangeFilters[category].from = value;
                                } else if (rangeType === 'to' && _default != value) {
                                    rangeFilters[category].to = value;
                                }
                            }
                        } else {
                            rangeFilters[category][rangeType] = null;
                        }
                    } else if (input.value.trim() !== '') {
                        filters[category].push(input.value.trim());
                    } else {
                        filters[category] = [];
                    }
                } else if (input.checked) {
                    filters[category].push(input.nextElementSibling.textContent.trim());
                    if (this.activeFilterClass) {
                        element.classList.add(this.activeFilterClass);
                    }
                } else {
                    if (this.activeFilterClass) {
                        element.classList.remove(this.activeFilterClass);
                    }
                }
            }
        });
    
        Object.keys(rangeFilters).forEach(category => {
            const range = rangeFilters[category];
            if (range.from !== null && range.to !== null) {
                filters[category].push({ from: range.from, to: range.to });
            }
            else if (range.from !== null && range.to == null) {
                filters[category].push({ from: range.from, to: null });
            }
            else if (range.from == null && range.to !== null) {
                filters[category].push({ from: null, to: range.to });
            }
        });
    
        return filters;
    }
    

    GetDataSet(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '').replace('-', '');
    }

    UpdateAvailableFilters() {
        if (this.filterForm.getAttribute('wt-cmsfilter-filtering') !== 'advanced') return;
        this.availableFilters = {};
        this.filterElements.forEach(element => {
            const category = this.GetDataSet(element.getAttribute('wt-cmsfilter-category'));
            const availableValues = new Set(this.filteredItems.map(item => item.dataset[category]).filter(value => value !== ""));
            this.availableFilters[category] = availableValues;
            const istoggle = element.querySelector('input[type="checkbox"], input[type="radio"]');
            if (istoggle) {
                const value = element.innerText;
                element.style.display = availableValues.has(value) ? '' : 'none';
            }
        });
    }

    ToggleEmptyState() {
        if (this.emptyElement) {
            if (this.filteredItems.length === 0) {
                this.emptyElement.style.display = 'block';
            } else {
                this.emptyElement.style.display = 'none';
            }
        }
    }

    InitializeTagTemplate() {
        if(!this.tagTemplate) return;
        this.tagTemplateContainer.innerHTML = "";
    }

    SetActiveTags() {
        this.InitializeTagTemplate();
        // Clear existing tags before adding new ones
        this.tagTemplateContainer.innerHTML = "";
    
        const filterTags = Object.keys(this.activeFilters);
        filterTags.forEach(tag => {
            if (this.activeFilters[tag].length !== 0) {
                this.activeFilters[tag].forEach(filterValue => {
                    const newTag = this.tagTemplate.cloneNode(true);
                    const tagText = newTag.querySelector('[wt-cmsfilter-element="tag-text"]');
                    const tagRemove = newTag.querySelector('[wt-cmsfilter-element="tag-remove"]');

                    if (typeof filterValue === 'object' && filterValue.from !== null && filterValue.to !== null) {
                        tagText.innerText = `${tag}: ${filterValue?.from} - ${filterValue?.to}`;
                    }
                    else if (typeof filterValue === 'object' && filterValue.from !== null && filterValue.to === null ) {
                        tagText.innerText = `${tag}: ${filterValue?.from}`;
                    }
                    else if (typeof filterValue === 'object' && filterValue.from === null && filterValue.to !== null ) {
                        tagText.innerText = `${tag}: ${filterValue?.to}`;
                    }
                    else{
                        tagText.innerText = `${tag}: ${filterValue}`;
                    }
                    this.tagTemplateContainer.append(newTag);
    
                    // Bind the remove event listener
                    tagRemove.addEventListener('click', (event) => {
                        event.preventDefault();
                        this.RemoveActiveTag(newTag, tag, filterValue);
                    });
                });
            }
        });
    }
    
    RemoveActiveTag(_tag, filterTag, value) {
        const categoryElements = this.filterForm.querySelectorAll(`[wt-cmsfilter-category="${filterTag}"]`);
    
        categoryElements.forEach(categoryElement => {
            const input = (categoryElement.tagName === "INPUT") 
                ? categoryElement 
                : categoryElement.querySelector('input[type="checkbox"], input[type="radio"], input[type="text"]');
    
                if (input) {
                    if (input.type === 'text') {
                        if(input.hasAttribute('wt-cmsfilter-default')) {
                            input.value = input.getAttribute('wt-cmsfilter-default');
                        }
                        else {
                            input.value = '';
                        }
                    } else if (input.type === 'checkbox') {
                        input.checked = false;
                    }
                }
        });
    
        this.activeFilters[filterTag] = this.activeFilters[filterTag].filter(filter => filter !== value);
    
        _tag.remove();
    
        this.ApplyFilters();
    }

    NextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.LoadItems();
            this.UpdatePaginationDisplay();
        }
    }

    PrevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.LoadItems();
            this.UpdatePaginationDisplay();
        }
    }

    UpdatePaginationDisplay() {
        const currentPageElement = document.getElementById('current-page');
        if (currentPageElement) {
            currentPageElement.innerText = this.currentPage;
        }
    }

    GetResults() {
        if(this.activeFilters){
            let currActive = Object.values(this.activeFilters).filter(filter => filter.length > 0);
            if(currActive.length > 0){
                return this.filteredItems.length;
            }
        } 
        if(this.allItems){
            if(this.allItems.length > 0) {
                return this.allItems.length;
            }
            return 0;
        }
        return 0;
    }

    ClearAllFilters() {
        this.filterElements.forEach(element => {
            const input = (element.tagName === "INPUT") 
                ? element 
                : element.querySelector('input[type="checkbox"], input[type="radio"], input[type="text"]');
    
                if (input) {
                    if (input.type === 'text') {
                        if(input.hasAttribute('wt-cmsfilter-default')) {
                            input.value = input.getAttribute('wt-cmsfilter-default');
                        }
                        else {
                            input.value = '';
                        }
                    } else if (input.type === 'checkbox') {
                        input.checked = false;
                    }
                }
            
            if (this.activeFilterClass) {
                element.classList.remove(this.activeFilterClass);
            }
        });
    
        this.activeFilters = {};
    
        if (this.tagTemplateContainer) {
            this.tagTemplateContainer.innerHTML = "";
        }
    
        this.ApplyFilters();
    }
    

    GetFilterData() {
        let filterData = {
            'filters': this.filterElements,
            'active': this.activeFilters,
            'available': this.availableFilters,
            'results': this.GetResults(),
            'per-page-items': this.itemsPerPage,
            'total-pages': this.totalPages,
            'current-page': this.currentPage
        }
        return filterData;
    }
}

const InitializeCMSFilter = () => {
    window.trickeries = window.trickeries || [];
    let instance = new CMSFilter();
    window.trickeries.push({'CMSFilter': instance});
}

if (/complete|interactive|loaded/.test(document.readyState)) {
    InitializeCMSFilter();
} else { 
    window.addEventListener('DOMContentLoaded', InitializeCMSFilter)
}
