import type { Work } from '@/interfaces/work';
import type { Emoji } from '@/interfaces/common';

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
                `<img alt="${emojis[i].id.replace('[', '').replace(']', '')}" style="width: 24px; height: 24px; margin: 0 2px" src="${emojis[i].url}">`,
            );
        }
    }
    return content;
}

export function b64_to_utf8(text: string): string {
    return new TextDecoder().decode(Uint8Array.from(atob(text), c => c.charCodeAt(0)));
}

export async function getTemplate(lang: string) {
    const response = await fetch('https://v1.hitokoto.cn/');
    const responseData = await response.json();
    const templates = {
        python: `print("${responseData.hitokoto} —— 「${responseData.from}」")`,
        webpy: `print("${responseData.hitokoto} —— 「${responseData.from}」")`,
        offlinepy: `print("${responseData.hitokoto} —— 「${responseData.from}」")`,
        cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "${responseData.hitokoto} —— 「${responseData.from}」" << endl;
    return 0;
}`,
    };
    // @ts-ignore  // TODO: fix this type error
    return templates[lang];
}
