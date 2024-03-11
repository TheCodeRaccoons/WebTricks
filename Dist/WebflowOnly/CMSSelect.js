'use strict'

const InitializeCMSSelect = () => {

    const selectElements = document.querySelectorAll('[wt-cmsselect-element^="select-"], [wt-cmsselect-element="select"]');
    
    if(!selectElements || selectElements.length === 0) return;

    for(let select of selectElements){
        const _sel      = select.getAttribute('wt-cmsselect-element');
        let index       = _sel.replace('select','');
        let _opts       = document.querySelectorAll(`[wt-cmsselect-element="target${index}"]`);

        for(let opt of _opts) {
            let val     = opt.getAttribute('wt-cmsselect-value');
            let text    = opt.innerText;
            
            if(text && text !== "")
            select.add( new Option(text, (val ? val : text)))
        }
    }
}

window.addEventListener('DOMContentLoaded', InitializeCMSSelect());