# NewXesFrontend

> 学而思新的前端体验（第三方）

> [!WARNING]
> 此项目仅供交流学习，请勿他用！

> [!WARNING]
> 这是使用 React 重写的 NewXesFrontend
>
> 欲查看原来的*屎山* NewXesFrontend，请访问 [NewXesTeam/Archived-NewXesFrontend](https://github/NewXesTeam/Archived-NewXesFrontend)

## npm 脚本

- `npm run build:dev` 构建项目（开发模式）
- `npm run build:prod` 构建项目（生产模式）
- `npm run prettier` 使用 Prettier 格式化代码

## 运行开发服务器

1. 下载 nginx
2. 复制 nginx 到根目录。_注意不要把 `conf/nginx.conf` 给覆盖了！！！_
3. 运行 nginx。（请先构建后再运行）
4. 访问 `http://127.0.0.1:8080`

## 关于使用

您可以直接使用我们提供的 登录功能 进行登录。

## 开发进度

### 功能部分

- [x] 主页 /index.html
- [x] 登录 /login.html
- [x] 发现 /discover.html
- [ ] 搜索 /search.html
- [x] 我的作品 /user.html
- [x] 用户信息展示 /userInfo.html
- [ ] 最终用户协议（等待补充内容） /eula.html
- [x] 关于 /about.html

- [x] 个人主页 /space.html

    - [x] 主页
    - [x] 封面
    - [x] 作品
    - [x] 收藏
    - [x] 社交

- [ ] 消息中心 /messages.html

    - [x] 评论与回复
    - [ ] 点赞与收藏
    - [x] 关注
    - [ ] 反馈与审核
    - [ ] 系统消息

- [ ] 作品展示页面 /project.html

    - [ ] 作品展示
    - [ ] 评论

- [ ] 作品发布组件 ProjectPublishModal.tsx
    - [x] 基本信息填写
    - [ ] 标签选择
    - [ ] 封面上传

### 作品部分

- [ ] 作品重定向页面 /ide.html /embed.html
- [ ] TurboWarp /ide/turbowarp.html /embed/turbowarp.html
- [ ] Python 基础 /ide/python.html /embed/python.html
- [ ] Python 海龟 /ide/webpy.html /embed/webpy.html
- [ ] Python 高阶 /ide/pygame.html /embed/pygame.html
- [ ] C++ /ide/cpp.html /embed/cpp.html

## 关于贡献

此仓库使用 GPL-3.0 许可证。

请在贡献前阅读 [贡献指南](CONTRIBUTING.md)。

若要报告安全漏洞，请阅读 [安全策略](SECURITY.md)。
