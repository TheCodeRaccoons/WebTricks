'use strict'

if(!Webflow) {
    var Webflow = Webflow || [];
}

Webflow.push(function () {
    //Allow site to load in case there's any extra integrations that require it
    setTimeout(function () {

        let tabsComponent = document.querySelectorAll("[wt-tabSlider-element='tabs']");

        if (tabsComponent) {
            tabsComponent.forEach(tabs => {
                
                let timeout = tabs.getAttribute("wt-tabSlider-speed") || 5000;
                let tabBtns = tabs.querySelector("[wt-tabSlider-element='menu']");
                var tb = Array.from(tabBtns.children); 
                let activeElement = document.activeElement;

                const tabLoop = (tm, timeout) => {
                    tabTimeout = setTimeout(setTabTimeout, timeout, tm); // 5 Second Rotation
                }

                const setTabTimeout = (tm) => {
                    var $next = tm.querySelector(".w--current").nextElementSibling;
                    if ($next) {
                        $next.click(); // user click resets timeout
                    } else {
                        tm.firstChild.click();
                    }
                    if(activeElement.nodeName === "INPUT"){
                        activeElement.focus();
                        activeElement.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 40}));
                    }
                }

                // Fix for Safari
                if (navigator.userAgent.includes("Safari")) {
                    tb.forEach((t) => (t.focus = function () {
                        const x = window.scrollX, y = window.scrollY;const f = () => {
                            setTimeout(() => window.scrollTo(x, y), 1);
                            t.removeEventListener("focus", f)};
                            t.addEventListener("focus", f);
                            HTMLElement.prototype.focus.apply(this, arguments)
                        })
                    );
                }
                
                // Reset Loops
                tb.forEach(tBtn => {
                    tBtn.addEventListener('click', function (e) {
                        e.preventDefault();
                        clearTimeout(tabTimeout);
                        tabLoop(tabBtns, timeout);
                    }, false);
                })

                // Start Tabs
                var tabTimeout;
                clearTimeout(tabTimeout);
                tabLoop(tabBtns, timeout);
            })
        }
    }, 500)
});