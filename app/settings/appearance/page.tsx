"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Sun, Moon, Monitor, Type, Palette, RotateCcw } from "lucide-react"

const themes = [
  { value: "light", label: "Light", icon: Sun, description: "Clean and bright interface" },
  { value: "dark", label: "Dark", icon: Moon, description: "Easy on the eyes in low light" },
  { value: "system", label: "System", icon: Monitor, description: "Follows your device settings" },
]

const fontSizes = [
  { value: "12", label: "Small", size: "12px" },
  { value: "14", label: "Default", size: "14px" },
  { value: "16", label: "Large", size: "16px" },
  { value: "20", label: "Extra Large", size: "20px" },
]

export default function AppearancePage() {
  const router = useRouter()

  const [theme, setTheme] = useState("system")
  const [fontSize, setFontSize] = useState("14")
  const [colorIntensity, setColorIntensity] = useState([100])
  const [highContrast, setHighContrast] = useState(false)

  useEffect(() => {
    // Load saved preferences
    const savedTheme = localStorage.getItem("theme") || "system"
    const savedFontSize = localStorage.getItem("fontSize") || "14"
    const savedColorIntensity = localStorage.getItem("colorIntensity") || "100"
    const savedHighContrast = localStorage.getItem("highContrast") === "true"

    setTheme(savedTheme)
    setFontSize(savedFontSize)
    setColorIntensity([Number.parseInt(savedColorIntensity)])
    setHighContrast(savedHighContrast)

    // Apply theme
    applyTheme(savedTheme)
    applyFontSize(savedFontSize)
  }, [])

  const applyTheme = (newTheme: string) => {
    const root = document.documentElement

    if (newTheme === "dark") {
      root.classList.add("dark")
    } else if (newTheme === "light") {
      root.classList.remove("dark")
    } else {
      // System theme
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (prefersDark) {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    }
  }

  const applyFontSize = (size: string) => {
    document.documentElement.style.fontSize = `${size}px`
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    applyTheme(newTheme)
  }

  const handleFontSizeChange = (newSize: string) => {
    setFontSize(newSize)
    localStorage.setItem("fontSize", newSize)
    applyFontSize(newSize)
  }

  const handleColorIntensityChange = (value: number[]) => {
    setColorIntensity(value)
    localStorage.setItem("colorIntensity", value[0].toString())

    // Apply color intensity
    const intensity = value[0] / 100
    document.documentElement.style.setProperty("--color-intensity", intensity.toString())
  }

  const handleHighContrastChange = (enabled: boolean) => {
    setHighContrast(enabled)
    localStorage.setItem("highContrast", enabled.toString())

    // Apply high contrast
    if (enabled) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
  }

  const resetToDefaults = () => {
    setTheme("system")
    setFontSize("14")
    setColorIntensity([100])
    setHighContrast(false)

    localStorage.setItem("theme", "system")
    localStorage.setItem("fontSize", "14")
    localStorage.setItem("colorIntensity", "100")
    localStorage.setItem("highContrast", "false")

    applyTheme("system")
    applyFontSize("14")
    handleColorIntensityChange([100])
    handleHighContrastChange(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold ml-4 dark:text-white">Appearance</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Theme Selection */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center dark:text-white">
              <Palette className="h-5 w-5 mr-2" />
              Theme
            </CardTitle>
            <CardDescription className="dark:text-gray-300">Choose your preferred color scheme</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={theme} onValueChange={handleThemeChange}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {themes.map((themeOption) => (
                  <div key={themeOption.value} className="relative">
                    <RadioGroupItem value={themeOption.value} id={themeOption.value} className="sr-only" />
                    <Label
                      htmlFor={themeOption.value}
                      className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        theme === themeOption.value
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-full mb-3 ${
                          theme === themeOption.value
                            ? "bg-primary text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        <themeOption.icon className="h-6 w-6" />
                      </div>
                      <span className="font-medium dark:text-white">{themeOption.label}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
                        {themeOption.description}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            {/* Theme Preview */}
            <div className="mt-6 p-4 border rounded-lg dark:border-gray-600">
              <h4 className="font-medium mb-3 dark:text-white">Preview</h4>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-8 bg-primary rounded w-24"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Font Size */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center dark:text-white">
              <Type className="h-5 w-5 mr-2" />
              Text Size
            </CardTitle>
            <CardDescription className="dark:text-gray-300">Adjust the size of text throughout the app</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={fontSize} onValueChange={handleFontSizeChange}>
              <div className="space-y-3">
                {fontSizes.map((size) => (
                  <div key={size.value} className="flex items-center space-x-3">
                    <RadioGroupItem value={size.value} id={`font-${size.value}`} />
                    <Label
                      htmlFor={`font-${size.value}`}
                      className="flex-1 cursor-pointer dark:text-white"
                      style={{ fontSize: size.size }}
                    >
                      {size.label} - Sample text at this size
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Color Enhancement */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Color Enhancement</CardTitle>
            <CardDescription className="dark:text-gray-300">
              Adjust color intensity and contrast for better visibility
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm font-medium dark:text-white">Color Intensity: {colorIntensity[0]}%</Label>
              <Slider
                value={colorIntensity}
                onValueChange={handleColorIntensityChange}
                max={150}
                min={50}
                step={5}
                className="mt-2"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Adjust how vibrant colors appear</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium dark:text-white">High Contrast Mode</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Increase contrast for better readability</p>
              </div>
              <Switch checked={highContrast} onCheckedChange={handleHighContrastChange} />
            </div>
          </CardContent>
        </Card>

        {/* Reset Button */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={resetToDefaults}
            className="flex items-center dark:border-gray-600 dark:text-gray-300 bg-transparent"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  )
}
