'use strict'

class ReadTime {
    constructor(_container) {
        this.articleContainer   = _container;
        this.timeDisplays       = document.querySelectorAll('[wt-readtime-element="display"]');
        this.text               = this.articleContainer ? this.articleContainer.innerText : "";
        this.words              = this.text.trim().split(/\s+/).length;
        this.wpm                = this.articleContainer.getAttribute("wt-readtime-words") || 225;
        this.suffix             = this.articleContainer.getAttribute('wt-readtime-suffix') || "";
        this.smallsuffix        = this.articleContainer.getAttribute('wt-readtime-smallsuffix') || "";
        this.rawTime            = this.words / this.wpm;
        this.init();
    }

    init = () => {
        if(this.timeDisplays && this.timeDisplays.length > 0) this.SetReadTime();
    }

    SetReadTime = () => {
        for(let _display of this.timeDisplays) {
            if(this.rawTime < 1 )
                _display.innerText = this.smallsuffix ? this.smallsuffix : "less than a minute.";
            else if(this.rawTime == 1 )
                _display.innerText = "a minute.";
            else
                _display.innerText = this.suffix ? `${Math.ceil(this.rawTime)} ${this.suffix}` : `${Math.ceil(this.rawTime)} minutes.`;
        }
    }
}

const InitializeReadTime = () => {
    window.webtricks = window.webtricks || [];
    let articleContainers = document.querySelectorAll('[wt-readtime-element="article"]');
    if(!articleContainers || articleContainers.length === 0) return;
    articleContainers.forEach(article => {
        let instance = new ReadTime(article);
        window.webtricks.push({'ReadTime': instance});
    });
}

if (/complete|interactive|loaded/.test(document.readyState)) {
    InitializeReadTime();
} else {
    window.addEventListener('DOMContentLoaded',InitializeReadTime )
}

// Allow requiring this module in test environments without affecting browser usage
try {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { ReadTime, InitializeReadTime };
    }
} catch {}
