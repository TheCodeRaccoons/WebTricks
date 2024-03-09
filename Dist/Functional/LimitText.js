'use strict'

const LimitText = () => {
    let _fullText = document.querySelectorAll('[wt-limittext-element="text"]');

    if(!_fullText || _fullText.length === 0) return;

    for (text of _fullText) {
        let suffix          = text.getAttribute("wt-limittext-suffix") || null;
        let textLength      = text.getAttribute("wt-limittext-length") || 300 ;
        let description = text.innerText;
        if (description.length > textLength) {
            var _substr = `${description.substring(0, textLength)} ${ suffix ? suffix : "..."}`;
            text.innerText = _substr;
        }
    }
}

window.addEventListener('DOMContentLoaded', LimitText());
