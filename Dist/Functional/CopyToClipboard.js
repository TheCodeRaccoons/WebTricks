class CopyToClipboard {
    constructor(_ctcContainer) {
        this.ctcContainer   = _ctcContainer;
        this.ctcTrigger     = this.ctcContainer.querySelector(`[wt-copycb-element="trigger"]`) || null;
        this.ctcTarget      = this.ctcContainer.querySelector(`[wt-copycb-element="target"]`) || null; 
        this.ctcDefaultTxt  = this.ctcTrigger.innerText;
        this.textToCopy     = this.ctcTarget.innerText;
        this.copiedTxt      = this.ctcTrigger.getAttribute("wt-copycb-message") || null;
        this.activeClass    = this.ctcTrigger.getAttribute('wt-copycb-active') || 'is-copy';
        this.timeOut        = this.ctcTrigger.getAttribute('wt-copycb-timeout') || 2000;
        this.initialize();
    }

    initialize() {
        if(!this.ctcTrigger || !this.ctcTarget) return;
        this.ctcTrigger.addEventListener('click', () => this.copyTextToClipboard());
    }

    copyTextToClipboard() {
        this.updateTriggerDisplay();
        setTimeout(() => this.resetTriggerDisplay(), this.timeOut);
        navigator.clipboard.writeText(this.textToCopy);
    }

    updateTriggerDisplay() {
        if (this.copiedTxt) this.ctcTrigger.innerText = this.copiedTxt; 
        if (this.activeClass) this.ctcTrigger.classList.toggle(this.activeClass);
    }

    resetTriggerDisplay() {
        if (this.copiedTxt)  this.ctcTrigger.innerText = this.ctcDefaultTxt; 
        if (this.activeClass) this.ctcTrigger.classList.toggle(this.activeClass);
    }
}

const initializeCopyToClipboard = () => {
    window.trickeries = window.trickeries || [];
    const triggers = document.querySelectorAll('[wt-copycb-element="container"]');
    triggers.forEach(trigger => {
        let instance = new CopyToClipboard(trigger);
        window.trickeries.push({'CopyToClipboard': instance});
    });
}

if (/complete|interactive|loaded/.test(document.readyState)) {
    initializeCopyToClipboard();
} else {
    window.addEventListener('DOMContentLoaded', initializeCopyToClipboard);
}
