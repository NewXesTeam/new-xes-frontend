import { Work } from '@/interfaces/work';
import { Emoji } from '@/interfaces/common';

export function checkLoggedIn() {
    return document.cookie.includes('is_login=1;');
}

export function getWorkLink(work: Work) {
    let lang = work.project_type;
    if (lang === 'compiler') lang = 'code';

    return `https://code.xueersi.com/home/project/detail?lang=${lang}&pid=${work.id}&version=${work.version}&langType=${work.lang}`;
}

export function getEditWorkLink(work: Work) {
    let lang = work.project_type;
    if (lang === 'scratch') {
        return `https://code.xueersi.com/scratch3/index.html?pid=${work.id}&version=3.0&env=community`;
    } else {
        return `https://code.xueersi.com/ide/code/${work.id}`;
    }
}

export function processEmojiReplace(text: string, emojis: Emoji[]) {
    let content = text;
    if (emojis.length !== 0) {
        for (let i = 0; i < emojis.length; i++) {
            content = content.replace(
                emojis[i].id,
                `<img alt="${emojis[i].id}" style="width: 24px; height: 24px; margin: 0 2px" src="${emojis[i].url}">`,
            );
        }
    }
    return content;
}

export function b64_to_utf8(str: string) {
    return decodeURIComponent(escape(window.atob(str)));
}