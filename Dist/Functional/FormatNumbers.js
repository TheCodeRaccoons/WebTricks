/*
 * Number formating using Intl.NumberFormat.
 * Requirements: 
 * Element with custom attribute fn-formatnumber="true"
 * A Style in the same element to format choosing between "Currency", "decimal", "percent", "unit"
 * In case of the element being "Currency" or "Unit" the sent "fn-formatnumber-currency" or "fn-formatnumber-unit" option
 * Optional: set locales for the formatting
 * list of units can be found here for now: https://tc39.es/proposal-unified-intl-numberformat/section6/locales-currencies-tz_proposed_out.html#sec-issanctionedsimpleunitidentifier
 * currency uses regular notation for them.
 */

'use strict'

let FormatNo = (element, locales, number, options) => {
    let final = Intl.NumberFormat(locales, options).format(number);
    if (!final) return;
    element.innerHTML = final;
}

let GetFormatStyle = (_style, _currency, _unit) => {
    let _options = null;

    if (_style) {
        switch (_style) {
            case 'currency':
                if (!_currency) return;
                _options = {
                    style: _style,
                    currency: _currency
                }
                break;
            case 'decimal':
                _options = {
                    style: _style
                };
                break;
            case 'percent':
                _options = {
                    style: _style
                };
                break;
            case 'unit':
                _options = {
                    style: _style,
                    unit: _unit
                };
                break;
            default:
                return null;
        }
        return _options
    }
}

const InitializeFormatNumbers = () => {

    let numbersToFormat = document.querySelectorAll('[wt-formatnumber-element="number"]');

    if(!numbersToFormat || numbersToFormat.length === 0) return;

    for(let numberContainer of numbersToFormat) {
        let locales     = numberContainer.getAttribute("wt-formatnumber-locales");
        let style       = numberContainer.getAttribute("wt-formatnumber-style");
        let currency    = numberContainer.getAttribute("wt-formatnumber-currency");
        let unit        = numberContainer.getAttribute("wt-formatnumber-unit");
        let options     = GetFormatStyle(style, currency, unit);
        
        if(!options) return;

        let value = numberContainer.textContent;

        if (!value) return;
    
        try {
            FormatNo(numberContainer, locales, value, options);
        } catch (error) {
            console.error(`there was an error processing the format, ${error}`);
        }
    }
}

window.addEventListener('DOMContentLoaded', InitializeFormatNumbers());
