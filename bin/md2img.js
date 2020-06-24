#!/usr/bin/env node

const program = require('commander')
const pkg = require('../package')
const md2Img = require('..')
const path = require('path')

program
  .usage('<input> [-o <output>] [-w <width>]')
  .version(pkg.version)
  .option('-o, --output <output>', 'Image output path / 图片输出路径')
  .option(
    '-w, --width <width>',
    'Image pixel width / 图片像素宽度 [Default 800]',
    800
  )
  .parse()
  .args.length || program.help()

const { output = '', width = 800, args = [] } = program
const [input] = args

// 建议bin下处理命令行内容，lib下处理具体事务
md2Img(input, { output, width })
