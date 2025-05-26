"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/page-header"
import { useToast } from "@/hooks/use-toast"
import { User, Upload, X } from "lucide-react"
import { useUser } from "@/contexts/user-context"

export function ProfileInformation() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { avatar, setAvatar, userInfo, setUserInfo } = useUser()
  const [formData, setFormData] = useState({
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    email: "john.smith@adamscounty.gov",
    jobTitle: userInfo.jobTitle,
    department: "City Management",
    phone: "(303) 555-1234",
    timezone: "America/Denver",
  })

  const breadcrumbItems = [
    { label: "User Settings", path: "user-settings", isClickable: false },
    { label: "Profile Information", isCurrent: true },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Update userInfo if the field is relevant
    if (name === "firstName" || name === "lastName" || name === "jobTitle") {
      setUserInfo({
        ...userInfo,
        [name]: value,
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          duration: 3000,
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        setAvatar(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeAvatar = () => {
    setAvatar(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSave = () => {
    // Update userInfo with the latest values
    setUserInfo({
      firstName: formData.firstName,
      lastName: formData.lastName,
      jobTitle: formData.jobTitle,
    })

    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
      duration: 3000,
    })
  }

  return (
    <div className="p-6 pt-0">
      <PageHeader
        title="Profile Information"
        description="Manage your personal information and preferences"
        breadcrumbItems={breadcrumbItems}
      />

      <div className="mt-8 space-y-6">
        {/* Avatar Section */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div
                  className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-gray-200"
                  onClick={handleAvatarClick}
                >
                  {avatar ? (
                    <img src={avatar || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                {avatar && (
                  <button
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1"
                    onClick={removeAvatar}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
              <div>
                <Button variant="outline" size="sm" className="flex items-center" onClick={handleAvatarClick}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                </Button>
                <p className="text-sm text-gray-500 mt-2">Recommended: Square JPG or PNG, max 5MB</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Information */}
        <Card>
          <CardHeader>
            <CardTitle>Work Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input id="jobTitle" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" name="department" value={formData.department} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={formData.timezone} onValueChange={(value) => handleSelectChange("timezone", value)}>
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="America/Anchorage">Alaska Time (AKT)</SelectItem>
                    <SelectItem value="Pacific/Honolulu">Hawaii Time (HT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-[#3BD1BB] hover:bg-[#2ab19e] text-white">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
