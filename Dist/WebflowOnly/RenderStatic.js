'use strict'

class RenderStatic {
    constructor(_container) {
        this.container = _container;
        this.cloneables = document.querySelectorAll("[wt-renderstatic-element='cloneable']");
        this.resetIx2 = this.container.getAttribute('wt-renderstatic-resetix2') || false;

        this.gap = 0;
        this.observer = null;

        this.init();
    }

    init() {
        if (!this.container || this.cloneables.length === 0) return;

        this.gap = this.gap !== 0 ? this.gap : +this.container.getAttribute("wt-renderstatic-gap") || 1;

        if (this.observer) this.observer.disconnect();

        let childrenArray = Array.from(this.container.children);

        childrenArray.forEach(child => {
            if (child.hasAttribute("wt-renderstatic-element")) child.remove();
        });

        let insertIndex = this.gap;
        const totalChildren = childrenArray.length;
        let cloneIndex = 0;

        const maxInsertions = Math.floor((totalChildren - 1) / this.gap);

        for (let i = 0; i < maxInsertions; i++) {
            const currentIndex = i * (this.gap + 1) + this.gap;

            if (currentIndex >= totalChildren) break;

            this.insertChildAtIndex(this.container, this.cloneables[cloneIndex], currentIndex);
            cloneIndex = (cloneIndex < this.cloneables.length - 1) ? cloneIndex + 1 : 0;
        }
        
        this.observeContainer();
    }

    insertChildAtIndex(parent, child, index = 0) {
        if (!child) return;

        if (index >= parent.children.length) return;

        let childClone = child.cloneNode(true);
        if (parent) {
            parent.insertBefore(childClone, parent.children[index]);
            if(this.resetIx2) this.ResetInteraction(childClone);
        }
    }

    observeContainer() {
        if (!this.container) return;

        this.observer = new MutationObserver((mutations) => {
            let hasNonCloneChanges = mutations.some(mutation => {
                return Array.from(mutation.addedNodes).some(node => !node.hasAttribute("wt-renderstatic-element")) ||
                    Array.from(mutation.removedNodes).some(node => !node.hasAttribute("wt-renderstatic-element"));
            });

            if (hasNonCloneChanges) {
                this.init();
            }
        });

        this.observer.observe(this.container, { childList: true });
    }
    
    ResetInteraction(element) {
        if (!element) {
            console.error('Element not found');
            return;
        }

        const WebflowIX2 = window.Webflow && Webflow.require('ix2');
        if (!WebflowIX2) {
            console.error('Webflow IX2 engine not found.');
            return;
        }

        const targetElement = element.hasAttribute('data-w-id') 
            ? element 
            : element.querySelector('[data-w-id]');
        
        if (!targetElement) {
            console.warn('No IX2 interaction found on the element or its children.');
            return;
        }

        const dataWId = targetElement.getAttribute('data-w-id');
        if (dataWId) {
            targetElement.removeAttribute('data-w-id');
            targetElement.setAttribute('data-w-id', dataWId);

            WebflowIX2.init();
        } else {
            console.warn('No valid data-w-id attribute found.');
        }
    }
}

const initializeRenderStatic = () => {
    window.webtricks = window.webtricks || [];
    let rsContainer = document.querySelector("[wt-renderstatic-element='container']");
    if(!rsContainer) return;
    let instance = new RenderStatic(rsContainer);
    window.webtricks.push({'RenderStatic': instance});
}

if (/complete|interactive|loaded/.test(document.readyState)) {
    initializeRenderStatic();
} else { 
    window.addEventListener('DOMContentLoaded', initializeRenderStatic);
}
