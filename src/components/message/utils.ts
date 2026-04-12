import { Emoji, Link } from '@/types/common';

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

export function processLinkReplace(text: string, links: Link[]) {
    if (links === null || links === undefined) return text;
    let content = text;
    if (links.length !== 0) {
        for (let i = 0; i < links.length; i++) {
            content = content.replace(links[i].link, `<a href="${links[i].link}" target="_blank">${links[i].text}</a>`);
        }
    }
    return content;
}
