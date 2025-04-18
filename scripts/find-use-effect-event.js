// This is a simple script to find any references to useEffectEvent in the codebase
// It's not meant to be run in the browser, but rather in a Node.js environment

const fs = require("fs")
const path = require("path")

// Function to search for useEffectEvent in a file
function searchFileForUseEffectEvent(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8")
    return content.includes("useEffectEvent")
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    return false
  }
}

// Function to recursively search a directory for files containing useEffectEvent
function searchDirectoryForUseEffectEvent(dirPath, results = []) {
  const files = fs.readdirSync(dirPath)

  files.forEach((file) => {
    const filePath = path.join(dirPath, file)
    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      // Skip node_modules and .next directories
      if (file !== "node_modules" && file !== ".next") {
        searchDirectoryForUseEffectEvent(filePath, results)
      }
    } else if (stats.isFile() && /\.(js|jsx|ts|tsx)$/.test(file)) {
      if (searchFileForUseEffectEvent(filePath)) {
        results.push(filePath)
      }
    }
  })

  return results
}

// Search for useEffectEvent in the current directory
const results = searchDirectoryForUseEffectEvent(".")

if (results.length > 0) {
  console.log("Found useEffectEvent in the following files:")
  results.forEach((file) => console.log(`- ${file}`))
} else {
  console.log("No references to useEffectEvent found in the codebase.")
}
