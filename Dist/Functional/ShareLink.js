'use strict';

class ShareLink {
    constructor(element) {
        if (!(element instanceof HTMLElement)) {
            throw new Error("Initialization failed: A valid HTMLElement was not provided to the constructor.");
        }

        this.element = element;
        this.platform = element.getAttribute('wt-share-element');
        this.title = document.title;
        this.url = window.location.href;

        if (!this.platform || this.platform.trim() === '') {
            console.warn('ShareLink: No platform specified for element:', element);
            return;
        }

        if (!this.url || this.url.trim() === '') {
            console.error('ShareLink: Invalid URL detected:', this.url);
            return;
        }

    this.copySuccessClass = this.element.getAttribute('wt-share-copysuccess') || null;
    this.copyErrorClass = this.element.getAttribute('wt-share-copyerror') || null;
    this.copyMessage = this.element.getAttribute('wt-share-copymessage') || null; // plain text message
    const _copyTemplateKey = this.element.getAttribute('wt-share-copytemplate') || 'copied';
    // Static cache to avoid repeated DOM queries and allow removal of source template
    if (!ShareLink._templateCache) {
        ShareLink._templateCache = Object.create(null);
    }
    if (ShareLink._templateCache[_copyTemplateKey] == null) {
        const _copyTemplateEl = document.querySelector(`[wt-share-copyelement="${_copyTemplateKey}"]`);
        if (_copyTemplateEl) {
            ShareLink._templateCache[_copyTemplateKey] = _copyTemplateEl.innerHTML;
            // Remove original template node from DOM after caching to prevent accidental display and reduce layout cost
            try { _copyTemplateEl.remove(); } catch {}
        } else {
            ShareLink._templateCache[_copyTemplateKey] = null;
        }
    }
    this.copyMessageTemplate = ShareLink._templateCache[_copyTemplateKey]; // html message from cached template element
    this.copyFailMessage = this.element.getAttribute('wt-share-copymessage-fail') || 'failed to copy'; // plain text fail

        if ( this.copyMessage || this.copyMessageTemplate || this.copySuccessClass || this.copyErrorClass) {
            this.copyResetTimer = null;
            this.isCopyLocked = false;
            this.copyTimeout = parseInt(this.element.getAttribute('wt-share-copytimeout'), 10) || 1000;
            // Provide basic screen reader feedback when message swaps occur
            this.element.setAttribute('aria-live', 'polite');
        }

        this.encoded = this.encodeURIParams();
        this.initializeShareLinks();
    }

    encodeURIParams() {
        const title = encodeURIComponent(this.title || '');
        const url = encodeURIComponent(this.url || '');
        return { title, url };
    }

    initializeShareLinks() {
        const socialSelectors = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${this.encoded.url}`,
            twitter:  `https://twitter.com/intent/tweet?url=${this.encoded.url}&text=${this.encoded.title}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${this.encoded.url}&title=${this.encoded.title}`,
            whatsapp: `https://wa.me/?text=${this.encoded.title}%20${this.encoded.url}`,
            pinterest:`https://www.pinterest.com/pin/create/button/?url=${this.encoded.url}&description=${this.encoded.title}`,
            reddit:   `https://www.reddit.com/submit?url=${this.encoded.url}&title=${this.encoded.title}`
        };

        const _link = socialSelectors[this.platform];

        if (this.platform === 'copy') {
            // Prevent accidental navigation if element is an <a>
            this.element.removeAttribute('href');
            this.element.addEventListener('click', this.handleCopyClick.bind(this));
        } else {
            if (!_link) {
                console.error(`Unknown platform: ${this.platform}`);
                return;
            }
            this.element.setAttribute("href", _link);
            this.element.setAttribute("target", "_blank");
            this.element.setAttribute("rel", "noopener noreferrer");
        }
    }

    async handleCopyClick(e) {
        e.preventDefault();

        if (this.isCopyLocked) return;
        this.isCopyLocked = true;

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(this.url);
                this.triggerCopyChange();
            } else {
                this.copyFallback(this.url);
            }
        } catch (error) {
            console.warn('ShareLink: Clipboard API failed, using fallback:', error);    
            this.copyFallback(this.url);
        } finally {
            setTimeout(() => (this.isCopyLocked = false), 300);
        }
    }

    /** Fallback method for copying text in unsupported environments
     * @param {string} text - The text to be copied to the clipboard
     * @deprecated Use navigator.clipboard API where possible, this is only for legacy support
     * and will be removed in future versions.
     */
    copyFallback(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        // Use off-screen positioning to ensure selection works across browsers
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:absolute;left:-9999px;top:0;opacity:0;';
        document.body.appendChild(ta);
        ta.select();
        try { ta.setSelectionRange(0, ta.value.length); } catch {}
        try {
            const ok = document.execCommand('copy');
            ok ? this.triggerCopyChange() : this.triggerCopyChange(true);
        } catch {
            this.triggerCopyChange(true);
        }
        document.body.removeChild(ta);
    }

    triggerCopyChange(error = false) {
        // Preserve original content across repeated triggers until reset
        if (this._copyOriginalHTML == null) {
            this._copyOriginalHTML = this.element.innerHTML;
        }

        if (this.copyResetTimer) clearTimeout(this.copyResetTimer);

        // Prefer HTML from external template element when provided, fallback to plain text attributes
        const successContent = this.copyMessageTemplate != null ? this.copyMessageTemplate : this.copyMessage;
        const failContent = this.copyFailMessage; // Only plain text fail for now
        if (error) {
            // Fail path uses plain text to avoid accidental HTML execution
            this.element.textContent = failContent ?? '';
        } else if (successContent) {
            this.element.innerHTML = successContent;
        }

        if (this.copySuccessClass && !error) {
            this.element.classList.add(this.copySuccessClass);
        }
        if (this.copyErrorClass && error) {
            this.element.classList.add(this.copyErrorClass);
        }

        // Dispatch a custom event for integrations/analytics
        try {
            this.element.dispatchEvent(new CustomEvent('sharelink:copy', {
                bubbles: true,
                detail: { success: !error, url: this.url, platform: 'copy' }
            }));
        } catch {}

        this.copyResetTimer = setTimeout(() => {
            if (!this.element.isConnected) return;
            if (this._copyOriginalHTML != null) {
                this.element.innerHTML = this._copyOriginalHTML;
            }
            if (this.copySuccessClass && !error) {
                this.element.classList.remove(this.copySuccessClass);
            }
            if (this.copyErrorClass && error) {
                this.element.classList.remove(this.copyErrorClass);
            }
            this.copyResetTimer = null;
            this._copyOriginalHTML = null;
        }, this.copyTimeout);
    }
}

function InitializeShareLink() {
    window.webtricks = window.webtricks || [];
    const links = document.querySelectorAll("[wt-share-element]");
    if (!links || links.length === 0) return;

    links.forEach(link => {
        // Check if element already has a ShareLink instance
        if (link._shareLinkInstance) {
        console.warn('ShareLink: Element already initialized, skipping:', link);
        return;
        }

        try {
        const instance = new ShareLink(link);
        if (instance.platform) { // Only add if platform was valid
            link._shareLinkInstance = instance;
            window.webtricks.push({ 'ShareLink': instance });
        }
        } catch (error) {
        console.error('ShareLink: Failed to initialize element:', link, error);
        }
    });
}

// Execute InitializeShareLink when the DOM is fully loaded
if (/complete|interactive|loaded/.test(document.readyState)) {
    InitializeShareLink();
} else {
    window.addEventListener('DOMContentLoaded', InitializeShareLink);
}

// Allow requiring this module in test environments without affecting browser usage
try {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { ShareLink, InitializeShareLink };
    }
} catch {}
