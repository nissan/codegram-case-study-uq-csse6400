"use client"

const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Function to find all files that import useEffectEvent
function findFilesWithUseEffectEvent() {
  try {
    // Use grep to find all files that contain useEffectEvent
    const grepOutput = execSync(
      'grep -r "useEffectEvent" --include="*.{js,jsx,ts,tsx}" . --exclude-dir=node_modules --exclude-dir=.next',
    ).toString()

    // Parse the grep output to get the file paths
    const files = grepOutput
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => line.split(":")[0])

    return [...new Set(files)] // Remove duplicates
  } catch (error) {
    console.error("Error finding files with useEffectEvent:", error)
    return []
  }
}

// Function to fix a file by replacing useEffectEvent with useCallback
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8")

    // Replace import { useEffectEvent } from 'react'
    content = content.replace(
      /import\s+{\s*([^}]*),?\s*useEffectEvent\s*,?([^}]*)\s*}\s+from\s+['"]react['"]/g,
      (match, before, after) => {
        const parts = []
        if (before.trim()) parts.push(before.trim())
        if (after.trim()) parts.push(after.trim())

        if (parts.length === 0) {
          return `import { useCallback } from 'react'`
        } else {
          return `import { ${parts.join(", ")}, useCallback } from 'react'`
        }
      },
    )

    // Replace import * as React from 'react' followed by React.useEffectEvent
    content = content.replace(/React\.useEffectEvent/g, "React.useCallback")

    // Replace direct useEffectEvent calls
    content = content.replace(/useEffectEvent\(/g, "useCallback(")

    // Replace type definitions
    content = content.replace(/useEffectEvent</g, "useCallback<")

    fs.writeFileSync(filePath, content, "utf8")
    console.log(`Fixed ${filePath}`)
  } catch (error) {
    console.error(`Error fixing file ${filePath}:`, error)
  }
}

// Main function
function main() {
  const files = findFilesWithUseEffectEvent()

  if (files.length === 0) {
    console.log("No files found with useEffectEvent.")
    return
  }

  console.log(`Found ${files.length} files with useEffectEvent:`)
  files.forEach((file) => console.log(`- ${file}`))

  console.log("\nFixing files...")
  files.forEach(fixFile)

  console.log("\nDone!")
}

main()
