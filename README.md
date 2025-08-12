# NewXesFrontend

> 学而思新的前端体验（第三方）

> [!WARNING]
>
> 此项目仅供交流学习，请勿他用！

## 准备开发

1. 下载项目 `git clone https://github.com/NewXesTeam/new-xes-frontend`
2. 切换到项目文件夹
3. 签出 vuetify 分支 `git checkout vuetify`
4. 安装依赖项 `npm install`

## npm 脚本

- `npm run dev` 启动开发模式
- `npm run build` 构建项目
- `npm run build-only` 构建项目，但不进行类型检查
- `npm run preview` 启动已构建的代码

- `npm run type-check` 使用 vue-tsc 类型检查
- `npm run lint` 使用 EsLint 检查代码
- `npm run format` 使用 Prettier 格式化代码

## 运行开发服务器

直接运行 `npm run dev` 即可

## 开发进度

### 功能部分

- [x] 主页 /
- [x] 登录 /login
- [ ] 发现 /discover
- [ ] 搜索 /search
- [ ] 我的作品 /user
- [x] 用户信息展示 /userInfo
- [ ] 最终用户协议（等待补充内容） /eula
- [x] 关于 /about

- [ ] 个人主页
    - [ ] 主页 /space/:userId/home
    - [ ] 封面 /space/:userId/cover
    - [ ] 作品 /space/:userId/projects
    - [ ] 收藏 /space/:userId/favourites
    - [ ] 社交 /space/:userId/social

- [ ] 消息中心
    - [ ] 评论与回复 /message/1
    - [ ] 点赞与收藏 不计划制作
    - [ ] 关注 /message/5
    - [ ] 反馈与审核 不计划制作
    - [ ] 系统消息 不计划制作

- [ ] 作品展示页面 /project
    - [ ] 作品展示
    - [ ] 评论

- [ ] 作品发布组件 ProjectPublishModal.tsx
    - [ ] 基本信息填写
    - [ ] 标签选择
    - [ ] 封面上传

### 作品部分

- [ ] 作品重定向页面 /ide /embed
- [ ] TurboWarp /ide/turbowarp /embed/turbowarp
- [ ] Python 基础 /ide/python /embed/python
- [ ] Python 海龟 /ide/webpy /embed/webpy
- [ ] Python 高阶 /ide/pygame /embed/pygame
- [ ] C++ /ide/cpp /embed/cpp

## 关于贡献

此仓库使用 GPL-3.0 许可证。

请在贡献前阅读 [贡献指南](CONTRIBUTING.md)。

若要报告安全漏洞，请阅读 [安全策略](SECURITY.md)。
