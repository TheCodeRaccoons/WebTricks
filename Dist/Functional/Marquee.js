'use strict';

class Marquee {
    constructor(_container) {
        try {
            this.container = _container;
            this.elements = Array.from(this.container.children);
            if (this.elements.length === 0) throw new Error("No elements found inside the marquee container.");
            
            this.speed = _container.getAttribute('wt-marquee-speed') || 50;
            this.direction = _container.getAttribute('wt-marquee-direction') || 'left';  // Possible values: 'left', 'right', 'top', 'bottom'
            this.isVertical = this.direction === 'top' || this.direction === 'bottom';   // Detect if vertical
            this.parentSize = this.isVertical ? this.container.parentElement.offsetHeight : this.container.parentElement.offsetWidth;
            this.totalSize = this.isVertical ? this.calculateTotalHeight() : this.calculateTotalWidth();
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

    calculateTotalHeight() {
        const gapTotal = (this.elements.length - 1) * this.gapSize;
        return this.elements.reduce((total, el) => total + el.offsetHeight, 0) + gapTotal;
    }

    getGapSize() {
        const styles = getComputedStyle(this.container);
        return parseFloat(styles.gap) || 0;
    }

    fillContainer() {
        let totalSize = this.isVertical ? this.calculateTotalHeight() : this.calculateTotalWidth();
        const targetSize = this.parentSize * 1.5;
        
        while (totalSize < targetSize) {
            this.elements.forEach(el => {
                const clone = el.cloneNode(true);
                this.container.appendChild(clone);
            });
            this.elements = Array.from(this.container.children);
            totalSize = this.isVertical ? this.calculateTotalHeight() : this.calculateTotalWidth();
        }
    }

    startMarquee() {
        this.marqueeInterval = setInterval(() => {
            // Adjust scroll position based on the direction
            if (this.direction === 'left' || this.direction === 'top') {
                this.scrollPosition -= 1;
            } else {
                this.scrollPosition += 1;
            }

            this.moveOffscreenElement();

            if (this.isVertical) {
                this.container.style.transform = `translateY(${this.scrollPosition}px)`;
            } else {
                this.container.style.transform = `translateX(${this.scrollPosition}px)`;
            }
        }, this.speed);
    }

    moveOffscreenElement() {
        const firstElement = this.container.firstElementChild;
        const firstElementSize = this.isVertical ? firstElement.offsetHeight : firstElement.offsetWidth;
        const firstElementTotalSize = firstElementSize + this.gapSize;

        if ((this.direction === 'left' || this.direction === 'top') && this.scrollPosition <= -firstElementTotalSize) {
            this.container.style.transition = 'none';
            this.container.appendChild(firstElement);
            this.scrollPosition += firstElementTotalSize;
            requestAnimationFrame(() => {
                this.container.style.transition = '';
            });
        } else if ((this.direction === 'right' || this.direction === 'bottom') && this.scrollPosition >= -firstElementTotalSize / 2) {
            const lastElement = this.container.lastElementChild;
            this.container.style.transition = 'none';
            this.container.insertBefore(lastElement, firstElement);
            this.scrollPosition -= firstElementTotalSize;
            requestAnimationFrame(() => {
                this.container.style.transition = '';
            });
        }
    }

    handleResize() {
        window.addEventListener('resize', () => {
            clearInterval(this.marqueeInterval);
            this.parentSize = this.isVertical ? this.container.parentElement.offsetHeight : this.container.parentElement.offsetWidth;
            this.totalSize = this.isVertical ? this.calculateTotalHeight() : this.calculateTotalWidth();
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
        window.trickeries = window.trickeries || [];
        const marqueeContainers = document.querySelectorAll('[wt-marquee-element="container"]');
        if (!marqueeContainers || marqueeContainers.length === 0) throw new Error("No marquee containers found.");

        marqueeContainers.forEach(container => {
            let instance = new Marquee(container);
            window.trickeries.push({'Marquee': instance});
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
