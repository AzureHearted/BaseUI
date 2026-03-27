![](https://user-images.githubusercontent.com/35118149/213958815-794959eb-834e-4fb6-a0f8-f17b8cdad55f.svg)

# vue3-ui-lib-template (基于 [coliste](https://github.com/skhrvg/coliste) 修改的版本)

这是一个用于创建简单组件库的起始模板，基于 [Vue3](https://vuejs.org/)、
[TypeScript](https://www.typescriptlang.org/)、[pnpm](https://pnpm.io/)、[Vite](https://vitejs.dev/)
以及 [ESLint](https://eslint.org/) —— 这些都是 Vue 社区中最受欢迎的工具。

## 开发者体验

- 你无需为了在示例应用中查看效果而反复手动构建组件库（已包含 playground 示例包）。该 monorepo 提供一个命令即可同时启动组件库和示例应用的监听模式（watch mode）。
- 无需使用 Prettier 或其他代码格式化工具。ESLint 已被[配置](https://github.com/antfu/eslint-config)为自动修复所有代码风格问题。只需在你的 IDE 中开启 `Run eslint --fix on save`。
- 磁盘空间不再是问题。pnpm 使用硬链接来存储依赖，因此无需每次都重新下载。
- 组件库已配置好类型提示（IntelliSense），无论是在示例应用中还是发布后都可使用。你可以获得 props、events 和 slots 的完整类型提示。

## 安装

1. 使用该模板创建一个新的仓库并克隆到本地
2. 将所有 `base-ui` 替换为你的库名称
3. 修改 `library/package.json` 中的元信息（如 author、description 等）为你自己的内容
4. 使用你自己的许可证替换 `LICENSE` 文件
5. 在你的 IDE 中启用 `Run eslint --fix on save`
6. 安装依赖

   ```shell
   pnpm i
   ```

7. 启动示例应用并以监听模式构建组件库

   ```shell
   pnpm dev
   ```

## 使用

- 将你的组件添加到 `library/src/components` 目录
- 在 `library/src/index.ts` 中导出这些组件
- 在示例应用 `playground/src/App.vue` 中进行调试和使用

## 发布

1. 如果 `pnpm dev` 正在运行，请先停止
2. 在 `library/package.json` 中提升版本号
3. 构建组件库

   ```shell
   pnpm library:build
   ```

4. 发布组件库到 npm

   ```shell
   pnpm library:publish
   ```

## 目录结构

```
.
├── library/                    组件库包
│   ├── dist/                   构建输出
│   │   └── ...
│   ├── node_modules/
│   │   └── ...
│   ├── src/
│   │   ├── components/         你的组件
│   │   │   └── ...
│   │   └── index.ts            组件库入口
│   ├── env.d.ts
│   ├── package.json            组件库包元数据
│   ├── tsconfig.json
│   └── vite.config.ts
├── node_modules/
│   └── ...
├── playground/                 示例应用
│   ├── node_modules/
│   │   └── ...
│   ├── src/
│   │   ├── assets/
│   │   │   └── main.css        示例应用全局样式
│   │   ├── App.vue             在这里调试你的组件
│   │   └── main.ts             示例应用入口
│   ├── env.d.ts
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── .editorconfig
├── .gitignore
├── .npmrc
├── eslint.config.js
├── LICENSE
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── README.md
```

## License

[MIT](https://choosealicense.com/licenses/mit/) 2023-present Gleb Sakharov
