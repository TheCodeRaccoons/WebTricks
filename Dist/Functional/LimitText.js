'use strict'

const LimitText = () => {
    let _fullText = document.querySelectorAll('[wt-limittext-element^="text-"], [wt-limittext-element="text"]');

    if(!_fullText || _fullText.length === 0) return;

    for (text of _fullText) {
        let suffix          = text.getAttribute("wt-limittext-suffix") || null;
        let textLength      = +text.getAttribute("wt-limittext-length") || 300 ;
        let txtContent      = text.innerText;
        if (txtContent.length > textLength) {
            var _substr = `${txtContent.substring(0, textLength)} ${ suffix ? suffix : "..."}`;
            text.innerText = _substr;
        }
    }
}

if (/complete|interactive|loaded/.test(document.readyState)) {
    LimitText();
} else { 
    window.addEventListener('DOMContentLoaded', LimitText)
}