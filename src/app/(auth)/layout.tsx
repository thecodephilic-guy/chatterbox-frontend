import React from "react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-orange-600">ChatterBox</h2>
          <p className="mt-2 text-sm text-orange-500">Connect with friends in real-time</p>
        </div>
        {children}
      </div>
    </div>
  )
}