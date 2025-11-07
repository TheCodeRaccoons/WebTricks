'use strict';

class ShareLink {
    constructor(element) {
        this.element = element;
        this.platform = element.getAttribute('wt-share-element');
        this.title = document.title;
        this.url = window.location.href;
        this.encoded = this.encodeURIParams();
        this.initializeShareLinks();
    }

    encodeURIParams() {
        let unencodedURI = `${this.url}&title='${this.title}'&description='${this.title}'`;
        return encodeURI(unencodedURI);
    }

    initializeShareLinks() {
        const socialSelectors = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${this.encoded}`,
            twitter: `https://twitter.com/share?url=${this.encoded}`,
            linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${this.encoded}`,
            whatsapp: `https://wa.me/?text=${this.encoded}`,
            pinterest: `https://pinterest.com/pin/create/button/?url=${this.encoded}`,
            reddit: `https://www.reddit.com/submit?url=${this.encoded}`
        };

        let _link = socialSelectors[this.platform];
        if(!_link && !this.platform) return; // handle errors if the platform has issues

        // just made a small twick to the orginal code Copies the URL to clipboard. Shows Copied! right after clicking. Reverts to the original text after 1.5 seconds and displays an alert popup saying Link copied to clipboard!

        if (this.platform === 'copy') {
            this.element.addEventListener('click', () => {
                navigator.clipboard.writeText(`${this.url}`);
                const originalText = this.element.innerText;
                this.element.innerText = 'Copied!';
                alert('Link copied to clipboard!');
                setTimeout(() => {
                    this.element.innerText = originalText;
                }, 1500);
            });
        } else {
            this.element.setAttribute("href", _link);
            this.element.setAttribute("target", "_blank");
        }
    }
}

const InitializeShareLink = () => {
    window.webtricks = window.webtricks || [];
    let links = document.querySelectorAll("[wt-share-element]");
    if (!links || links.length === 0) return;

    links.forEach(link => {
        let instance = new ShareLink(link);
        window.webtricks.push({'ShareLink': instance });
    });
};

// Execute InitializeShareLink when the DOM is fully loaded
if (/complete|interactive|loaded/.test(document.readyState)) {
    InitializeShareLink();
} else {
    window.addEventListener('DOMContentLoaded', InitializeShareLink);
}
