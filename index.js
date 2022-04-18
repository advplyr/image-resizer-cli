const fs = require('fs')
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')

const resizer = require('./resizer')

const optionDefinitions = [
  { name: 'help', alias: 'h', type: Boolean },
  { name: 'input', alias: 'i', type: String, description: 'Directory of images you would like to resize' },
  { name: 'output', type: String, defaultOption: true },
  { name: 'width', alias: 'w', type: Number, defaultValue: 1500 },
  { name: 'quality', alias: 'q', type: Number, defaultValue: 90 }
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
    }
  ])
  console.log(usage)
} else {
  const errors = []
  if (!options.input || !fs.existsSync(options.input)) {
    errors.push(`- Invalid input directory must exist`)
  }
  if (!options.output) {
    errors.push('- Must enter an output directory')
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
