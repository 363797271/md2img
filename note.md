# 开发笔记

## bin & main 的区别

package.json中的bin和main字段：

- bin：应用作为 cli 命令的执行入口（指定JS执行文件）
  - 值可以为字符串，指定执行文件的路径，命令名默认取模块的名称（package.json的`name`）
  - 可以为对象，key为命令名，value为执行文件的路径
- main：应用作为模块在代码中使用时，导入的文件
  - `const mynpm = require('mynpm')`，引入的就是`main`指定的文件。
  - 默认根目录下的index.js。

在代码中导入(import require)一个模块，如果使用的是模块名(指向模块安装的路径)或一个路径，优先会在这个目录下寻找package.json文件，导入main属性指定的文件（默认./index.js）。

其次，才会寻找目录下的index.js文件。

PS：上述未考虑 ESM(mjs) CommonJS(cjs) 规范 以及 module browser 属性的使用。只区分bin和main。

## 指定用node执行脚本文件

### npm脚本原理

npm脚本的原理：每当执行`npm run`，就会自动新建一个Shell（命令解释器），在这个Shell里面执行指定的脚本命令。

`npm run`新建的这个Shell，会将当前目录的`node_modules/.bin`子目录加入到环境变量`PATH`中，执行结束，再将`PATH`恢复原样。

所以项目本地安装的cli npm模块，可以直接用模块名调用，而不必加上路径：`npm run <npm name>`

---

因为npm脚本是在Shell执行，所以只要是可以在Shell中运行的命令，都可以写在npm脚本中。反之，也只有Shell可以运行的命令，才能使用。

### 指定node方式执行

当安装一个npm模块，并且这个模块配置了bin属性，就会在安装目录的`node_modules/.bin`中，创建两个可执行文件：

- 没有后缀名的对应unix系的shell脚本
- cmd文件对应的是windows bat脚本

内容都是用node执行npm模块bin属性指向的文件。

开发时执行自定义的node脚本文件时，使用`node mycli.js`

`npm run mycli`时Shell在`node_modules/.bin`中的找到对应可执行脚本文件，在这个脚本中定义了 应该用node去执行对应的bin文件。

使用什么方式执行，是需要自己手动指定的。

通过在bin文件顶部添加一行`#!/usr/bin/env node`来指定使用node去执行这文件。

```bash
npm run mycli
等同于
node 前置路径/mycli.js
```



## Commander 命令行工具

nodejs 的 `process.argv` 返回一个数组，包含当执行node脚本时，命令行中的参数，前两个元素是固定的：

- 第一个元素是`process.execPath`，即启动node的可执行文件路径。
  - 即Nodejs安装路径下的node.exe，`C:\Program Files\nodejs\node.exe`
- 第二个元素是正被执行的 JavaScript 文件的路径。
- 其余的是额外的命令行参数

```bash
# 例如 执行md2img模块的命令
md2img read.md -o read.png
# 等效于
node md2img read.md -o read.png
# 实际上是：
node 模块安装路径/package.jsond的bin属性指定的文件路径 read.md -o read.png

# process.argv 返回：
[
  'nodejs安装路/node.exe',
  '模块安装路径/package.jsond的bin属性指定的文件路径',
  'read.md',
  '-o',
  'read.png'
]
```

解析process.argv配置自己的命令行接口。

也可以使用 Commander 工具更方便的配置符合行内规范的命令行方案。

---

commander：[node.js](http://nodejs.org/) 命令行接口的完整解决方案。

commander默认返回一个全局对象，也可以自己实例化一个。

```js
const { Command } = require('commander');
const program = new Command();
program.version('0.0.1');
```

program可以链式调用：

```js
const program = require("commander");
const pkg = require("../package");

program
  // useage 和 name 用于在帮助信息第一行中显示的命令使用描述(description)

  // 默认当前cli命令的名称，可省略
  // .name('md2img')

  // Usage: md2img <input> [-o <output>] [-w <width>]
  .usage('<input> [-o <output>] [-w <width>]')

  // arguments 用于指定命令中的参数，尖括号必填，中括号选填
  .arguments('<input>')

  // version 用于指定版本号
  .version(pkg.version)

  // option 用于定于选项
  // 第一个参数定义选项，包含一个单字符的短标识和一个长名称，默认Boolean类型
  // 如果需要接收一个值，可以在后面用尖括号包裹用于接收的名称
  // 第二个参数定义选项的描述
  // 第三个参数定义选项的默认值，或一个用于处理的函数
  .option('-o, --output <output>', 'Image output path / 图片输出路径')
  .option('-w, --width <width>', 'Image pixel width / 图片像素宽度', 800)

  // on 用于监听选项或commander命令，必须在parse()之前
  // --help 是commander为命令默认添加的选项，默认会打印信息，如不需要自定义，这里可以省略
  // .on('--help', console.log)

  // parse用于解析字符串数组，默认参数为 process.argv。
  .parse(process.argv)
  
  // program.args 返回没有被program选项使用的argv
  // 例如当前 md2img read.md -o read.png 1 2 返回['read.md', '1', '2']
  // 这里可以判断<input>是否存在，与.arguments('<input>')目的一样
  // 如果<input>不存在，执行help()命令打印帮助信息，并立即退出
  .args.length || program.help()
```

## path.resolve vs join

`process.cwd()`返回执行当前命令的路径。

> 相对路径：./开头或../开头或字母开头
>
> 绝对路径：/开头，或 盘符开头 D:/

- `path.resolve()` 以``process.cwd()``为根目录，依次解析参数中的路径(`/`根目录为盘符根目录)
  - 参数可以为绝对路径 或 相对路径
  - 返回一个包含盘符的绝对路径
- `path.join()` 以第一个参数为基础，拼接路径，参数会作为相对路径拼接。
  - 绝对路径：`path.join('a', '/b', 'E:/c')`等同于`path.join('a', './b', './E:/c')`
  - 相对路径，正常解析拼接：`path.join('./a/b/c/d','../../e')`返回`a/b/e`

## fs.readFileSync()

同步读取文件内容，参数1：文件路径，参数2：编码。

`fs.readFileSync([path], 'utf8')`

## marked 解析markdown

marked工具将markdown内容转化为html。

## 无头浏览器 puppeteer

无头浏览器，在计算机后台进程自动运行，不需要显示出来，自动工作。

一般用来做服务端应用或自动化测试。

例如 puppeteer cypress nightmare。

本功能使用 puppeteer 打开html内容，然后通过浏览器的API截图保存。

puppeteer中的方法是异步的，这里将 index.js 导出的方法设置为async，以在内部使用await。

## markdown样式

默认使用github样式，引用的css的CDN地址：[github-markdown.css](https://unpkg.com/github-markdown-css@4.0.0/github-markdown.css)

## 后续补充

1. loading
2. 可选择导出样式
3. 使用rc配置文件配置
   1. output
   2. width
   3. template 导出模板
   4. css css模板 提供几个typora主题样式
4. 补充reammd.md