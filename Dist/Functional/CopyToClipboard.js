class CopyToClipboard {
    constructor(_trigger) {
        this.triggerSelector = _trigger;
        this.initialize(); 
    }

    initialize() {
      let _triggerAttr = this.triggerSelector.getAttribute('wt-copycb-element');
      let index = _triggerAttr.replace('trigger', '');
      let _target = document.querySelector(`[wt-copycb-element="target${index}"]`);
      if (_target) {
        this.triggerSelector.addEventListener('click', () => {
          this.copyTextToClipboard(this.triggerSelector, _target, index);
        });
      }
    }

    copyTextToClipboard(_trigger, _target, index) {
        let textToCopy = _target.innerText;
        let copiedTxt = _trigger.getAttribute("wt-copycb-message");
        let activeClass = _trigger.getAttribute('wt-copycb-active');
        let timeOut = _trigger.getAttribute('wt-copycb-timeout') || 2000;
        let _defaultTxt = _trigger.innerText;
        let textTarget = document.querySelector(`[wt-copycb-element="text-target${index}"]`);

        this.updateTriggerDisplay(copiedTxt, textTarget, _trigger, activeClass);
        setTimeout(() => {
            this.updateTriggerDisplay(_defaultTxt, textTarget, _trigger, activeClass);
        }, timeOut);
        navigator.clipboard.writeText(textToCopy);
    }

    updateTriggerDisplay(_txt, _target, _trigger, _class) {
        if (_txt) {
            if (_target) _target.innerText = _txt;
            else _trigger.innerHTML = _txt;
        }
        if (_class) _trigger.classList.toggle(_class);
    }
}

const initializeCopyToClipboard = () => {
    window.trickeries = window.trickeries || [];
    const triggers = document.querySelectorAll('[wt-copycb-element^="trigger-"], [wt-copycb-element="trigger"]');
    triggers.forEach(trigger => {
        let instance = new CopyToClipboard(trigger);
        window.trickeries.push({'copyToClipboard': instance});
    });
}

if (/complete|interactive|loaded/.test(document.readyState)) {
    initializeCopyToClipboard();
} else {
    window.addEventListener('DOMContentLoaded', initializeCopyToClipboard);
}
