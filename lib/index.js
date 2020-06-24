const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const marked = require('marked')
const puppeteer = require('puppeteer')

module.exports = async (input, options = {}) => {
  let { output, width } = options
  const cwd = process.cwd()
  width = ~~width || 800
  input = path.resolve(cwd, input)

  // 校验 input 是否有效
  if (!fs.existsSync(input)) {
    throw new Error(`'${input}' does not exist`)
  }
  // 校验 input 是否是文件夹
  if (fs.statSync(input).isDirectory()) {
    throw new TypeError(`'${input}' is a directory, it should be a file`)
  }
  // 校验扩展名是不是 .md
  if (path.extname(input) !== '.md') {
    throw new TypeError(`'${input}' is not a markdown file`)
  }

  // 获取输出路径，默认.png
  if (output) {
    output = path.resolve(output)
    if (!['.png', '.jpg', '.jpeg'].includes(path.extname(output))) {
      output += '.png'
    }
  } else {
    output = path.resolve(
      path.dirname(input),
      path.basename(input, '.md') + '.png'
    )
  }

  // 读取md文件
  const contents = fs.readFileSync(input, 'utf-8')
  // 解析md为html
  const fragment = marked(contents)
  // 获取css样式
  const style = 'https://unpkg.com/github-markdown-css@4.0.0/github-markdown.css'
  const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="${style}" />
  </head>
  <body class="markdown-body">
    ${fragment}
  </body>
  </html>`

  // 使用无头浏览器访问html内容，调用API截图保存
  // 打开浏览器（后台进程）
  const browser = await puppeteer.launch({
    // headless: false,
    defaultViewport: {
      width,
      height: 100,
    },
  })
  // 打开一个新页面
  const page = await browser.newPage()
  // 填充html内容
  await page.setContent(html)
  // 截图导出
  await page.screenshot({
    path: output,
    type: output.endsWith('.jpg') || output.endsWith('.jpeg') ? 'jpeg' : 'png',
    fullPage: true,
  })
  // 关闭浏览器
  await browser.close()

  return `https://github.com/363797271`
}
