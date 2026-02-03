"use client"

import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/app/lib/utils"

interface PremiumToggleProps {
  defaultChecked?: boolean
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: string
}

export function PremiumToggle({
  defaultChecked = false,
  checked,
  onChange,
  label,
}: PremiumToggleProps) {
  const [isChecked, setIsChecked] = useState(checked ?? defaultChecked)
  const [isPressed, setIsPressed] = useState(false)

  // Sync with external checked prop
  useEffect(() => {
    if (checked !== undefined) {
      setIsChecked(checked)
    }
  }, [checked])

  const handleToggle = () => {
    const newValue = !isChecked
    if (checked === undefined) {
      setIsChecked(newValue)
    }
    onChange?.(newValue)
  }

  // isChecked = true means dark mode is active
  const isDarkMode = isChecked

  return (
    <div className="flex items-center gap-3">
      {label && (
        <span
          className={cn(
            "text-sm font-medium transition-colors duration-300",
            isChecked ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {label}
        </span>
      )}
      <button
        role="switch"
        aria-checked={isChecked}
        aria-label="Toggle dark mode"
        onClick={handleToggle}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        className={cn(
          "group relative h-8 w-14 rounded-full p-1 transition-all duration-500 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "bg-black dark:bg-[#f5c76a]",
        )}
      >
        {/* Sun icon - visible on right side when in light mode (thumb is left) */}
        <Sun
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 transition-all duration-500",
            isDarkMode ? "opacity-0 scale-75" : "opacity-100 scale-100 text-black",
          )}
        />

        {/* Moon icon - visible on left side when in dark mode (thumb is right) */}
        <Moon
          className={cn(
            "absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 transition-all duration-500",
            isDarkMode ? "opacity-100 scale-100 text-black" : "opacity-0 scale-75",
          )}
        />

        {/* Thumb */}
        <div
          className={cn(
            "relative h-6 w-6 rounded-full shadow-lg transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]",
            "bg-black dark:bg-darkbg",
            isDarkMode ? "translate-x-6" : "translate-x-0",
            isPressed && "scale-90 duration-150",
          )}
        >
          {/* Thumb inner shine */}
          <div className="absolute inset-[2px] rounded-full bg-gradient-to-b from-black via-black to-gray-800 dark:from-darkbg dark:via-darkbg dark:to-darkprimary/30" />

          {/* Thumb highlight */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-700 via-transparent to-transparent dark:from-darkbg/80" />
        </div>
      </button>
    </div>
  )
}
