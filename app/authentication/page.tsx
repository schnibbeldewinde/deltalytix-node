import { redirect } from "next/navigation"

const DEFAULT_LOCALE = "en"

export default function AuthenticationRedirect() {
  redirect(`/${DEFAULT_LOCALE}/authentication`)
}
