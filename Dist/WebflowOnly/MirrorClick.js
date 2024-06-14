'use strict'

const InitializeMirrorClick = () => {

    let triggers = document.querySelectorAll('[wt-mirrorclick-element^="trigger-"], [wt-mirrorclick-element="trigger"]');
    
    if(!triggers || triggers.length === 0) return;

    for(let trigger of triggers) {
        let _triggerAttr    = trigger.getAttribute('wt-mirrorclick-element');
        let _index          = _triggerAttr.replace('trigger','');
        let _target         = document.querySelector(`[wt-mirrorclick-element="target${_index}"]`);

        if(_target) {
            trigger.addEventListener('click', () => {
                _target.click();
            })
        }
    }
}

window.addEventListener('DOMContentLoaded', InitializeMirrorClick());
