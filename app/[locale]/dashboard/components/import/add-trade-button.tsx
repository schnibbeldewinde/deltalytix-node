"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createTradeWithDefaults } from "@/lib/trade-factory"
import { saveTradesAction } from "@/server/database"
import { useData } from "@/context/data-provider"
import { toast } from "sonner"
import { useUserStore } from "@/store/user-store"

type Side = "long" | "short"

const toLocalString = (val: string) => val.replace(/Z$/, "")

const parseDateTimeLocal = (val: string) => {
  // datetime-local -> "YYYY-MM-DDTHH:MM" or with seconds
  if (!val) return ""
  const hasSeconds = val.split(":").length === 3
  return hasSeconds ? val : `${val}:00`
}

export default function AddTradeButton() {
  const { refreshTrades } = useData()
  const accounts = useUserStore(state => state.accounts)
  const accountOptions = Array.from(new Set((accounts || []).map(acc => acc.number))).filter(Boolean)
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [accountNumber, setAccountNumber] = useState("")
  const [instrument, setInstrument] = useState("")
  const [side, setSide] = useState<Side>("long")
  const [quantity, setQuantity] = useState(1)
  const [entryPrice, setEntryPrice] = useState("")
  const [closePrice, setClosePrice] = useState("")
  const [entryDate, setEntryDate] = useState("")
  const [closeDate, setCloseDate] = useState("")
  const [commission, setCommission] = useState(0)
  const [comment, setComment] = useState("")

  const reset = () => {
    setAccountNumber("")
    setInstrument("")
    setSide("long")
    setQuantity(1)
    setEntryPrice("")
    setClosePrice("")
    setEntryDate("")
    setCloseDate("")
    setCommission(0)
    setComment("")
  }

  const computePnl = () => {
    const qty = Number(quantity) || 0
    const entry = parseFloat(entryPrice || "0")
    const exit = parseFloat(closePrice || "0")
    if (!qty || isNaN(entry) || isNaN(exit)) return 0
    const diff = side === "long" ? exit - entry : entry - exit
    return diff * qty
  }

  const handleSave = async () => {
    if (!instrument || !entryPrice || !closePrice || !entryDate || !closeDate) {
      toast.error("Bitte alle Pflichtfelder ausfüllen.")
      return
    }
    setIsSaving(true)
    try {
      const pnl = computePnl()
      const entryDateStr = parseDateTimeLocal(entryDate)
      const closeDateStr = parseDateTimeLocal(closeDate)
      const trade = createTradeWithDefaults({
        accountNumber,
        instrument,
        side,
        quantity,
        entryPrice: entryPrice,
        closePrice: closePrice,
        entryDate: entryDateStr,
        closeDate: closeDateStr,
        pnl,
        commission,
        timeInPosition: (new Date(closeDateStr).getTime() - new Date(entryDateStr).getTime()) / 1000,
        comment,
      })
      const res = await saveTradesAction([trade])
      if (res.error) {
        toast.error("Speichern fehlgeschlagen", { description: res.error })
      } else {
        toast.success("Trade gespeichert")
        await refreshTrades()
        setOpen(false)
        reset()
      }
    } catch (err: any) {
      console.error(err)
      toast.error("Speichern fehlgeschlagen", { description: err?.message || "Unbekannter Fehler" })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Add Trade
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Manuellen Trade anlegen</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Account</Label>
              <div className="flex gap-2">
                <Select value={accountNumber} onValueChange={(v) => setAccountNumber(v)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Vorhandene wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountOptions.length === 0 && <SelectItem value="">Keine Accounts</SelectItem>}
                    {accountOptions.map(acc => (
                      <SelectItem key={acc} value={acc}>{acc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  className="flex-1"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="oder neuen Account eingeben"
                />
              </div>
            </div>
            <div className="col-span-2">
              <Label>Instrument</Label>
              <Input value={instrument} onChange={(e) => setInstrument(e.target.value)} />
            </div>
            <div>
              <Label>Side</Label>
              <Select value={side} onValueChange={(v: Side) => setSide(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="long">Long</SelectItem>
                  <SelectItem value="short">Short</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Quantity</Label>
              <Input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value || "0", 10))} />
            </div>
            <div>
              <Label>Entry Price</Label>
              <Input value={entryPrice} onChange={(e) => setEntryPrice(e.target.value)} />
            </div>
            <div>
              <Label>Exit Price</Label>
              <Input value={closePrice} onChange={(e) => setClosePrice(e.target.value)} />
            </div>
            <div>
              <Label>Entry DateTime</Label>
              <Input type="datetime-local" value={toLocalString(entryDate)} onChange={(e) => setEntryDate(e.target.value)} />
            </div>
            <div>
              <Label>Exit DateTime</Label>
              <Input type="datetime-local" value={toLocalString(closeDate)} onChange={(e) => setCloseDate(e.target.value)} />
            </div>
            <div>
              <Label>Commission</Label>
              <Input type="number" value={commission} onChange={(e) => setCommission(parseFloat(e.target.value || "0"))} />
            </div>
            <div>
              <Label>PNL (auto)</Label>
              <Input readOnly value={computePnl().toFixed(2)} />
            </div>
            <div className="col-span-2">
              <Label>Kommentar</Label>
              <Textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isSaving}>Abbrechen</Button>
            <Button onClick={handleSave} disabled={isSaving}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
