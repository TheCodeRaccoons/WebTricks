'use strict'

const SetHideContainers = () => {
    let containers      = document.querySelectorAll('[wt-hidecontainer-element="container"], [wt-hidecontainer-element^="container-"]');

    if(!containers || containers.length === 0) return;

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
