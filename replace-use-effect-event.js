const fs = require("fs")
const path = require("path")

function replaceInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8")

    // Check if the file contains useEffectEvent
    if (content.includes("useEffectEvent")) {
      // Replace useEffectEvent with useCallback
      const newContent = content.replace(/useEffectEvent/g, "useCallback")

      // Write the modified content back to the file
      fs.writeFileSync(filePath, newContent, "utf8")

      console.log(`Replaced useEffectEvent in ${filePath}`)
      return true
    }

    return false
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error)
    return false
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir)
  let replacedCount = 0

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stats = fs.statSync(filePath)

    if (stats.isDirectory() && file !== "node_modules" && file !== ".next") {
      replacedCount += processDirectory(filePath)
    } else if (stats.isFile() && /\.(js|jsx|ts|tsx)$/.test(file)) {
      if (replaceInFile(filePath)) {
        replacedCount++
      }
    }
  }

  return replacedCount
}

const replacedCount = processDirectory(".")
console.log(`Replaced useEffectEvent in ${replacedCount} files.`)
