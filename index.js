#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')

const resizer = require('./resizer')

const optionDefinitions = [
  { name: 'help', alias: 'h', type: Boolean },
  { name: 'input', alias: 'i', type: String, description: 'Directory of images you would like to resize' },
  { name: 'output', type: String, defaultOption: true, description: 'Directory to put finished images (will create if does not exist)' },
  { name: 'width', alias: 'w', type: Number, defaultValue: 1500, description: 'Output image width in pixels, height will adjust proportionally' },
  { name: 'quality', alias: 'q', type: Number, defaultValue: 90, description: 'Output image JPEG quality' },
  { name: 'despace', alias: 'd', type: Boolean, description: 'Remove spaces from output filenames and replace with _' },
  { name: 'lower', alias: 'l', type: Boolean, description: 'Output filename to all lowercase' }
]
const options = commandLineArgs(optionDefinitions)

if (options.help) {
  const usage = commandLineUsage([
    {
      header: 'Batch Image Resizer',
      content: 'Uses sharp to resize & compress a directory of images.'
    },
    {
      header: 'Options',
      optionList: optionDefinitions
    },
    {
      header: 'Example Usage',
      content: 'npx image-resizer-cli -i ./path/to/your/images ./output'
    }
  ])
  console.log(usage)
} else {
  const errors = []
  if (!options.input) {
    errors.push(`- Must enter input directory`)
  } else {
    options.input = path.resolve(options.input)
    if (!fs.existsSync(options.input)) {
      errors.push(`- Invalid input directory must exist`)
    }
  }
  if (!options.output) {
    errors.push('- Must enter an output directory')
  } else {
    options.output = path.resolve(options.output)
  }
  if (options.width <= 0) {
    errors.push('- Invalid width must be > 0')
  }
  if (options.quality <= 0 || options.quality > 100) {
    errors.push('- Invalid quality must be > 0 and <= 100')
  }

  if (errors.length) {
    console.log(`\nERROR: Invalid options use --help to see option definitions:\n\n${errors.join('\n')}\n`)
  } else {
    resizer.run(options)
  }
}
