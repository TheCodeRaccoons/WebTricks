'use strict'

class CookieConsent {
    constructor(cookieBanner, config = {
        cookieExpiryDays: 90
    }) {
        this.cookieBanner = cookieBanner;
        this.acceptAllButton = this.cookieBanner.querySelectorAll('[wt-cookieconsent-element="accept-all"]');
        this.acceptNecessaryButton = this.cookieBanner.querySelector('[wt-cookieconsent-element="accept-necessary"]');
        this.manageCookiesButton = document.querySelector('[wt-cookieconsent-element="manage-cookies"]');
        this.cookieExpiryDays = config.cookieExpiryDays;
        this.consentGiven = false;
        this.initialize();
    }

    initialize() {
        if (!this.getCookie('cookieConsent')) {
            this.cookieBanner.style.display = 'block';
            this.addEventListeners();
        } else {
            this.consentGiven = true;
            this.cookieBanner.remove();
            this.loadConsentScripts();
        }

        if (this.manageCookiesButton) {
            this.manageCookiesButton.addEventListener('click', () => this.manageCookies());
        }
    }

    addEventListeners() {
        if(this.acceptAllButton && this.acceptAllButton.length) {
            for(let acceptBtn of this.acceptAllButton) {
                acceptBtn.addEventListener('click', () => this.acceptAllCookies());
            }
        }

        if(this.acceptNecessaryButton) {
            this.acceptNecessaryButton.addEventListener('click', () => this.acceptNecessaryCookies());
        }
    }

    acceptAllCookies() {
        this.setCookie('cookieConsent', 'all', this.cookieExpiryDays);
        this.consentGiven = true;
        this.cookieBanner.remove();
        this.loadConsentScripts();
    }

    acceptNecessaryCookies() {
        this.setCookie('cookieConsent', 'necessary', this.cookieExpiryDays);
        this.consentGiven = true;
        this.cookieBanner.remove();
        this.loadConsentScripts();
    }

    manageCookies() {
        // Logic to open a modal or menu to manage cookie preferences.
        this.cookieBanner.style.display = 'block';
    }

    setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = 'expires=' + date.toUTCString();
        document.cookie = `${name}=${value}; ${expires}; path=/`;
    }

    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    loadConsentScripts() {
        const consentStatus = this.getCookie('cookieConsent');
        const consentScripts = document.querySelectorAll('script[wt-cookieconsent-script]');
        consentScripts.forEach(script => {
            const scriptType = script.getAttribute('wt-cookieconsent-script');
            if (consentStatus === 'all' || (consentStatus === 'necessary' && scriptType === 'necessary')) {
                if (!script.dataset.loaded) {
                    if (!script.src) {
                        // Inline script
                        const inlineScript = document.createElement('script');
                        inlineScript.textContent = script.textContent;
                        document.head.appendChild(inlineScript);
                    } else {
                        // External script
                        const externalScript = document.createElement('script');
                        externalScript.src = script.src;
                        externalScript.async = script.async;
                        externalScript.defer = script.defer;
                        document.head.appendChild(externalScript);
                    }
                    script.dataset.loaded = 'true'; // Mark script as loaded
                }
                script.remove(); // Remove original script to prevent duplicate loading
            }
        });
    }
}

const InitializeCookieConsent = () => {
    window.trickeries = window.trickeries || [];
    const cookieBanner = document.querySelector('[wt-cookieconsent-element="banner"]');
    if (cookieBanner) {
        let instance = new CookieConsent(cookieBanner);
        window.trickeries.push({
            'CookieConsent': instance
        });
    }
};

if (/complete|interactive|loaded/.test(document.readyState)) {
    InitializeCookieConsent();
} else {
    window.addEventListener('DOMContentLoaded', InitializeCookieConsent);
}