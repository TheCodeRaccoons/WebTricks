'use strict';

class Marquee {
    constructor(_container) {
        try {
            this.container = _container;
            this.elements = Array.from(this.container.children);
            if (this.elements.length === 0) throw new Error("No elements found inside the marquee container.");

            this.speed = _container.getAttribute('wt-marquee-speed') || 50;
            this.direction = _container.getAttribute('wt-marquee-direction') || 'left'; // 'left', 'right', 'top', 'bottom'
            this.isVertical = this.direction === 'top' || this.direction === 'bottom';
            this.parentSize = this.isVertical ? this.container.parentElement.offsetHeight : this.container.parentElement.offsetWidth;
            this.gapSize = this.getGapSize();

            this.scrollPosition = 0;
            this.totalSize = this.calculateTotalSize();
            this.fillContainer();
            this.setMarqueeStyles();
            this.startMarquee();
            this.handleResize();
        } catch (err) {
            console.error(`Error initializing Marquee: ${err.message}`);
        }
    }

    calculateTotalSize() {
        const gapTotal = (this.elements.length - 1) * this.gapSize;
        return this.elements.reduce((total, el) => total + (this.isVertical ? el.offsetHeight : el.offsetWidth), 0) + gapTotal;
    }

    getGapSize() {
        const styles = getComputedStyle(this.container);
        return parseFloat(styles.gap) || 0;
    }

    fillContainer() {
        let totalSize = this.calculateTotalSize();
        const targetSize = this.parentSize * 1.5; 

        while (totalSize < targetSize) {
            this.elements.forEach(el => {
                const clone = el.cloneNode(true);
                this.container.appendChild(clone);
            });
            this.elements = Array.from(this.container.children);
            totalSize = this.calculateTotalSize();
        }
    }

    setMarqueeStyles() {
        this.container.style.display = 'flex';
        this.container.style.flexDirection = this.isVertical ? 'column' : 'row';
        this.container.style.whiteSpace = 'nowrap';
        this.container.style.position = 'relative';
    }

    startMarquee() {
        this.marqueeInterval = setInterval(() => {
            this.scrollPosition += (this.direction === 'left' || this.direction === 'top') ? -1 : 1;
            this.moveOffscreenElement();

            if (this.isVertical) {
                this.container.style.transform = `translate3d(0, ${this.scrollPosition}px, 0)`;
            } else {
                this.container.style.transform = `translate3d(${this.scrollPosition}px, 0, 0)`;
            }
        }, this.speed);
    }

    moveOffscreenElement() {
        const firstElement = this.container.firstElementChild;
        const lastElement = this.container.lastElementChild;
        
        const firstElementSize = this.isVertical ? firstElement.offsetHeight : firstElement.offsetWidth;
        const firstElementTotalSize = firstElementSize + this.gapSize;

        const lastElementSize = this.isVertical ? lastElement.offsetHeight : lastElement.offsetWidth;
        const lastElementTotalSize = lastElementSize + this.gapSize;

        if (this.direction === 'left' || this.direction === 'top') {
            if (this.scrollPosition <= -firstElementTotalSize) {
                this.container.style.transition = 'none';
                this.container.appendChild(firstElement);
                this.scrollPosition += firstElementTotalSize;
                requestAnimationFrame(() => {
                    this.container.style.transition = '';
                });
            }
        } else if (this.direction === 'right' || this.direction === 'bottom') {
            if (this.scrollPosition >= -firstElementTotalSize / 2) {
                this.container.style.transition = 'none';
                this.container.insertBefore(lastElement, firstElement);
                this.scrollPosition -= lastElementTotalSize; 
                requestAnimationFrame(() => {
                    this.container.style.transition = '';
                });
            }
        }
    }


    handleResize() {
        window.addEventListener('resize', () => {
            clearInterval(this.marqueeInterval);
            this.parentSize = this.isVertical ? this.container.parentElement.offsetHeight : this.container.parentElement.offsetWidth;
            this.totalSize = this.calculateTotalSize();
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
        window.webtricks = window.webtricks || [];
        const marqueeContainers = document.querySelectorAll('[wt-marquee-element="container"]');
        if (!marqueeContainers || marqueeContainers.length === 0) throw new Error("No marquee containers found.");

        marqueeContainers.forEach(container => {
            let instance = new Marquee(container);
            window.webtricks.push({'Marquee': instance});
        });
    } catch (err) {
        console.error(`Error in InitializeMarquee: ${err.message}`);
    }
};

if (/complete|interactive|loaded/.test(document.readyState)) {
    InitializeMarquee();
} else {
    window.addEventListener('DOMContentLoaded', InitializeMarquee);
};

// Allow requiring this module in test environments without affecting browser usage
try {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { Marquee, InitializeMarquee };
    }
} catch {}
