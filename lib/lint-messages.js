/** Lint messages, find missing messages and those that are unused */

const { readFileSync, statSync, existsSync } = require('fs')
const glob = require('glob')

// the IMPORT expression can be quite slow, so use a fast expression to pre-test if this is even a candidate
const IS_IMPORT = /import.*from '[^ ]+\/messages'/
// This will split up the import statement into the default and named imports. The named imports,
// if present, will be the output of group 2, which can be parsed by the regular expression below.
// You cannot have repeated capturing groups in a regex, http://stackoverflow.com/questions/3537878
// The default import name will be either group 1 or 3 depending on whether it comes before or after
// the named imports.
const IMPORT = /import ([a-zA-Z0-9_$]+)?,? ?(\{ ?(?:[a-zA-Z0-9_$]+(?: as [a-zA-Z0-9_$]+)?,? ?)* ?\})?,? ?([a-zA-Z0-9_$]+)? from '[^ ]+\/messages'/
// global regex, exec multiple times on same string to get all named imports. Has the source on the
// first group and the name (if applicable) on the second.
const NAMED_IMPORTS = /([a-zA-Z0-9_$]+)(?: as ([a-zA-Z0-9_$]+))?/g

// parse a line to determine if it is an import of messages
function parseImportLine (line) {
  if (IS_IMPORT.test(line)) {
    // could be either depending on whether default import was before or after named imports
    const [, default0, named, default1] = IMPORT.exec(line)
    const defaultImport = default0 || default1
    const namedImports = []
    if (named) {
      let next
      while ((next = NAMED_IMPORTS.exec(named)) != null) {
        const [, src, importedAs] = next
        namedImports.push([src, importedAs || src]) // if no alternate name, use default name
      }
    }

    return [defaultImport, namedImports]
  } else {
    return null
  }
}

/** Lint a file against messages. Exported for testing */
function lintFileContents (messages, js) {
  // what was messages imported as
  let importedAtRootAs = false
  let importedMembersAs
  const importedMembersLookup = new Map()

  let rootMatcher, namedMatcher

  // TODO handle importing members, e.g. import { analysis } from messages

  const foundMessages = []

  let lineNumber = 0 // first increment lands at 0

  for (const line of js.split('\n')) {
    lineNumber++
    const parsedImport = parseImportLine(line)
    if (parsedImport) {
      [importedAtRootAs, importedMembersAs] = parsedImport
      // make sure we don't catch things like display_messages by making sure there's a diff char before
      rootMatcher = new RegExp(`[^a-zA-Z0-9_$]${importedAtRootAs}\\.([^ ,\\(\\)\\[}]+)`, 'g')
      namedMatcher = new RegExp(`[^a-zA-Z0-9_$](${importedMembersAs.map(a => a[1]).join('|')})\\.([^ ,\\(\\)\\[}]+)`, 'g')
      importedMembersAs.forEach(([member, importedAs]) => importedMembersLookup.set(importedAs, member))
    } else if (importedAtRootAs || importedMembersAs) {
      let result
      // each subsequent call gets next match
      if (importedAtRootAs) {
        while ((result = rootMatcher.exec(line)) != null) {
          foundMessages.push([result[1], lineNumber])
        }
      }

      // do the same for imported members
      if (importedMembersAs.length > 0) {
        while ((result = namedMatcher.exec(line)) != null) {
          // map back to the names in the messages file
          foundMessages.push([`${importedMembersLookup.get(result[1])}.${result[2]}`, lineNumber])
        }
      }
    }
  }

  // filter to only the missing ones
  return foundMessages.filter(([message, lineNumber]) => {
    let current = messages
    for (const sub of message.split('.')) {
      current = current[sub]
      if (current == null) {
        return true // something in the chain is undefined
      }
    }

    return false
  })
}

module.exports = {
  lint: function (files, messages) {
    const missingFiles = files.filter(file => !existsSync(file))
    if (missingFiles.length > 0) {
      console.log('some files were not found:')
      missingFiles.forEach(f => console.log(` - ${f}`))
      process.exit(1)
    }

    const allFiles = [].concat(
      ...files.map((file) => {
        if (statSync(file).isDirectory()) {
          // TODO what if file is already slash-terminated?
          return glob.sync(`${file}/**/*.js`)
        } else {
          return file
        }
      })
    )

    const missing = [].concat(...allFiles
      .map(filename => {
        return lintFileContents(messages, readFileSync(filename, 'utf8'))
          .map(([message, line]) => [message, filename, line])
      }))

    return missing
  },
  lintFileContents,
  parseImportLine
}
