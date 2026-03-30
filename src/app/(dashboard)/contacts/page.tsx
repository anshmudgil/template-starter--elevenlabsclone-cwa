"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { MissionPageHeader } from "@/components/mission-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useContacts, useCreateContact } from "@/hooks/use-mission-control";

export default function ContactsPage() {
  const { data: contacts = [], isLoading } = useContacts();
  const createContact = useCreateContact();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [category, setCategory] = useState("partner");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const submit = () => {
    const n = name.trim();
    if (!n) return;
    createContact.mutate(
      {
        name: n,
        role: role.trim() || null,
        category,
        email: email.trim() || null,
        notes: notes.trim() || null,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setName("");
          setRole("");
          setEmail("");
          setNotes("");
        },
      },
    );
  };

  return (
    <>
      <MissionPageHeader title="Contacts" description="People and vendors your team collaborates with." />
      <div className="flex min-h-0 flex-1 flex-col gap-4 p-6">
        <div className="flex justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Add contact
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>New contact</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3 py-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="c-name">Name</Label>
                  <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="c-role">Role</Label>
                  <Input id="c-role" value={role} onChange={(e) => setRole(e.target.value)} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="c-cat">Category</Label>
                  <Input
                    id="c-cat"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="partner, contractor, investor…"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="c-email">Email</Label>
                  <Input
                    id="c-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="c-notes">Notes</Label>
                  <Textarea id="c-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={submit} disabled={!name.trim() || createContact.isPending}>
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading contacts…</p>
        ) : contacts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No contacts yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Name</th>
                  <th className="px-4 py-2 font-medium">Role</th>
                  <th className="px-4 py-2 font-medium">Category</th>
                  <th className="px-4 py-2 font-medium">Email</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.role ?? "—"}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="capitalize">
                        {c.category}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{c.email ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
