'use strict'

const UpdateTriggerDisplay = (_txt, _target, _trigger, _class ) => {
    if (_txt){ 
        if(_target) _target.innerText = _txt;
        else _trigger.innerHTML = _txt;
    } 
    if (_class) _trigger.classList.toggle(_class);
}

const SetCopyToClipboard = () => {
    const copyTriggers = document.querySelectorAll('[wt-copycb-element^="trigger-"], [wt-copycb-element="trigger"]');

    if(!copyTriggers || copyTriggers.length === 0) return;

    for(let _trigger of copyTriggers) {
        let _triggerAttr    = _trigger.getAttribute(`wt-copycb-element`);
        let index           = _triggerAttr.replace('trigger','');
        let _target         = document.querySelector(`[wt-copycb-element="target${index}"]`);

        if(_target) {
            _trigger.addEventListener('click', () => {
                let textToCopy  = _target.innerText;
                let copiedTxt   = _trigger.getAttribute("wt-copycb-message");
                let activeClass = _trigger.getAttribute('wt-copycb-active');
                let timeOut     = _trigger.getAttribute('wt-copycb-timeout') || 2000;
                let _defaultTxt = _trigger.innerText;
                let textTarget  = document.querySelector(`[wt-copycb-element="text-target${index}"]`);

                UpdateTriggerDisplay(copiedTxt, textTarget, _trigger, activeClass);
                setTimeout(() => {
                    UpdateTriggerDisplay(_defaultTxt, textTarget, _trigger, activeClass);
                }, timeOut);
                navigator.clipboard.writeText(textToCopy);
            });
        }
    }
}

window.addEventListener('DOMContentLoaded', SetCopyToClipboard());
