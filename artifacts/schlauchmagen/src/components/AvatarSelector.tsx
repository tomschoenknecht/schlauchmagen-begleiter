import { cn } from "@/lib/utils";
import { X, Check } from "lucide-react";
import { AVATAR_PRESETS, type AvatarPreset } from "@/config/avatars";

interface AvatarSelectorProps {
  selectedId: string;
  onSelect: (preset: AvatarPreset) => void;
  onClose: () => void;
}

export default function AvatarSelector({ selectedId, onSelect, onClose }: AvatarSelectorProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="absolute inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-white/10 shadow-2xl"
        style={{ background: "linear-gradient(180deg, #111b27 0%, #0d1520 100%)" }}>

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <div>
            <p className="text-white/90 font-semibold text-sm">Avatar auswählen</p>
            <p className="text-white/35 text-[11px] mt-0.5">Wird automatisch animiert &amp; synchronisiert</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center border border-white/10 text-white/40 hover:text-white/80 hover:bg-white/8 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Avatar grid */}
        <div className="grid grid-cols-4 gap-3 px-5 pb-8">
          {AVATAR_PRESETS.map((preset) => {
            const isSelected = preset.id === selectedId;
            return (
              <button
                key={preset.id}
                onClick={() => { onSelect(preset); onClose(); }}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-200",
                  isSelected
                    ? "border-emerald-400/70 bg-emerald-400/10 shadow-lg shadow-emerald-500/10"
                    : "border-white/10 hover:border-white/25 hover:bg-white/5",
                )}
              >
                {/* Check badge */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-black" />
                  </div>
                )}

                {/* Avatar emoji / icon */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all",
                    "border-2",
                    isSelected ? "border-emerald-400/60 bg-emerald-400/10" : "border-white/10 bg-white/5",
                  )}
                >
                  {preset.emoji}
                </div>

                <div className="flex flex-col items-center gap-0.5">
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      isSelected ? "text-emerald-300" : "text-white/80",
                    )}
                  >
                    {preset.name}
                  </span>
                  <span className="text-[10px] text-white/35">{preset.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
