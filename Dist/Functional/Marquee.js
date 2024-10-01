'use strict';

class Marquee {
    constructor(_container) {
        try {
            this.container = _container;
            this.elements = Array.from(this.container.children);
            if (this.elements.length === 0) throw new Error("No elements found inside the marquee container.");
            this.speed =_container.getAttribute('wt-marquee-speed') || 50;
            this.direction = _container.getAttribute('wt-marquee-direction') || 'left' 
            this.viewportWidth = window.innerWidth;
            this.parentWidth = this.container.parentElement.offsetWidth;
            this.totalWidth = this.calculateTotalWidth();
            this.scrollPosition = 0;
            this.gapSize = this.getGapSize();

            this.fillContainer();
            this.startMarquee();
            this.handleResize();
        } catch (err) {
            console.error(`Error initializing Marquee: ${err.message}`);
        }
    }

    calculateTotalWidth() {
        const gapTotal = (this.elements.length - 1) * this.gapSize;
        return this.elements.reduce((total, el) => total + el.offsetWidth, 0) + gapTotal;
    }

    getGapSize() {
        const styles = getComputedStyle(this.container);
        return parseFloat(styles.gap) || 0;
    }

    fillContainer() {
        let totalWidth = this.calculateTotalWidth();
        const targetWidth = this.parentWidth * 1.5;
        
        while (totalWidth < targetWidth) {
            this.elements.forEach(el => {
                const clone = el.cloneNode(true);
                this.container.appendChild(clone);
            });
            this.elements = Array.from(this.container.children);
            totalWidth = this.calculateTotalWidth();
        }
    }

    startMarquee() {
        this.marqueeInterval = setInterval(() => {
            this.scrollPosition += this.direction === 'left' ? -1 : 1;

            this.moveOffscreenElement();

            this.container.style.transform = `translateX(${this.scrollPosition}px)`;
        }, this.speed);
    }

    moveOffscreenElement() {
        const firstElement = this.container.firstElementChild;
        const firstElementWidth = firstElement.offsetWidth + this.gapSize;

        if (this.direction === 'left' && this.scrollPosition <= -firstElementWidth) {
            this.container.style.transition = 'none';
            this.container.appendChild(firstElement);
            this.scrollPosition += firstElementWidth;
            requestAnimationFrame(() => {
                this.container.style.transition = '';
            });
        } else if (this.direction === 'right' && this.scrollPosition >= -firstElementWidth / 2) {
            const lastElement = this.container.lastElementChild;
            this.container.style.transition = 'none';
            this.container.insertBefore(lastElement, firstElement);
            this.scrollPosition -= firstElementWidth;
            requestAnimationFrame(() => {
                this.container.style.transition = '';
            });
        }
    }

    handleResize() {
        window.addEventListener('resize', () => {
            clearInterval(this.marqueeInterval);
            this.viewportWidth = window.innerWidth;
            this.parentWidth = this.container.parentElement.offsetWidth;
            this.totalWidth = this.calculateTotalWidth();
            this.fillContainer();
            this.startMarquee();
        });
    }

    stopMarquee() {
        clearInterval(this.marqueeInterval);
    }
}

const InitializeMarquee = () => {
    try {
        const marqueeContainers = document.querySelectorAll('[wt-marquee-element="container"]');
        if (!marqueeContainers || marqueeContainers.length === 0) throw new Error("No marquee containers found.");

        marqueeContainers.forEach(container => {
            new Marquee(container);
        });
    } catch (err) {
        console.error(`Error in InitializeMarquee: ${err.message}`);
    }
};

if (/complete|interactive|loaded/.test(document.readyState)) {
    InitializeMarquee();
} else {
    window.addEventListener('DOMContentLoaded', InitializeMarquee);
}
