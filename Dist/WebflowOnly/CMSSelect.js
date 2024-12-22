'use strict';

class CMSSelect {
    constructor(selectElement) {
        try {
            this.selectElement = selectElement;
            this.attributeValue = this.selectElement.getAttribute('wt-cmsselect-element');
            this.index = this.attributeValue.replace('select', '');
            
            // Fetch the corresponding options
            this.options = document.querySelectorAll(`[wt-cmsselect-element="target${this.index}"]`);
            if (!this.options || this.options.length === 0) throw new Error(`No options found for select ${this.index}`);

            // Populate the select element
            this.populateSelect();
        } catch (err) {
            console.error(`Error initializing CMSSelect: ${err.message}`);
        }
    }

    populateSelect() {
        try {
            this.options.forEach(opt => {
                const value = opt.getAttribute('wt-cmsselect-value');
                const text = opt.innerText;
                
                if (text && text.trim() !== "") {
                    const option = new Option(text, value || text);
                    this.selectElement.add(option);
                }
            });
        } catch (err) {
            console.error(`Error populating select: ${err.message}`);
        }
    }
}

const InitializeCMSSelect = () => {
    try {
        window.webtricks = window.webtricks || [];
        const selectElements = document.querySelectorAll('[wt-cmsselect-element^="select-"], [wt-cmsselect-element="select"]');
        
        if (!selectElements || selectElements.length === 0) throw new Error("No select elements found.");

        selectElements.forEach(selectElement => {
            const instance = new CMSSelect(selectElement);
            window.webtricks.push({ 'CMSSelect': instance });
        });
    } catch (err) {
        console.error(`Error during CMSSelect initialization: ${err.message}`);
    }
};

// Ensure the script runs when the DOM is fully loaded
if (/complete|interactive|loaded/.test(document.readyState)) {
    InitializeCMSSelect();
} else {
    window.addEventListener('DOMContentLoaded', InitializeCMSSelect);
}
