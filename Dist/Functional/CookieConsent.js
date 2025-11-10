'use strict';

class CookieConsent {
    constructor(cookieBanner, config = { cookieExpiryDays: 90 }) {
        this.cookieBanner = cookieBanner;
        this.acceptAllButtons = this.cookieBanner.querySelectorAll('[wt-cookieconsent-element="accept-all"]');
        this.acceptNecessaryButton = this.cookieBanner.querySelector('[wt-cookieconsent-element="accept-necessary"]');
        this.manageCookiesButton = document.querySelector('[wt-cookieconsent-element="manage-cookies"]');
        this.categoriesForm = this.cookieBanner.querySelector('[wt-cookieconsent-element="categories-form"]');

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
        if (this.acceptAllButtons && this.acceptAllButtons.length) {
            this.acceptAllButtons.forEach(btn => {
                btn.addEventListener('click', () => this.acceptAllCookies());
            });
        }

        if (this.acceptNecessaryButton) {
            this.acceptNecessaryButton.addEventListener('click', () => this.acceptNecessaryCookies());
        }

        if (this.categoriesForm) {
            this.categoriesForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCategoryFormSubmit();
            });
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

    handleCategoryFormSubmit() {
        let chosenCategories = [];
        const checkboxes = this.categoriesForm.querySelectorAll('[wt-cookieconsent-category]');

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const category = checkbox.getAttribute('wt-cookieconsent-category');
                chosenCategories.push(category);
            }
        });

        if (!chosenCategories.includes('necessary')) {
            chosenCategories.unshift('necessary');
        }

        const finalValue = chosenCategories.join(',');
        this.setCookie('cookieConsent', finalValue, this.cookieExpiryDays);
        this.consentGiven = true;
        this.cookieBanner.remove();
        this.loadConsentScripts();
    }

    manageCookies() {
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
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
    }

    loadConsentScripts() {
        const consentValue = this.getCookie('cookieConsent') || '';

        let consentCategories = [];
        if (consentValue === 'all') {
            consentCategories = ['all'];
        } else {
            consentCategories = consentValue
                .split(',')
                .map(val => val.trim())
                .filter(Boolean);
        }

        // Handle Facebook pixel consent if analytics or all is accepted
        if (consentCategories.includes('all') || consentCategories.includes('analytics')) {
            window.localStorage.setItem('fbGrantConsent', 'true');
            if (typeof window.fbq === 'function') {
                window.fbq('consent', 'grant');
            }
        }

        const consentScripts = document.querySelectorAll('script[wt-cookieconsent-script]');
        consentScripts.forEach(originalScript => {
            const scriptCategory = originalScript.getAttribute('wt-cookieconsent-script');

            if (
                consentCategories.includes('all') ||
                consentCategories.includes(scriptCategory) ||
                scriptCategory === 'necessary'
            ) {
                this.injectScript(originalScript);
            }
        });
    }

    injectScript(originalScript) {
        if (originalScript.dataset.loaded === 'true') return;

        const newScript = document.createElement('script');
        
        if (!originalScript.src) {
            newScript.textContent = originalScript.textContent;
        } else {
            newScript.src = originalScript.src;
            newScript.async = originalScript.async;
            newScript.defer = originalScript.defer;
        }

        newScript.type = 'text/javascript';
        document.head.appendChild(newScript);

        originalScript.dataset.loaded = 'true';
        originalScript.remove();
    }
}

const InitializeCookieConsent = () => {
    window.webtricks = window.webtricks || [];
    const cookieBanner = document.querySelector('[wt-cookieconsent-element="banner"]');
    if (cookieBanner) {
        let instance = new CookieConsent(cookieBanner);
        window.webtricks.push({ 'CookieConsent': instance });
    }
};

if (/complete|interactive|loaded/.test(document.readyState)) {
    InitializeCookieConsent();
} else {
    window.addEventListener('DOMContentLoaded', InitializeCookieConsent);
}

// Allow requiring this module in test environments
try {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { CookieConsent, InitializeCookieConsent };
    }
} catch {}
