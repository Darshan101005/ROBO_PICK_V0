"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, User, Mail, Loader2, Camera, Check } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    color_blind_type: "normal",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setIsLoading(true)

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setError("Please log in to view your profile")
        return
      }

      setUser(user)
      setProfile((prev) => ({ ...prev, email: user.email || "" }))

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
            setProfile({
              full_name: fullName,
              email: user.email || "",
              color_blind_type: "normal",
            })
          }
        } else {
          console.error("Error loading profile:", profileError)
          setError("Failed to load profile")
        }
      } else {
        // Profile exists, use it
        setProfile({
          full_name: profileData.full_name || "",
          email: user.email || "",
          color_blind_type: profileData.color_blind_type || "normal",
        })
      }
    } catch (error) {
      console.error("Error in loadProfile:", error)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
    if (error) setError("")
    if (success) setSuccess("")
  }

  const handleSave = async () => {
    if (!user) {
      setError("Please log in to save your profile")
      return
    }

    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      const { error } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          full_name: profile.full_name,
          color_blind_type: profile.color_blind_type,
        },
        {
          onConflict: "id",
        },
      )

      if (error) {
        console.error("Error saving profile:", error)
        setError("Failed to save profile")
      } else {
        setSuccess("Profile saved successfully!")
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
          <p>Loading profile...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
            <p className="text-gray-600">Manage your personal information and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture Section */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>Update your profile photo</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 relative">
                    <Image src="/placeholder-user.jpg" alt="Profile" fill className="rounded-full object-cover" />
                    <Button size="sm" className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0">
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Change Photo
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Profile Information */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center">
                      <Check className="w-4 h-4 mr-2" />
                      {success}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10"
                        value={profile.full_name}
                        onChange={(e) => handleInputChange("full_name", e.target.value)}
                        disabled={isSaving}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input id="email" type="email" className="pl-10 bg-gray-50" value={profile.email} disabled />
                    </div>
                    <p className="text-sm text-gray-500">
                      Email cannot be changed. Contact support if you need to update your email.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Color Vision Type</Label>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 capitalize">
                        {profile.color_blind_type === "normal" ? "Normal Vision" : profile.color_blind_type}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        To change your color vision type, go to Vision Settings
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary-600">
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/settings/vision")}>
                      Vision Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
          <h1 className="flex-1 text-center text-lg font-semibold">Profile</h1>
          <div className="w-10" />
        </div>

        <div className="flex-1 p-4 space-y-6">
          {/* Profile Picture */}
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <Image src="/placeholder-user.jpg" alt="Profile" fill className="rounded-full object-cover" />
                <Button size="sm" className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0">
                  <Camera className="w-3 h-3" />
                </Button>
              </div>
              <Button variant="outline" size="sm">
                Change Photo
              </Button>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center">
                  <Check className="w-4 h-4 mr-2" />
                  {success}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName-mobile">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="fullName-mobile"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10 h-12"
                    value={profile.full_name}
                    onChange={(e) => handleInputChange("full_name", e.target.value)}
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-mobile">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    id="email-mobile"
                    type="email"
                    className="pl-10 h-12 bg-gray-50"
                    value={profile.email}
                    disabled
                  />
                </div>
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label>Color Vision Type</Label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 capitalize">
                    {profile.color_blind_type === "normal" ? "Normal Vision" : profile.color_blind_type}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Change in Vision Settings</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full h-12 bg-primary hover:bg-primary-600"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button variant="outline" onClick={() => router.push("/settings/vision")} className="w-full h-12">
                  Vision Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
