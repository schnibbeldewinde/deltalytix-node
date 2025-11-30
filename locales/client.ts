"use client"

import React from "react"
import en from "./en"

const dict = en as Record<string, any>
const DEFAULT_LOCALE = "en"

function humanize(key: string) {
  const last = key.split(".").pop() || key
  // Insert spaces before capital letters and replace dashes/underscores
  const withSpaces = last
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1)
}

function resolveKey(key: string, params?: Record<string, any>) {
  // First try direct key (supports dotted keys stored flat)
  let value: any = dict[key]
  if (value === undefined) {
    // Fallback to nested lookup
    value = dict
    for (const part of key.split(".")) {
      value = value?.[part]
      if (value === undefined) break
    }
  }
  let finalValue = value ?? humanize(key)
  if (typeof finalValue === "string" && params) {
    finalValue = finalValue.replace(/\{(\w+)\}/g, (_, p) => (params[p] ?? `{${p}}`))
  }
  return finalValue
}

export function useI18n() {
  return (key: string, params?: Record<string, any>) => resolveKey(key, params)
}

export const useScopedI18n = useI18n
export const useCurrentLocale = () => DEFAULT_LOCALE
export const useChangeLocale = () => () => {}

export function I18nProviderClient({ children }: { children: React.ReactNode; locale?: string }) {
  return React.createElement(React.Fragment, null, children)
}
