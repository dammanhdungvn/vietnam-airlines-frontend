import type React from "react"
import { cn } from "@/lib/utils"

interface Step {
  number: number
  title: string
  subtitle: string
  icon: React.ComponentType<any>
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

/**
 * Component hiển thị các bước trong quy trình
 * Sử dụng trong trang đăng ký hộ để chỉ báo tiến độ
 */
export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6 mb-8 flex-wrap">
      {steps.map((step, index) => {
        const Icon = step.icon
        const isActive = step.number === currentStep
        const isCompleted = step.number < currentStep
        const isConnected = index < steps.length - 1

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center border-2 mb-2",
                  isActive
                    ? "bg-orange-500 border-orange-500 text-white"
                    : isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-white border-gray-300 text-gray-400",
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-center">
                <p className={cn("font-medium text-sm", isActive ? "text-orange-600" : "text-gray-600")}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.subtitle}</p>
              </div>
            </div>

            {isConnected && (
              <div
                className={cn(
                  "h-0.5 w-8 sm:w-12 mx-3 sm:mx-4",
                  isCompleted ? "bg-green-500" : "bg-gray-300",
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
