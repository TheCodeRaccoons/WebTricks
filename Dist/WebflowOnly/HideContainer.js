'use strict'

const SetHideContainers = () => {
    let containers      = document.querySelectorAll('[wt-hidecontainer-element^="container-"], [wt-hidecontainer-element="container"]');
    let err             = [];
    let valid           = true;

    if(!containers || containers.length === 0) {
        err.push(`%cThere are no containers in this page.`);
        valid = false;
    }

    if (!valid) {
        console.log("%cThanks for using Webflow Trickery","color: blue; font-size: 18px; padding: 8px; font-weight:500");            
        console.log("%cIt seems like you're missing an element that is required for the integration.","color: red; font-size: 12px; padding: 8px; font-weight:500");
        for(let e of err){
            console.log(e,"color: red; font-size: 12px; padding: 8px; font-weight:500")
        }
        return;
    }

    for(let _container of containers) {
        let _cmsList    = _container.querySelector('[wt-hidecontainer-element="list"]');
        let _r          = _container.getAttribute('wt-hidecontainer-remove');
        if(!_cmsList) return;
        if(_cmsList.classList.contains("w-dyn-empty")) {
            if(_r) {
                _container.remove();
            }
            else{
                _container.style.display = 'none';
            }
        }
    }
}

window.addEventListener('DOMContentLoaded', SetHideContainers());