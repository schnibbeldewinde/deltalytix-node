import en from "./en"

const dict = en as Record<string, any>

function humanize(key: string) {
  const last = key.split(".").pop() || key
  const withSpaces = last
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1)
}

function resolveKey(key: string, params?: Record<string, any>) {
  let value: any = dict[key]
  if (value === undefined) {
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

export async function getI18n() {
  return (key: string, params?: Record<string, any>) => resolveKey(key, params)
}

export async function getScopedI18n() {
  return (key: string, params?: Record<string, any>) => resolveKey(key, params)
}

export async function getCurrentLocale() {
  return "en"
}
