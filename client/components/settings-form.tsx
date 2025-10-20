"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Settings } from "@/lib/types"
import { fetchAdminAPI } from "@/lib/api"

interface SettingsFormProps {
  adminToken: string
  initialSettings: Settings
}

export function SettingsForm({ adminToken, initialSettings }: SettingsFormProps) {
  const [settings, setSettings] = useState(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await fetchAdminAPI("/admin/settings", adminToken, {
        method: "POST",
        body: JSON.stringify(settings),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error("Failed to save settings:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleTipPresetChange = (index: number, value: string) => {
    const newPresets = [...settings.tipPresets]
    newPresets[index] = Number.parseFloat(value) || 0
    setSettings({ ...settings, tipPresets: newPresets })
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your restaurant settings</p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Fees & Tax</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tax">Tax Percentage (%)</Label>
              <Input
                id="tax"
                type="number"
                step="0.1"
                value={settings.taxPercent}
                onChange={(e) => setSettings({ ...settings, taxPercent: Number.parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="service-fee">Service Fee Percentage (%)</Label>
              <Input
                id="service-fee"
                type="number"
                step="0.1"
                value={settings.serviceFeePercent}
                onChange={(e) =>
                  setSettings({ ...settings, serviceFeePercent: Number.parseFloat(e.target.value) || 0 })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tip Presets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {settings.tipPresets.map((preset, index) => (
                <div key={index}>
                  <Label htmlFor={`tip-${index}`}>Preset {index + 1} (%)</Label>
                  <Input
                    id={`tip-${index}`}
                    type="number"
                    step="1"
                    value={preset}
                    onChange={(e) => handleTipPresetChange(index, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={isSaving} className="w-full" size="lg">
          {isSaving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}
