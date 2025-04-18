// This file patches React to add useEffectEvent
// It should be imported before any other code

if (typeof window !== "undefined") {
  // Check if React is already defined
  if (window.React) {
    // Add useEffectEvent if it doesn't exist
    if (!window.React.useEffectEvent) {
      window.React.useEffectEvent = window.React.useCallback
      console.log("Added useEffectEvent to React")
    }
  } else {
    // React isn't defined yet, so we'll add it to the window object
    Object.defineProperty(window, "React", {
      configurable: true,
      get: function () {
        return this._React
      },
      set: function (React) {
        // Add useEffectEvent if it doesn't exist
        if (React && !React.useEffectEvent) {
          React.useEffectEvent = React.useCallback
          console.log("Added useEffectEvent to React")
        }
        this._React = React
      },
    })
  }
}
