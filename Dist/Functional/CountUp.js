'use strict'

const InitializeCountUp = () => {
    let counters = document.querySelectorAll("[wt-countup-element='counter']");

    if(!counters || counters.length === 0) return;

    for(let c of counters) {
        let target  = c.getAttribute("wt-countup-target") || 0;
        if (!target) return;
        let prefix  = c.getAttribute("wt-countup-prefix") || "";
        let suffix  = c.getAttribute("wt-countup-suffix") || "";
        let step    = +c.getAttribute("wt-countup-step");
        let speed   = +c.getAttribute("wt-countup-speed") || 10;
        let v       = 0;

        let counterUp = () => {
            c.innerHTML = `${prefix}${v}${suffix}`;
            if (step) v += step;
            else v++;
            if (v > target) clearInterval(stop);
        }

        let stop = setInterval(() => {
            try {
                counterUp();
            } catch (err) {
                clearInterval(stop);
            }
        }, speed);
    }
};

window.addEventListener("DOMContentLoaded", InitializeCountUp());