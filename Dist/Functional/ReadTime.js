'use strict'

const SetReadTime = () => {
    const timeDisplays   = document.querySelectorAll('[wt-readtime-element="display"]');
    const container     = document.querySelector('[wt-readtime-element="article"]'); 

    let valid = true;
    let err = []

    if(!timeDisplays || timeDisplays.length === 0) {
        err.push(`%c display element is missing`);
        valid = false;
    }
    if(!container){
        err.push(`%c article element is missing`);
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

    const text          = container.innerText;
    const words         = text.trim().split(/\s+/).length;
    const wpm           = container.getAttribute("wt-readtime-words") || 225;
    const suffix        = container.getAttribute('wt-readtime-suffix');
    const smallsuffix   = container.getAttribute('wt-readtime-smallsuffix');
    const rawTime       = words / wpm;

    for(let display of timeDisplays) {
        if(rawTime < 1 ) { 
            display.innerText = smallsuffix ? smallsuffix : "less than a minute.";
        }
        else if(rawTime == 1 ) { 
            display.innerText = "a minute.";
        }
        else {
            display.innerText = suffix ? `${Math.ceil(rawTime)} ${suffix}` : `${Math.ceil(rawTime)} minutes.`;
        }
    }
}

window.addEventListener('DOMContentLoaded', SetReadTime());