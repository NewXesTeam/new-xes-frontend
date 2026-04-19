# NewXesFrontend

> 学而思新的前端体验（第三方）

> [!WARNING]
>
> 此项目仅供交流学习，请勿他用！

## 准备开发

1. 下载项目 `git clone https://github.com/NewXesTeam/new-xes-frontend`
2. 切换到项目文件夹
3. 安装依赖项 `npm install`

## npm 脚本

- `npm run build` 构建项目（生产模式）
- `npm run dev` 启动开发模式（注意没有配置 vite 的反向代理）
- `npm run preview` 启动已构建的代码

- `npm run format` 使用 Prettier 格式化代码

## 运行开发服务器

直接运行 `npm run dev` 即可

## 开发进度

### 功能部分

- [x] 主页 /
- [x] 登录 https://login.xueersi.com
- [x] 发现 /search
- [x] 搜索 /search-center
- [x] 我的作品 /user
- [x] 用户信息展示 /userInfo
- [ ] 最终用户协议（等待补充内容） /eula
- [x] 关于 /about

- [x] 个人主页
    - [x] 主页 /space/:userId/?tab=home
    - [x] 封面 /space/:userId/?tab=cover
    - [x] 作品 /space/:userId/?tab=projects
    - [x] 收藏 /space/:userId/?tab=favourites
    - [x] 社交 /space/:userId/?tab=social

- [x] 消息中心
    - [x] 评论与回复 /message/1
    - [x] 关注 /message/5

- [ ] 作品展示页面 /project
    - [ ] 作品展示
    - [ ] 评论

- [x] 作品发布组件 ProjectPublishModal.tsx
    - [x] 基本信息填写
    - [x] 标签选择
    - [x] 封面上传

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
