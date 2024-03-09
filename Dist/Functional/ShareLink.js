'use strict'

const CheckNodelist = (arr) => {
    return (arr && arr.length !== 0);
}

const SetLinks = (_arr, link) => {
    for(let elem of _arr) {
        elem.setAttribute("href", link );
        elem.setAttribute("target", '_blank');
    }
}

const SetShareLinks = () => {
    let title           = document.title;
    let url             = window.location.href;
    let unencodedURI    = `${url}&title='${title}'&description='${title}'`;
    let encoded         = encodeURI(unencodedURI);

    let social_fb       = document.querySelectorAll('[wt-share-element="facebook"]');
    let social_tw       = document.querySelectorAll('[wt-share-element="twitter"]');
    let social_ln       = document.querySelectorAll('[wt-share-element="linkedin"]');
    let social_wp       = document.querySelectorAll('[wt-share-element="whatsapp"]'); 
    let social_pi       = document.querySelectorAll('[wt-share-element="pinterest"]'); 
    let social_red      = document.querySelectorAll('[wt-share-element="reddit"]');  
    let social_cp       = document.querySelectorAll('[wt-share-element="copy"]');

    if (CheckNodelist(social_fb)) {
        SetLinks(social_fb,`https://www.facebook.com/sharer/sharer.php?u=${encoded}`);
    }
    if (CheckNodelist(social_tw)) {
        SetLinks(social_tw,`https://twitter.com/share?url=${encoded}`);
    }
    if (CheckNodelist(social_ln)) {
        SetLinks(social_ln,`https://www.linkedin.com/shareArticle?mini=true&url='${encoded}`);
    }
    if (CheckNodelist(social_wp)) {
        SetLinks(social_wp,`https://wa.me/?text=${encoded}`);
    }
    if (CheckNodelist(social_pi)) {
        SetLinks(social_pi,`http://pinterest.com/pin/create/button/?url=${encoded}`);
    }
    if (CheckNodelist(social_red)) {
        SetLinks(social_red,`http://www.reddit.com/submit?url=${encoded}`);
    } 
    if (CheckNodelist(social_cp)) {
        for(let btn of social_cp) {
            btn.addEventListener('click', () => navigator.clipboard.writeText(`${url}`));
        }
    }
}

window.addEventListener('DOMContentLoaded', SetShareLinks());