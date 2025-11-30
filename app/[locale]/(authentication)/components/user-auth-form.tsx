"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useI18n } from "@/locales/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// We use API routes for auth to ensure cookies can be set
import { useCurrentLocale } from "@/locales/client"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [mode, setMode] = React.useState<"login" | "signup">("login")
  const router = useRouter()
  const t = useI18n()
  const locale = useCurrentLocale()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup"
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, password: values.password, locale }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const message = data?.error || t("auth.errors.signInFailed")
        throw new Error(message)
      }
      toast.success(mode === "login" ? t("auth.signIn") : t("auth.signUp"), { description: t("auth.success") })
      router.push("/dashboard")
    } catch (error) {
      console.error(error)
      toast.error(t("error"), {
        description: error instanceof Error ? error.message : t("auth.errors.signInFailed"),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Tabs value={mode} onValueChange={(v) => setMode(v as "login" | "signup")}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="login">{t("auth.tabs.password")}</TabsTrigger>
          <TabsTrigger value="signup">{t("auth.signUp")}</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <AuthForm
            form={form}
            isLoading={isLoading}
            onSubmit={onSubmit}
            modeLabel={t("auth.signIn")}
          />
        </TabsContent>

        <TabsContent value="signup">
          <AuthForm
            form={form}
            isLoading={isLoading}
            onSubmit={onSubmit}
            modeLabel={t("auth.signUp")}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AuthForm({
  form,
  isLoading,
  onSubmit,
  modeLabel,
}: {
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>
  isLoading: boolean
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>
  modeLabel: string
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Email</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  placeholder="you@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Password</FormLabel>
              <FormControl>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  autoComplete={modeLabel === "Sign Up" ? "new-password" : "current-password"}
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading} type="submit">
          {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : null}
          {modeLabel}
        </Button>
      </form>
    </Form>
  )
}
