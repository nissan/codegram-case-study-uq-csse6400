const fs = require("fs")
const path = require("path")

function findImportsInFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8")

  // Check for import { useEffectEvent } from 'react'
  const importMatch = content.match(/import\s+{[^}]*useEffectEvent[^}]*}\s+from\s+['"]react['"]/)

  // Check for import * as React from 'react' followed by React.useEffectEvent
  const namespaceMatch = content.match(/import\s+\*\s+as\s+React\s+from\s+['"]react['"]/)
  const useMatch = namespaceMatch && content.match(/React\.useEffectEvent/)

  return importMatch || useMatch
}

function findImportsInDirectory(dir) {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stats = fs.statSync(filePath)

    if (stats.isDirectory() && file !== "node_modules" && file !== ".next") {
      findImportsInDirectory(filePath)
    } else if (stats.isFile() && /\.(js|jsx|ts|tsx)$/.test(file)) {
      const match = findImportsInFile(filePath)
      if (match) {
        console.log(`Found useEffectEvent import in ${filePath}`)
      }
    }
  }
}

findImportsInDirectory(".")
