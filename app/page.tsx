import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, CheckCircle, Leaf, ShoppingBag } from "lucide-react"

export default function GetStartedPage() {
  return (
    <div className="min-h-screen app-gradient flex flex-col">
      {/* Header */}
      <div className="text-center pt-12 pb-6 px-6 slide-up">
        <div className="w-40 h-40 mx-auto mb-4 relative">
          <Image src="/images/app-logo.png" alt="RoboPick Logo" fill style={{ objectFit: "contain" }} priority />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">RoboPick</h1>
        <p className="text-lg text-gray-600">Smart Vision for Fresh Choices</p>
      </div>

      {/* Features */}
      <div className="flex-1 px-6 space-y-5 fade-in">
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary-100 to-primary-50 h-2"></div>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Camera className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Real-Time Color Correction</h3>
                <p className="text-gray-600 text-sm">
                  Point your camera at fruits and vegetables to see them with enhanced colors tailored to your vision
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-secondary-100 to-secondary-50 h-2"></div>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-secondary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Freshness Detection</h3>
                <p className="text-gray-600 text-sm">
                  AI-powered analysis helps you identify ripe and fresh produce with confidence
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary-100 to-secondary-50 h-2"></div>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Shopping Assistant</h3>
                <p className="text-gray-600 text-sm">
                  Get personalized recommendations and nutritional information for better shopping decisions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-secondary-100 to-primary-50 h-2"></div>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-secondary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Leaf className="w-6 h-6 text-secondary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Produce Guide</h3>
                <p className="text-gray-600 text-sm">
                  Access detailed information about seasonal fruits and vegetables and how to select them
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA Buttons */}
      <div className="p-6 space-y-3 scale-in">
        <Button asChild className="w-full h-12 text-lg bg-primary hover:bg-primary-600 shadow-md">
          <Link href="/signup">Get Started</Link>
        </Button>
        <Button asChild variant="outline" className="w-full h-12 text-lg border-2 bg-transparent">
          <Link href="/login">Already have an account? Sign In</Link>
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center pb-6 px-6">
        <p className="text-sm text-gray-500">Making grocery shopping accessible for everyone</p>
      </div>
    </div>
  )
}
