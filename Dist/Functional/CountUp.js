'use strict'

class CountUp {
    constructor(_counter) {
        this.counter        = _counter;
        this.counterTarget  = +_counter.getAttribute("wt-countup-target") || 0;
        this.prefix         = _counter.getAttribute("wt-countup-prefix") || "";
        this.suffix         = _counter.getAttribute("wt-countup-suffix") || "";
        this.step           = +_counter.getAttribute("wt-countup-step")  || 1 ;
        this.speed          = +_counter.getAttribute("wt-countup-speed") || 10;
        this.currentVal     = 0;
        this.counterUp();
    }

    counterUp = () => {
        this.counter.innerHTML = `${this.prefix}${this.currentVal}${this.suffix}`;
        if (this.step) this.currentVal += this.step;
        else this.currentVal++;
        if (this.currentVal > this.counterTarget) clearInterval(this.stop);
    }

    stop = setInterval(() => {
        try {
            this.counterUp();
        } catch (err) {
            clearInterval(this.stop);
        }
    }, this.speed);
}

const InitializeCountUp = () => {
    window.trickeries = window.trickeries || [];
    let counters = document.querySelectorAll("[wt-countup-element='counter']");
    if(!counters || counters.length === 0) return;

    counters.forEach(counter => {
        let instance = new CountUp(counter);
        window.trickeries.push({'CountUp': instance});
    });

}

if (/complete|interactive|loaded/.test(document.readyState)) {
    InitializeCountUp();
} else {
    window.addEventListener('DOMContentLoaded', InitializeCountUp);
}
