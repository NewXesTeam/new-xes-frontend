import { Work } from '@/interfaces/work';

export function checkLoggedIn() {
    return document.cookie.includes('is_login=1;');
}

export function getWorkLink(work: Work) {
    let lang: 'scratch' | 'compiler' | 'code' = work.project_type;
    if (lang === 'compiler') lang = 'code';

    return `https://code.xueersi.com/home/project/detail?lang=${lang}&pid=${work.id}&version=${work.version}&langType=${work.lang}`;
}
