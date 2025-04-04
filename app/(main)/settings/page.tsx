import {SettingsPage} from "@/components/settings/settings-page"
import {ProtectedRoute} from "@/components/protected-route"

export default function Settings() {
    return (
        <ProtectedRoute>
            <SettingsPage/>
        </ProtectedRoute>
    )
}

