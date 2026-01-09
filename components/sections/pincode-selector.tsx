"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { useDelivery } from "@/lib/hooks/use-delivery"

interface PincodeSelectorProps {
  onPricingUpdate: (charge: number, days: number) => void
}

export function PincodeSelector({ onPricingUpdate }: PincodeSelectorProps) {
  const { pincode, isLoading, error, fetchDeliveryCharge, validatePincode } = useDelivery()
  const [inputValue, setInputValue] = useState(pincode)
  const [deliveryInfo, setDeliveryInfo] = useState<any>(null)

  const handlePincodeChange = async (value: string) => {
    setInputValue(value)

    if (value.length === 6 && validatePincode(value)) {
      const charge = await fetchDeliveryCharge(value)
      if (charge !== null) {
        setDeliveryInfo({ charge, days: 3 })
        onPricingUpdate(charge, 3)
      }
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold mb-4">Enter Delivery Pincode</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-2">Pincode</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter 6-digit pincode"
            value={inputValue}
            onChange={(e) => handlePincodeChange(e.target.value)}
            maxLength={6}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground mt-1">e.g., 110001</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {deliveryInfo && (
          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-green-600">Delivery Available</p>
                <p className="text-sm text-green-600 mt-1">
                  <strong>Charge:</strong> ₹{deliveryInfo.charge}
                </p>
                <p className="text-sm text-green-600">
                  <strong>Delivery:</strong> {deliveryInfo.days}-4 business days
                </p>
              </div>
            </div>
          </div>
        )}

        {isLoading && <p className="text-sm text-muted-foreground">Checking delivery availability...</p>}
      </div>
    </Card>
  )
}
