"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { PageHeader } from "@/components/page-header"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function SecuritySettings() {
  const { toast } = useToast()
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState(true)
  const [loginNotifications, setLoginNotifications] = useState(true)
  const [passwordStrength, setPasswordStrength] = useState<number>(0)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const breadcrumbItems = [
    { label: "User Settings", path: "user-settings", isClickable: false },
    { label: "Security Settings", isCurrent: true },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))

    if (name === "newPassword") {
      checkPasswordStrength(value)
    }

    if (name === "confirmPassword") {
      if (value !== passwordForm.newPassword) {
        setPasswordError("Passwords do not match")
      } else {
        setPasswordError(null)
      }
    }
  }

  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(0)
      return
    }

    let strength = 0
    // Length check
    if (password.length >= 8) strength += 1
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1
    // Contains number
    if (/[0-9]/.test(password)) strength += 1
    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    setPasswordStrength(strength)
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "Very Weak"
    if (passwordStrength === 1) return "Weak"
    if (passwordStrength === 2) return "Fair"
    if (passwordStrength === 3) return "Good"
    if (passwordStrength === 4) return "Strong"
    return "Very Strong"
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500"
    if (passwordStrength === 2) return "bg-orange-500"
    if (passwordStrength === 3) return "bg-yellow-500"
    if (passwordStrength >= 4) return "bg-green-500"
    return ""
  }

  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    if (passwordStrength < 3) {
      setPasswordError("Please choose a stronger password")
      return
    }

    // Reset form
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setPasswordStrength(0)
    setPasswordError(null)

    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
      duration: 3000,
    })
  }

  const handleToggleTwoFactor = () => {
    const newState = !twoFactorEnabled
    setTwoFactorEnabled(newState)

    toast({
      title: newState ? "Two-Factor Authentication Enabled" : "Two-Factor Authentication Disabled",
      description: newState
        ? "Your account is now more secure with two-factor authentication."
        : "Two-factor authentication has been disabled for your account.",
      duration: 3000,
    })
  }

  return (
    <div className="p-6 pt-0">
      <PageHeader
        title="Security Settings"
        description="Manage your account security and authentication preferences"
        breadcrumbItems={breadcrumbItems}
      />

      <div className="mt-8 space-y-6">
        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password to maintain account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={handleInputChange}
              />

              {passwordForm.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Password Strength: {getPasswordStrengthText()}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Password should be at least 8 characters and include uppercase, lowercase, numbers, and special
                    characters.
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handleInputChange}
              />
            </div>

            {passwordError && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}

            <Button onClick={handleChangePassword} className="bg-[#3BD1BB] hover:bg-[#2ab19e] text-white mt-2">
              Update Password
            </Button>
          </CardContent>
        </Card>

        {/* Two-Factor Authentication */}
        <Card>
          <CardHeader>
            <CardTitle>Two-Factor Authentication</CardTitle>
            <CardDescription>Add an extra layer of security to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Enable Two-Factor Authentication</h4>
                <p className="text-sm text-gray-500">Require a verification code when logging in</p>
              </div>
              <Switch checked={twoFactorEnabled} onCheckedChange={handleToggleTwoFactor} />
            </div>

            {twoFactorEnabled && (
              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Two-Factor Authentication Enabled</AlertTitle>
                <AlertDescription>
                  You will be asked for a verification code when logging in from a new device or browser.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Session Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Session Settings</CardTitle>
            <CardDescription>Manage your login sessions and security preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Automatic Session Timeout</h4>
                <p className="text-sm text-gray-500">Automatically log out after 30 minutes of inactivity</p>
              </div>
              <Switch checked={sessionTimeout} onCheckedChange={setSessionTimeout} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Login Notifications</h4>
                <p className="text-sm text-gray-500">Receive email notifications for new login attempts</p>
              </div>
              <Switch checked={loginNotifications} onCheckedChange={setLoginNotifications} />
            </div>

            <div className="pt-4">
              <Button variant="outline" className="w-full">
                Log Out of All Devices
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={() => {
              toast({
                title: "Settings Saved",
                description: "Your security settings have been updated successfully.",
                duration: 3000,
              })
            }}
            className="bg-[#3BD1BB] hover:bg-[#2ab19e] text-white"
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
