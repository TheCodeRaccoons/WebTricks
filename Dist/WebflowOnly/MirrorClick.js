
'use strict';

class MirrorClick {
    constructor(triggerElement) {
        try {
            this.triggerElement = triggerElement;
            this.triggerAttr = triggerElement.getAttribute('wt-mirrorclick-element');
            this.index = this.triggerAttr.replace('trigger', '');
            this.targetElement = document.querySelector(`[wt-mirrorclick-element="target${this.index}"]`);

            if (!this.targetElement) throw new Error(`Target element not found for trigger: ${this.index}`);

            this.bindClickEvent();
        } catch (err) {
            console.error(`Error initializing MirrorClick: ${err.message}`);
        }
    }

    bindClickEvent() {
        try {
            this.triggerElement.addEventListener('click', () => {
                this.targetElement.click();
            });
        } catch (err) {
            console.error(`Error binding click event for MirrorClick: ${err.message}`);
        }
    }
}

const InitializeMirrorClick = () => {
    try {
        window.trickeries = window.trickeries || [];
        const triggers = document.querySelectorAll('[wt-mirrorclick-element^="trigger-"], [wt-mirrorclick-element="trigger"]');
        if (!triggers || triggers.length === 0) throw new Error("No trigger elements found.");

        triggers.forEach((triggerElement) => {
            let instance = new MirrorClick(triggerElement);
            window.trickeries.push({'MirrorClick': instance});
        });
    } catch (err) {
        console.error(`MirrorClick found an error during initialization: ${err.message}`);
    }
};

if (/complete|interactive|loaded/.test(document.readyState)) {
    InitializeMirrorClick();
} else {
    window.addEventListener('DOMContentLoaded', InitializeMirrorClick);
};
