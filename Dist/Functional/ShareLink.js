'use strict';
class ShareLink {
    constructor(element) {
        if (!(element instanceof HTMLElement)) {
            throw new Error("Initialization failed: A valid HTMLElement was not provided to the constructor.");
        }
        this.element = element;
        console.log("Component created successfully with element:", this.element);
        this.platform = element.getAttribute('wt-share-element');

        // Internal state for idempotent UI resets
        this._copyResetTimer = null;
        this._isCopyLocked = false;

        // Validate platform attribute
        if (!this.platform || this.platform.trim() === '') {
            console.warn('ShareLink: No platform specified for element:', element);
            return;
        }

        this.title = document.title;
        this.url = window.location.href;

        // Validate URL
        if (!this.url || this.url.trim() === '') {
            console.error('ShareLink: Invalid URL detected:', this.url);
            return;
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
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${this.encoded.url}`,
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

        // Optional short lock to avoid spam clicks
        if (this._isCopyLocked) return;
        this._isCopyLocked = true;

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(this.url);
                this.showCopySuccess();
            } else {
                // Fallback for HTTP / older browsers
                this.copyFallback(this.url);
            }
        } catch (error) {
            this.copyFallback(this.url);
        } finally {
            // Re-enable quickly; adjust if you want a longer cooldown
            setTimeout(() => (this._isCopyLocked = false), 300);
        }
    }

    copyFallback(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try {
            const ok = document.execCommand('copy');
            ok ? this.showCopySuccess() : this.showCopyError();
        } catch {
            this.showCopyError();
        }
        document.body.removeChild(ta);
    }

    showCopySuccess() {
        const originalText = this.element.textContent;
        const originalStyle = this.element.style.cssText;

        // Clear any previous pending reset so timers don't stack
        if (this._copyResetTimer) clearTimeout(this._copyResetTimer);

        // Update UI and temporarily disable clicks
        this.element.textContent = '✓ Copied!';
        this.element.style.cssText = `
            background-color: #4caf50 !important;
            color: white !important;
            border-color: #4caf50 !important;
            transform: scale(1.05);
            transition: all 0.3s ease;
            pointer-events: none;
        `;

        this.showTemporaryMessage('Link copied to clipboard!', 'success');

        // Single reset scheduled from the most recent click only
        this._copyResetTimer = setTimeout(() => {
            this.element.textContent = originalText;
            this.element.style.cssText = originalStyle;
            this._copyResetTimer = null;
        }, 1000);
    }

    showCopyError() {
        const originalText = this.element.textContent;
        const originalStyle = this.element.style.cssText;

        if (this._copyResetTimer) clearTimeout(this._copyResetTimer);

        this.element.textContent = '✗ Failed';
        this.element.style.cssText = `
            background-color: #f44336 !important;
            color: white !important;
            border-color: #f44336 !important;
            transform: scale(1.05);
            transition: all 0.3s ease;
            pointer-events: none;
        `;

        this.showTemporaryMessage('Copy failed - showing manual copy option', 'error');
        window.prompt('Copy this link manually:', this.url);

        this._copyResetTimer = setTimeout(() => {
            this.element.textContent = originalText;
            this.element.style.cssText = originalStyle;
            this._copyResetTimer = null;
        }, 1000);
    }

    showTemporaryMessage(message, type) {
        // Remove any existing message
        const existingMessage = document.querySelector('.sharelink-message');
        if (existingMessage) existingMessage.remove();

        // Create new message element
        const messageDiv = document.createElement('div');
        messageDiv.className = 'sharelink-message';
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;

        // Set background color based on type
        messageDiv.style.backgroundColor = (type === 'success') ? '#4caf50' : '#f44336';

        document.body.appendChild(messageDiv);

        // Animate in
        setTimeout(() => { messageDiv.style.transform = 'translateX(0)'; }, 10);

        // Remove after 2 seconds
        setTimeout(() => {
            messageDiv.style.transform = 'translateX(100%)';
            setTimeout(() => { if (messageDiv.parentNode) messageDiv.remove(); }, 300);
        }, 2000);
    }

    // Cleanup method for proper memory management
    destroy() {
        if (this.element && this.platform === 'copy') {
            // Remove event listeners by cloning the element
            const newElement = this.element.cloneNode(true);
            this.element.parentNode.replaceChild(newElement, this.element);
        }

        // Remove from global array if it exists
        if (window.webtricks) {
            const index = window.webtricks.findIndex(item => item.ShareLink === this);
            if (index > -1) {
                window.webtricks.splice(index, 1);
            }
        }
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
