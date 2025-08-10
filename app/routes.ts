import { type RouteConfig, index, route, prefix } from '@react-router/dev/routes';

export default [
    index('routes/home.tsx'),
    route('login', 'routes/login.tsx'),

    route('discover', 'routes/discover.tsx'),
    route('search', 'routes/search.tsx'),

    route('user', 'routes/user.tsx'),
    route('space/:userId/:tabName', 'routes/space.tsx'),
    route('message/:category_id', 'routes/message.tsx'),

    route('userInfo', 'routes/userInfo.tsx'),
    route('eula', 'routes/eula.tsx'),
    route('about', 'routes/about.tsx'),

    // TODO: 干掉xterm破webpack！！！！！！！！！！！！！！！！！！！！！！！！
    ...prefix('ide', [
        route('cpp/:workId', 'routes/ide/cpp.tsx'),
        //     route('python', 'routes/ide/python.tsx'),
    ]),

    ...prefix('embed', [
        route('cpp/:workId', 'routes/embed/cpp.tsx'),
        route('python/:workId', 'routes/embed/python.tsx'),
    ]),
] satisfies RouteConfig;
