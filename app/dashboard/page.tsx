import { redirect } from "next/navigation";

const DEFAULT_LOCALE = "en";

export default function DashboardRedirect() {
  redirect(`/${DEFAULT_LOCALE}/dashboard`);
}
