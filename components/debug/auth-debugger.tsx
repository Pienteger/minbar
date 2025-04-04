"use client"

import {useAuth} from "@/contexts/auth-context"
import {Button} from "@/components/ui/button"
import {useState} from "react"

export function AuthDebugger() {
    const {isAuthenticated, isLoading, user} = useAuth()
    const [showDebug, setShowDebug] = useState(false)

    if (!showDebug) {
        return (
            <Button
                variant="outline"
                size="sm"
                className="fixed bottom-4 right-4 z-50 opacity-50 hover:opacity-100"
                onClick={() => setShowDebug(true)}
            >
                Debug Auth
            </Button>
        )
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 w-80 rounded-lg border bg-background p-4 shadow-lg">
            <div className="flex justify-between">
                <h3 className="font-semibold">Auth Debug</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowDebug(false)}>
                    ×
                </Button>
            </div>
            <div className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>Loading:</span>
                    <span
                        className={isLoading ? "text-yellow-500" : "text-green-500"}>{isLoading ? "True" : "False"}</span>
                </div>
                <div className="flex justify-between">
                    <span>Authenticated:</span>
                    <span className={isAuthenticated ? "text-green-500" : "text-red-500"}>
            {isAuthenticated ? "True" : "False"}
          </span>
                </div>
                <div className="flex justify-between">
                    <span>User:</span>
                    <span>{user ? user.name : "None"}</span>
                </div>
                {user && (
                    <div className="mt-2 rounded border p-2">
                        <pre className="text-xs overflow-auto max-h-40">{JSON.stringify(user, null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    )
}

