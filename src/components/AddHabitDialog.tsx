import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

const PRESETS = [
  { name: "Coding Practice", icon: "💻", target: 120 },
  { name: "Healthy Exercise", icon: "🏃", target: 30 },
  { name: "Meditation", icon: "🧘", target: 10 },
  { name: "Good Sleep Routine", icon: "😴", target: 480 },
  { name: "Revise Yesterday's Topics", icon: "📖", target: 30 },
  { name: "Subject Revision", icon: "📚", target: 60 },
  { name: "Read Books/Articles", icon: "📕", target: 30 },
  { name: "Communication Skills", icon: "🗣️", target: 30 },
  { name: "Relax & Play Games", icon: "🎮", target: 30 },
];

interface Props {
  onAdd: (habit: { name: string; icon: string; target_minutes: number; description?: string }) => void;
}

const AddHabitDialog = ({ onAdd }: Props) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("📌");
  const [target, setTarget] = useState(60);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), icon, target_minutes: target });
    setName("");
    setIcon("📌");
    setTarget(60);
    setOpen(false);
  };

  const handlePreset = (preset: typeof PRESETS[0]) => {
    onAdd({ name: preset.name, icon: preset.icon, target_minutes: preset.target });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary text-primary-foreground gap-2">
          <Plus className="w-4 h-4" /> Add Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">Add New Habit</DialogTitle>
        </DialogHeader>

        {/* Presets */}
        <div className="space-y-2">
          <Label className="text-secondary-foreground text-xs">Quick Add</Label>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => handlePreset(p)}
                className="flex items-center gap-2 p-2 rounded-lg bg-secondary hover:bg-primary/10 hover:border-primary/20 border border-transparent text-xs text-left transition-all"
              >
                <span>{p.icon}</span>
                <span className="text-foreground truncate">{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-border my-2" />

        {/* Custom */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-secondary-foreground">Habit Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Practice DSA"
              className="bg-secondary border-border"
            />
          </div>
          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <Label className="text-secondary-foreground">Icon</Label>
              <Input
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="bg-secondary border-border text-center text-lg"
                maxLength={2}
              />
            </div>
            <div className="space-y-2 flex-1">
              <Label className="text-secondary-foreground">Target (min)</Label>
              <Input
                type="number"
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="bg-secondary border-border"
                min={1}
              />
            </div>
          </div>
          <Button onClick={handleSubmit} className="w-full gradient-primary text-primary-foreground">
            Add Custom Habit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitDialog;
