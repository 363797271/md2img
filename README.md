# md2img

[![NPM Downloads][downloads-image]][downloads-url]
[![NPM Version][version-image]][version-url]
[![License][license-image]][license-url]
[![Dependency Status][dependency-image]][dependency-url]
[![devDependency Status][devdependency-image]][devdependency-url]
[![Code Style][style-image]][style-url]

> markdown to image

## Installation

```shell
$ npm install md2img

# or yarn
$ yarn add md2img
```

## Usage

<!-- TODO: Introduction of API use -->

```javascript
const md2Img = require('md2img')
const result = md2Img('README.md', 'README.png')
// result => 'zce@zce.me'
```

## API

<!-- TODO: Introduction of API -->

### md2Img(name[, options])

#### name

- Type: `string`
- Details: name string

#### options

##### host

- Type: `string`
- Details: host string
- Default: `'zce.me'`

## CLI Usage

<!-- TODO: Introduction of CLI -->

```shell
$ yarn global add md2img

# or npm
$ npm install md2img -g
```

```shell
$ md2img --help

  Usage: md2img <input>

  Options:

    -V, --version  output the version number
    -H, --host     Email host
    -h, --help     output usage information
```

## Contributing

1. **Fork** it on GitHub!
2. **Clone** the fork to your own machine.
3. **Checkout** your feature branch: `git checkout -b my-awesome-feature`
4. **Commit** your changes to your own branch: `git commit -am 'Add some feature'`
5. **Push** your work back up to your fork: `git push -u origin my-awesome-feature`
6. Submit a **Pull Request** so that we can review your changes.

> **NOTE**: Be sure to merge the latest from "upstream" before making a pull request!

## License

[MIT](LICENSE) &copy; zyd



[downloads-image]: https://img.shields.io/npm/dm/md2img.svg
[downloads-url]: https://npmjs.org/package/md2img
[version-image]: https://img.shields.io/npm/v/md2img.svg
[version-url]: https://npmjs.org/package/md2img
[license-image]: https://img.shields.io/github/license/363797271/md2img.svg
[license-url]: https://github.com/363797271/md2img/blob/master/LICENSE
[dependency-image]: https://img.shields.io/david/363797271/md2img.svg
[dependency-url]: https://david-dm.org/363797271/md2img
[devdependency-image]: https://img.shields.io/david/dev/363797271/md2img.svg
[devdependency-url]: https://david-dm.org/363797271/md2img?type=dev
[style-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[style-url]: https://standardjs.com
