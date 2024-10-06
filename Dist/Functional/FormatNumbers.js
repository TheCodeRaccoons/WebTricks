'use strict';

class NumberFormatter {
    constructor(_element) {
        try {
            this.element = _element;
            this.locales = _element.getAttribute("wt-formatnumber-locales");
            this.style = _element.getAttribute("wt-formatnumber-style");
            this.currency = _element.getAttribute("wt-formatnumber-currency");
            this.unit = _element.getAttribute("wt-formatnumber-unit");
            this.value = _element.textContent;

            if (!this.value) throw new Error("Number value is missing in the element.");

            this.options = this.getFormatStyle(this.style, this.currency, this.unit);
            if (!this.options) throw new Error("Invalid format options.");
            
            this.formatNumber();
        } catch (err) {
            console.error(`Error initializing NumberFormatter: ${err.message}`);
        }
    }

    getFormatStyle(_style, _currency, _unit) {
        let _options = null;
        if (_style) {
            switch (_style) {
                case 'currency':
                    if (!_currency) return null;
                    _options = {
                        style: _style,
                        currency: _currency
                    };
                    break;
                case 'decimal':
                case 'percent':
                    _options = { style: _style };
                    break;
                case 'unit':
                    if (!_unit) return null;
                    _options = {
                        style: _style,
                        unit: _unit
                    };
                    break;
                default:
                    return null;
            }
            return _options;
        }
    }

    formatNumber() {
        try {
            const number = parseFloat(this.value.replace(/,/g, ''));
            if (isNaN(number)) throw new Error("Invalid number value.");

            const formattedNumber = new Intl.NumberFormat(this.locales, this.options).format(number);
            if (!formattedNumber) throw new Error("Formatting failed.");
            
            this.element.innerHTML = formattedNumber;
        } catch (err) {
            console.error(`Error formatting number: ${err.message}`);
        }
    }
}

const InitializeFormatNumbers = () => {
    try {
        window.trickeries = window.trickeries || [];
        const numbersToFormat = document.querySelectorAll('[wt-formatnumber-element="number"]');
        if (!numbersToFormat || numbersToFormat.length === 0) throw new Error("No elements found to format.");

        numbersToFormat.forEach((numberContainer) => {
            let instance = new NumberFormatter(numberContainer);
            window.trickeries.push({'FormatNumber': instance});
        });
    } catch (err) {
        console.error(`Format Number found an Error while initializing: ${err.message}`);
    }
};

if (/complete|interactive|loaded/.test(document.readyState)) {
    InitializeFormatNumbers();
} else {
    window.addEventListener('DOMContentLoaded', InitializeFormatNumbers);
}
