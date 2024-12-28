# 公司信息表单项目

这是一个使用 Next.js 和 TypeScript 开发的公司信息收集表单项目。

## 功能特点

- 公司基本信息收集
- 实时表单验证
- 动态载重选项
- 响应式设计

## 运行效果

### 终端运行界面

![终端运行界面](docs/terminal-screenshot.png)

### 表单界面

![表单界面](docs/form-screenshot.png)

## 技术栈

- Next.js 14.1.0
- TypeScript
- React Hook Form
- Zod 表单验证
- Tailwind CSS
- shadcn/ui 组件库

## 快速开始

1. 安装依赖：
```bash
make install
```

2. 启动项目：
```bash
make
```

服务器将在 http://localhost:3000 启动。

## 表单字段说明

- **公司名称**: 必填项
- **电话号码**: 必须是有效的国际电话号码（如：+86xxxxxxxxxx）
- **分机号**: 可选项，必须是数字
- **公司地址**: 必填项
- **服务地址**: 可选项，如果与公司地址相同可以留空
- **产品类型**: 三选一
  - 客梯
  - 自动扶梯
  - 自动人行道
- **载重**: 根据产品类型动态显示不同选项
  - 客梯：630kg、1000kg、1250kg
  - 其他：1000kg、2000kg
- **初期款认选项**: 必须是数字
- **新期款认选项**: 必须是数字

## 开发说明

### 项目结构

```
项目根目录
├── app/                    # Next.js 应用主目录
│   ├── layout.tsx         # 全局布局文件
│   ├── page.tsx           # 主页面
│   └── globals.css        # 全局样式
├── components/            # 组件目录
│   ├── company-form.tsx   # 公司表单组件
│   └── ui/               # UI 组件
├── lib/                   # 工具函数
├── docs/                  # 文档和截图
└── public/               # 静态资源
```

### 命令说明

- `make install`: 安装项目依赖
- `make`: 启动开发服务器（3000端口）

## 注意事项

1. 确保已安装 Node.js 和 npm
2. 首次运行需要执行 `make install`
3. 表单数据目前只在控制台打印，可根据需要修改提交逻辑 