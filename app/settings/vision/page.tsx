"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Eye, Palette, Settings, Loader2, Check } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function VisionSettingsPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [settings, setSettings] = useState({
    colorBlindType: "normal",
    colorIntensity: [80],
    contrastBoost: false,
    colorFilters: true,
    hapticFeedback: true,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setIsLoading(true)

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setError("Please log in to view your settings")
        return
      }

      setUser(user)

      // Try to get existing profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profileError) {
        if (profileError.code === "PGRST116") {
          // Profile doesn't exist, create it
          const fullName = user.user_metadata?.full_name || ""

          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert([
              {
                id: user.id,
                full_name: fullName,
                color_blind_type: "normal",
              },
            ])
            .select()
            .single()

          if (createError) {
            console.error("Error creating profile:", createError)
            setError("Failed to create profile")
          } else {
            setSettings((prev) => ({ ...prev, colorBlindType: "normal" }))
          }
        } else {
          console.error("Error loading profile:", profileError)
          setError("Failed to load settings")
        }
      } else {
        // Profile exists, use it
        setSettings((prev) => ({
          ...prev,
          colorBlindType: profileData.color_blind_type || "normal",
        }))
      }
    } catch (error) {
      console.error("Error in loadSettings:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleColorBlindTypeChange = (value: string) => {
    setSettings((prev) => ({ ...prev, colorBlindType: value }))
    if (error) setError("")
    if (success) setSuccess("")
  }

  const handleSliderChange = (field: string, value: number[]) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSwitchChange = (field: string, checked: boolean) => {
    setSettings((prev) => ({ ...prev, [field]: checked }))
  }

  const handleSave = async () => {
    if (!user) {
      setError("Please log in to save your settings")
      return
    }

    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      const { error } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          color_blind_type: settings.colorBlindType,
        },
        {
          onConflict: "id",
        },
      )

      if (error) {
        console.error("Error saving settings:", error)
        setError("Failed to save settings")
      } else {
        setSuccess("Vision settings saved successfully!")
        setTimeout(() => setSuccess(""), 3000)
      }
    } catch (error) {
      console.error("Error in handleSave:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading vision settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="max-w-4xl mx-auto p-8">
          <div className="mb-8">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Settings
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Vision Settings</h1>
            <p className="text-gray-600">Customize your visual experience for better produce identification</p>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center">
                <Check className="w-4 h-4 mr-2" />
                {success}
              </div>
            )}

            {/* Color Vision Type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Color Vision Type
                </CardTitle>
                <CardDescription>Select your color vision type to optimize the app's color correction</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={settings.colorBlindType}
                  onValueChange={handleColorBlindTypeChange}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="normal" />
                    <Label htmlFor="normal" className="flex-1">
                      <div className="font-medium">Normal Vision</div>
                      <div className="text-sm text-gray-500">No color vision deficiency</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="protanopia" id="protanopia" />
                    <Label htmlFor="protanopia" className="flex-1">
                      <div className="font-medium">Protanopia</div>
                      <div className="text-sm text-gray-500">Difficulty distinguishing red and green</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="deuteranopia" id="deuteranopia" />
                    <Label htmlFor="deuteranopia" className="flex-1">
                      <div className="font-medium">Deuteranopia</div>
                      <div className="text-sm text-gray-500">Difficulty distinguishing red and green</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tritanopia" id="tritanopia" />
                    <Label htmlFor="tritanopia" className="flex-1">
                      <div className="font-medium">Tritanopia</div>
                      <div className="text-sm text-gray-500">Difficulty distinguishing blue and yellow</div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Color Adjustments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Color Adjustments
                </CardTitle>
                <CardDescription>Fine-tune color settings for optimal visibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-4 block">
                    Color Intensity: {settings.colorIntensity[0]}%
                  </Label>
                  <Slider
                    value={settings.colorIntensity}
                    onValueChange={(value) => handleSliderChange("colorIntensity", value)}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500 mt-2">Adjust how vibrant colors appear in the camera view</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Contrast Boost</Label>
                    <p className="text-sm text-gray-500">Enhance contrast for better visibility</p>
                  </div>
                  <Switch
                    checked={settings.contrastBoost}
                    onCheckedChange={(checked) => handleSwitchChange("contrastBoost", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Color Filters</Label>
                    <p className="text-sm text-gray-500">Apply color correction filters</p>
                  </div>
                  <Switch
                    checked={settings.colorFilters}
                    onCheckedChange={(checked) => handleSwitchChange("colorFilters", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Additional Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Additional Settings
                </CardTitle>
                <CardDescription>Other accessibility and feedback options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Haptic Feedback</Label>
                    <p className="text-sm text-gray-500">Vibration feedback for interactions</p>
                  </div>
                  <Switch
                    checked={settings.hapticFeedback}
                    onCheckedChange={(checked) => handleSwitchChange("hapticFeedback", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex gap-4">
              <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary-600">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Settings"
                )}
              </Button>
              <Button variant="outline" onClick={() => router.push("/vision-test")}>
                Test Vision Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen flex flex-col">
        <div className="flex items-center p-4 bg-white border-b">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="flex-1 text-center text-lg font-semibold">Vision Settings</h1>
          <div className="w-10" />
        </div>

        <div className="flex-1 p-4 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center">
              <Check className="w-4 h-4 mr-2" />
              {success}
            </div>
          )}

          {/* Color Vision Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Color Vision Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={settings.colorBlindType}
                onValueChange={handleColorBlindTypeChange}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="normal-mobile" />
                  <Label htmlFor="normal-mobile" className="flex-1">
                    <div className="font-medium">Normal Vision</div>
                    <div className="text-sm text-gray-500">No color vision deficiency</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="protanopia" id="protanopia-mobile" />
                  <Label htmlFor="protanopia-mobile" className="flex-1">
                    <div className="font-medium">Protanopia</div>
                    <div className="text-sm text-gray-500">Red-green difficulty</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="deuteranopia" id="deuteranopia-mobile" />
                  <Label htmlFor="deuteranopia-mobile" className="flex-1">
                    <div className="font-medium">Deuteranopia</div>
                    <div className="text-sm text-gray-500">Red-green difficulty</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tritanopia" id="tritanopia-mobile" />
                  <Label htmlFor="tritanopia-mobile" className="flex-1">
                    <div className="font-medium">Tritanopia</div>
                    <div className="text-sm text-gray-500">Blue-yellow difficulty</div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Color Adjustments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Color Adjustments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium mb-3 block">
                  Color Intensity: {settings.colorIntensity[0]}%
                </Label>
                <Slider
                  value={settings.colorIntensity}
                  onValueChange={(value) => handleSliderChange("colorIntensity", value)}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Contrast Boost</Label>
                  <p className="text-sm text-gray-500">Enhance contrast</p>
                </div>
                <Switch
                  checked={settings.contrastBoost}
                  onCheckedChange={(checked) => handleSwitchChange("contrastBoost", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Color Filters</Label>
                  <p className="text-sm text-gray-500">Apply corrections</p>
                </div>
                <Switch
                  checked={settings.colorFilters}
                  onCheckedChange={(checked) => handleSwitchChange("colorFilters", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Haptic Feedback</Label>
                  <p className="text-sm text-gray-500">Vibration feedback</p>
                </div>
                <Switch
                  checked={settings.hapticFeedback}
                  onCheckedChange={(checked) => handleSwitchChange("hapticFeedback", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="space-y-3">
            <Button onClick={handleSave} disabled={isSaving} className="w-full h-12 bg-primary hover:bg-primary-600">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Settings"
              )}
            </Button>
            <Button variant="outline" onClick={() => router.push("/vision-test")} className="w-full h-12">
              Test Vision Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
