"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, X } from "lucide-react";

interface CreateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (template: any) => void;
}

export function CreateTemplateDialog({ open, onOpenChange, onSuccess }: CreateTemplateDialogProps) {
  const [name, setName] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState("public");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Template name is required.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/user/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          tags,
          visibility,
        }),
      });

      const data = await res.json();
      if (res.ok && data.template) {
        onSuccess(data.template);
        onOpenChange(false);
        // Reset form
        setName("");
        setTags([]);
        setVisibility("public");
      } else {
        setError(data.error || "Failed to create template.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] border border-white/[0.08] bg-[#0A0A0A] text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">Create Template</DialogTitle>
          <DialogDescription className="text-white/50 text-xs">
            Publish your current profile setup as a template for others to use.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Template Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dark Anime Aesthetic"
              className="border-white/10 bg-white/[0.02] placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/20 h-11"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Tags (max 5)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <div key={tag} className="flex items-center gap-1 rounded-md bg-white/[0.06] border border-white/10 px-2 py-1 text-xs text-white/80">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="text-white/40 hover:text-white transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type a tag and press Enter"
              disabled={tags.length >= 5}
              className="border-white/10 bg-white/[0.02] placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/20 h-11"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Visibility</label>
            <Select value={visibility} onValueChange={setVisibility}>
              <SelectTrigger className="border-white/10 bg-white/[0.02] h-11">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent className="bg-[#0A0A0A] border-white/10 text-white">
                <SelectItem value="public">Public (Visible on template list)</SelectItem>
                <SelectItem value="unlisted">Unlisted (Direct link only)</SelectItem>
                <SelectItem value="private">Private (Only you can see)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Show Profile Preview</label>
              <p className="text-xs text-white/40">Your current active profile will be previewed.</p>
            </div>
            <Switch checked={true} disabled />
          </div>

          {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="hover:bg-white/5 h-10">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-white text-black hover:bg-white/90 font-semibold h-10"
          >
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Publish Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
