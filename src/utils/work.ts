import type { Work } from '../types/work';

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
