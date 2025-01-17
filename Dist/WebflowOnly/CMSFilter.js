
'use strict';

class CMSFilter {
    constructor() {
        //CORE elements
        this.filterForm = document.querySelector('[wt-cmsfilter-element="filter-form"]');
        this.listElement = document.querySelector('[wt-cmsfilter-element="list"]');
        this.filterElements = this.filterForm.querySelectorAll('[wt-cmsfilter-category]');
        this.currentPage = 1;
        this.itemsPerPage = 0;

        //TAG elements
        this.tagTemplate = document.querySelector('[wt-cmsfilter-element="tag-template"]');
        this.tagTemplateContainer = (this.tagTemplate) ? this.tagTemplate.parentElement : null;

        //Pagination & Loading
        //Pagination wrapper is a MUST for the full functionality of the filter to work properly, 
        //if not added the filter will only work with whatever is loaded by default.
        this.paginationWrapper = document.querySelector('[wt-cmsfilter-element="pagination-wrapper"]') || null;
        this.loadMode = this.listElement.getAttribute('wt-cmsfilter-loadmode') || 'load-all'; //Currently only paginate and load-all
        this.previousButton = document.querySelector('[wt-cmsfilter-pagination="prev"]');
        this.nextButton = document.querySelector('[wt-cmsfilter-pagination="next"]');
        this.customNextButton = document.querySelector('[wt-cmsfilter-element="custom-next"]');
        this.customPrevButton = document.querySelector('[wt-cmsfilter-element="custom-prev"]');

        this.paginationcounter = document.querySelector('[wt-cmsfilter-element="page-count"]');
        this.activeFilterClass = this.filterForm.getAttribute('wt-cmsfilter-class');
        this.clearAll = document.querySelector('[wt-cmsfilter-element="clear-all"]');
        this.sortOptions = document.querySelector('[wt-cmsfilter-element="sort-options"]');
        this.resultCount = document.querySelector('[wt-cmsfilter-element="results-count"]');
        this.emptyElement = document.querySelector('[wt-cmsfilter-element="empty"]');

        this.allItems = [];
        this.filteredItems = [];
        this.totalPages = 1;
        this.activeFilters = {};
        this.availableFilters = {};

        this.init();
    }

    async init() {
        this.allItems = Array.from(this.listElement.children);
        this.itemsPerPage = this.allItems.length;
        if (this.paginationWrapper) {
            await this.LoadAllItems();
        }
        if (this.paginationcounter && this.paginationcounter != this.paginationWrapper.querySelector('.w-page-count')) {
            this.paginationWrapper.querySelector('.w-page-count').remove();
        } else {
            this.paginationcounter = this.paginationWrapper.querySelector('.w-page-count');
        }
        this.SetupEventListeners();
        this.RenderItems();
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

        if(this.previousButton || this.customPrevButton) {
            if(this.customPrevButton) { 
                this.customPrevButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    this.PrevPage();
                });
                if (this.previousButton) {
                    this.previousButton.remove();
                }
            } else { 
                this.previousButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    this.PrevPage();
                });
            }
        }
        if(this.nextButton || this.customNextButton) {
            if(this.customNextButton) { 
                this.customNextButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    this.NextPage();
                });
                if (this.nextButton) {
                    this.nextButton.remove();
                }
            } else { 
                this.nextButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    this.NextPage();
                });
            }
        }

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

    generatePaginationLinksFromString(paginationString, baseUrl) {
        const [currentPage, totalPages] = paginationString.split(' / ').map(Number);
        const links = [];
        
        for (let page = currentPage + 1; page <= totalPages; page++) {
            const updatedUrl = baseUrl.replace(/page=\d+/, `page=${page}`);
            links.push(updatedUrl);
        }
    
        return links;
    }

    async LoadAllItems() {
        if (!this.paginationWrapper) return;
        this.itemsPerPage = this.allItems.length;

        const paginationPages = this.paginationWrapper.querySelector('.w-page-count');
        const baseLink = this.paginationWrapper.querySelector('a');
        const links = this.generatePaginationLinksFromString(paginationPages.innerText, baseLink.href);
        if (!links || links.length === 0) return;
        for (const link of links) {
            try {
                const htmlDoc = await this.FetchHTML(link);
                if (htmlDoc) {
                    const cards = Array.from(htmlDoc.querySelector('[wt-cmsfilter-element="list"]')?.children || []);

                    if (cards.length > 0) {
                        for (const card of cards) {
                            if (card instanceof Node) { // Ensure it's a valid DOM node
                                this.allItems.push(card);
                            } else {
                                console.warn('Non-DOM element skipped:', card);
                            }
                        }
                    }
                } else {
                    console.error('Failed to fetch HTML from the URL:', link.href);
                }
            } catch (error) {
                console.error('Error fetching HTML:', error);
            }
        }
    }

    async FetchHTML(url) {
        const response = await fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
        const text = await response.text();
        const parser = new DOMParser();
        return parser.parseFromString(text, 'text/html');
    }

    FiltersApplied() {
        return Object.values(this.activeFilters).some(arr => Array.isArray(arr) && arr.length > 0);
    }

    RenderItems() {
        this.listElement.innerHTML = '';
        if(this.filteredItems.length === 0) { 
            if(!this.FiltersApplied()) {
                this.filteredItems = this.allItems;
            }
        } 
        if(this.paginationWrapper) {
            if(this.loadMode === 'load-all') {
                this.filteredItems.forEach(item => {
                    this.listElement.appendChild(item);
                });
                if(this.paginationWrapper){
                    this.paginationWrapper.remove();
                }
            } else if (this.loadMode === 'paginate') {
                this.totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
                const currentSlice = (this.currentPage * this.itemsPerPage) - this.itemsPerPage;
                const currentPage = this.filteredItems.slice(currentSlice, currentSlice + this.itemsPerPage);
                currentPage.forEach(item => {
                    this.listElement.appendChild(item);
                });
            }
        } else {
            this.filteredItems.forEach(item => {
                this.listElement.appendChild(item);
            });
        }
        
        var webflow = window.Webflow || [];
        if(webflow) {
            webflow.require('ix2').init();
        }
        this.ToggleEmptyState();
        this.UpdatePaginationDisplay();
    }

    SortItems() {
        if(!this.sortOptions) return;
    
        let [key, order] = this.sortOptions.value.split('-');
        this.filteredItems.sort((a, b) => {
            let aValue = a.dataset[key];
            let bValue = b.dataset[key];
    
            if (!isNaN(aValue) && !isNaN(bValue)) {
                aValue = parseFloat(aValue);
                bValue = parseFloat(bValue);
            }
            else if (Date.parse(aValue) && Date.parse(bValue)) {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
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
        this.currentPage = 1; //Reset pagination to first page
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
        if(!this.tagTemplateContainer) return;
        this.InitializeTagTemplate();
    
        const filterTags = Object.keys(this.activeFilters);
        filterTags.forEach(tag => {
            if (this.activeFilters[tag].length !== 0) {
                this.activeFilters[tag].forEach(filterValue => {
                    const newTag = this.tagTemplate.cloneNode(true);
                    const tagText = newTag.querySelector('[wt-cmsfilter-element="tag-text"]');
                    const showTagCategory = newTag.getAttribute('wt-cmsfilter-tag-category') || 'true';
                    const tagRemove = newTag.querySelector('[wt-cmsfilter-element="tag-remove"]');

                    if (typeof filterValue === 'object' && filterValue.from !== null && filterValue.to !== null) {
                        tagText.innerText = `${showTagCategory === 'true' ? `${tag}:` : ''} ${filterValue?.from} - ${filterValue?.to}`;
                    }
                    else if (typeof filterValue === 'object' && filterValue.from !== null && filterValue.to === null ) {
                        tagText.innerText = `${showTagCategory === 'true' ? `${tag}:` : ''} ${filterValue?.from}`;
                    }
                    else if (typeof filterValue === 'object' && filterValue.from === null && filterValue.to !== null ) {
                        tagText.innerText = `${showTagCategory === 'true' ? `${tag}:` : ''} ${filterValue?.to}`;
                    }
                    else{
                        tagText.innerText = `${showTagCategory === 'true' ? `${tag}:` : ''} ${filterValue}`;
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
        const advancedFiltering = this.filterForm.getAttribute('wt-cmsfilter-filtering');
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
                        if(advancedFiltering === 'advanced') { 
                            input.checked = false;
                        }
                        else {  
                            if(categoryElement.innerText === value) { 
                                input.checked = false;
                            }
                        }
                    }
                } 
        });
    
        this.activeFilters[filterTag] = this.activeFilters[filterTag].filter(filter => filter !== value);
    
        _tag.remove();
    
        this.ApplyFilters();
    }

    NextPage() {
        if (this.currentPage <= this.totalPages) {
            this.currentPage = this.currentPage + 1;
            this.RenderItems();
        }
    }

    PrevPage() {
        if (this.currentPage > 1) {
            this.currentPage = this.currentPage - 1;
            this.RenderItems();
        }
    }

    UpdatePaginationDisplay() {
        if(!this.paginationWrapper) return;

        if (this.paginationcounter) {
            this.paginationcounter.innerText = `${this.currentPage} / ${this.totalPages}`;
        }
        if(this.currentPage === 1){
            if(this.previousButton) this.previousButton.hidden = true;
            if(this.customPrevButton) this.customPrevButton.hidden = true;
        } else {
            if(this.previousButton) this.previousButton.hidden = false;
            if(this.customPrevButton) this.customPrevButton.hidden = false;
        }
        if(this.currentPage === this.totalPages){
            if(this.nextButton) this.nextButton.hidden = true;
            if(this.customNextButton) this.customNextButton.hidden = true;
        } else {
            if(this.nextButton) this.nextButton.hidden = false;
            if(this.customNextButton) this.customNextButton.hidden = false;
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
    window.webtricks = window.webtricks || [];
    let instance = new CMSFilter();
    window.webtricks.push({'CMSFilter': instance});
}

if (/complete|interactive|loaded/.test(document.readyState)) {
    InitializeCMSFilter();
} else { 
    window.addEventListener('DOMContentLoaded', InitializeCMSFilter)
}