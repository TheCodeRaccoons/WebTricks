'use strict'

class RenderStatic {
    constructor() {
        this.cloneables = [];
        this.container = null;
        this.gap = 0;
        this.observer = null;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                this.initializeRenderStatic();
                this.observeContainer();
            }, 250);
        });
    }

    insertChildAtIndex(parent, child, index = 0) {
        if (!child) return;
        let childClone = child.cloneNode(true);
        if (parent) {
            parent.insertBefore(childClone, parent.children[index]);
        }
    }

    initializeRenderStatic() {
        this.container = this.container || document.querySelector("[wt-renderstatic-element='container']");
        this.cloneables = this.cloneables.length === 0 ? document.querySelectorAll("[wt-renderstatic-element='cloneable']") : this.cloneables;

        if (!this.container || this.cloneables.length === 0) return;

        this.gap = this.gap !== 0 ? this.gap : +this.container.getAttribute("wt-renderstatic-gap") || 0;

        // Stop observing to prevent the observer from reacting to clone removals
        if (this.observer) this.observer.disconnect();

        let childrenArray = Array.from(this.container.children);

        childrenArray.forEach(child => {
            if (child.hasAttribute("wt-renderstatic-element")) child.remove();
        });

        let insertIndex = this.gap;
        const totalChildren = childrenArray.length;
        const totalInsertions = Math.round(totalChildren / this.gap);
        let cloneIndex = 0;

        for (let i = 0; i <= totalChildren + totalInsertions; i++) {
            if (i === insertIndex) {
                this.insertChildAtIndex(this.container, this.cloneables[cloneIndex], insertIndex);
                cloneIndex = (cloneIndex < this.cloneables.length - 1) ? cloneIndex + 1 : 0;
                insertIndex = i + this.gap + 1;
            }
        }

        // Re-observe the container
        this.observeContainer();
    }

    observeContainer() {
        if (!this.container) return;

        this.observer = new MutationObserver((mutations) => {
            let hasNonCloneChanges = mutations.some(mutation => {
                return Array.from(mutation.addedNodes).some(node => !node.hasAttribute("wt-renderstatic-element")) ||
                    Array.from(mutation.removedNodes).some(node => !node.hasAttribute("wt-renderstatic-element"));
            });

            if (hasNonCloneChanges) {
                this.initializeRenderStatic();
            }
        });

        this.observer.observe(this.container, { childList: true });
    }
}

new RenderStatic();