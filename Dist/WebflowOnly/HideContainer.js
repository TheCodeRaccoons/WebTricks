'use strict'

const SetHideContainers = () => {
    let containers      = document.querySelectorAll('[wt-hidecontainer-element="container"], [wt-hidecontainer-element^="container-"]');

    if(!containers || containers.length === 0) return;

    containers.forEach((cmsContainer) => {
        let _cmsList = cmsContainer.querySelector('[wt-hidecontainer-element="list"]');
        if(!_cmsList) return;
        let _r = cmsContainer.getAttribute('wt-hidecontainer-remove');
        if(_r) {if(_cmsList.classList.contains("w-dyn-empty")) cmsContainer.remove();}
        else{if(_cmsList.classList.contains("w-dyn-empty")) cmsContainer.style.display = 'none';}
    });

}
window.addEventListener('DOMContentLoaded', SetHideContainers());