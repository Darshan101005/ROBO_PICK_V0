"use client"

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NavigationBar } from "@/components/navigation-bar"
import { saveScanResult } from "@/app/actions"
import {
  ArrowLeft,
  Camera,
  RotateCcw,
  Zap,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Share,
  Heart,
  ShoppingBag,
} from "lucide-react"

export default function CameraPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      // Fallback for demo purposes
      setCameraActive(true)
    }
  }, [])

  const simulateScan = async () => {
    setIsScanning(true)

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock scan result
    const mockResult = {
      userId: "1",
      itemName: "Red Apple",
      category: "fruits",
      freshness: "excellent" as const,
      confidence: 94,
      tips: [
        "This apple looks perfectly ripe!",
        "The skin is firm and glossy",
        "Great choice for immediate consumption",
        "Store in refrigerator for best freshness",
      ],
      nutritionalInfo: {
        calories: 95,
        fiber: "4g",
        vitaminC: "14% DV",
        potassium: "6% DV",
      },
    }

    setScanResult(mockResult)
    setIsScanning(false)

    // Save scan result
    await saveScanResult(mockResult)
  }

  const resetScan = () => {
    setScanResult(null)
    setIsScanning(false)
  }

  if (scanResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
        {/* Header */}
        <div className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={resetScan}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-semibold">Scan Results</h1>
            <Button variant="ghost" size="icon">
              <Share className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 p-4 space-y-6">
          {/* Main Result */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-400 to-green-500 h-2"></div>
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{scanResult.itemName}</h2>
              <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                {scanResult.freshness.charAt(0).toUpperCase() + scanResult.freshness.slice(1)} Quality
              </Badge>
              <div className="mt-4">
                <div className="text-sm text-gray-600">Confidence Score</div>
                <div className="text-3xl font-bold text-primary">{scanResult.confidence}%</div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                Smart Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scanResult.tips.map((tip: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Nutritional Info */}
          <Card>
            <CardHeader>
              <CardTitle>Nutritional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{scanResult.nutritionalInfo.calories}</div>
                  <div className="text-sm text-gray-600">Calories</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">{scanResult.nutritionalInfo.fiber}</div>
                  <div className="text-sm text-gray-600">Fiber</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{scanResult.nutritionalInfo.vitaminC}</div>
                  <div className="text-sm text-gray-600">Vitamin C</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{scanResult.nutritionalInfo.potassium}</div>
                  <div className="text-sm text-gray-600">Potassium</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-12 bg-transparent">
              <Heart className="w-5 h-5 mr-2" />
              Save
            </Button>
            <Button className="h-12 bg-primary hover:bg-primary-600">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Add to List
            </Button>
          </div>

          <Button onClick={resetScan} className="w-full h-12 bg-secondary hover:bg-secondary-600">
            <Camera className="w-5 h-5 mr-2" />
            Scan Another Item
          </Button>
        </div>

        <NavigationBar />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col pb-20">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm p-4 relative z-10">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" className="text-white" asChild>
            <Link href="/home">
              <ArrowLeft className="w-6 h-6" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold text-white">Scan Produce</h1>
          <Button variant="ghost" size="icon" className="text-white">
            <RotateCcw className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative">
        {cameraActive ? (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-4">Camera Preview</p>
              <Button onClick={startCamera} variant="outline" className="text-white border-white bg-transparent">
                Start Camera
              </Button>
            </div>
          </div>
        )}

        {/* Scanning Overlay */}
        {isScanning && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Card className="mx-4 border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Analyzing...</h3>
                <p className="text-gray-600 text-sm">AI is examining your produce</p>
                <div className="mt-4 flex justify-center">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Scan Frame */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 border-4 border-white/50 rounded-lg relative">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-black/50 backdrop-blur-sm p-4">
        <div className="text-center text-white mb-4">
          <p className="text-sm opacity-80">Position the produce within the frame</p>
        </div>

        {/* Scan Button */}
        <div className="flex justify-center">
          <Button
            onClick={simulateScan}
            disabled={isScanning}
            className="w-20 h-20 rounded-full bg-primary hover:bg-primary-600 disabled:opacity-50"
          >
            {isScanning ? (
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Camera className="w-8 h-8" />
            )}
          </Button>
        </div>

        {/* Tips */}
        <div className="mt-4 flex items-center justify-center space-x-4 text-white/70 text-sm">
          <div className="flex items-center space-x-1">
            <AlertCircle className="w-4 h-4" />
            <span>Good lighting helps</span>
          </div>
          <div className="flex items-center space-x-1">
            <Lightbulb className="w-4 h-4" />
            <span>Hold steady</span>
          </div>
        </div>
      </div>

      <NavigationBar />
    </div>
  )
}
