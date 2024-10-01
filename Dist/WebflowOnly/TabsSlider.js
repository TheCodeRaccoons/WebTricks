'use strict'

if (!Webflow) {
    var Webflow = Webflow || [];
}

class TabsSlider {
    constructor(_tabs) {
        try {
            this.tabsComponent = _tabs;
            this.timeout = _tabs.getAttribute("wt-tabslider-speed") || 5000;
            this.tabBtns = _tabs.querySelector("[wt-tabslider-element='menu']");
            if (!this.tabBtns) throw new Error("Tab buttons menu not found.");

            this.tb = Array.from(this.tabBtns.children) || [];
            if (!this.tb.length) throw new Error("No tab buttons found.");

            this.activeElement = null;
            this.tabTimeout = null;
            this.paused = false;
            this.debounceTimeout = null;
            this.init();
        } catch (err) {
            console.error("TabsSlider initialization failed: ", err.message);
        }
    }

    init() {
        Webflow.push(() => {
            try {
                this.activeElement = document.activeElement;

                // Handle hover pause functionality
                const pauseOnHover = this.tabsComponent.getAttribute("wt-tabslider-pauseonhover") === "true";
                if (pauseOnHover) {
                    this.tabsComponent.addEventListener("mouseover", this.debounce(this.pauseSlider.bind(this), 100));
                    this.tabsComponent.addEventListener("mouseout", this.debounce(this.resumeSlider.bind(this), 100));
                }

                // Safari fix
                if (navigator.userAgent.includes("Safari")) {
                    this.tb.forEach(t => (t.focus = this.preventScroll.bind(this, t)));
                }

                this.tb.forEach(tBtn => {
                    tBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        clearTimeout(this.tabTimeout);
                        this.tabLoop();
                    });
                });

                this.tabLoop();
            } catch (err) {
                console.error("TabsSlider initialization error: ", err.message);
            }
        });
    }

    preventScroll(t) {
        const x = window.scrollX, y = window.scrollY;
        const f = () => {
            setTimeout(() => window.scrollTo(x, y), 1);
            t.removeEventListener("focus", f);
        };
        t.addEventListener("focus", f);
        HTMLElement.prototype.focus.apply(t, arguments);
    }

    tabLoop() {
        if (!this.paused) {
            this.tabTimeout = setTimeout(this.setTabTimeout.bind(this), this.timeout, this.tabBtns);
        }
    }

    setTabTimeout(tm) {
        try {
            var $next = tm.querySelector(".w--current").nextElementSibling;
            if ($next) {
                $next.click();
            } else {
                tm.firstChild.click();
            }
            if (this.activeElement && this.activeElement.nodeName === "INPUT") {
                this.activeElement.focus();
                this.activeElement.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 40 }));
            }
        } catch (err) {
            console.error("Tab loop error: ", err.message);
        }
    }

    pauseSlider() {
        clearTimeout(this.tabTimeout);
        this.paused = true;
    }

    resumeSlider() {
        this.paused = false;
        this.tabLoop();
    }

    debounce(func, wait) {
        return (...args) => {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
}

const InitializeTabsSlider = () => {
    try {
        window.trickeries = window.trickeries || [];
        let tabsComponents = document.querySelectorAll("[wt-tabslider-element='tabs']");
        if (!tabsComponents || tabsComponents.length === 0) throw new Error("No tabs components found.");

        tabsComponents.forEach(tabsComponent => {
            let instance = new TabsSlider(tabsComponent);
            window.trickeries.push({ 'TabsSlider': instance });
        });
    } catch (err) {
        console.error("InitializeTabsSlider error: ", err.message);
    }
}

if (/complete|interactive|loaded/.test(document.readyState)) {
    InitializeTabsSlider();
} else {
    window.addEventListener('DOMContentLoaded', InitializeTabsSlider);
}
