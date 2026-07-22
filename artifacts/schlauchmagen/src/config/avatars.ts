export interface AvatarPreset {
  id: string;
  name: string;
  label: string;
  emoji: string;
  /** URL for the avatar GLB.
   *  - Prefix "local:" means served from /public (e.g. "local:avatars/face.glb").
   *    These are always available and load instantly — photorealistic ARKit face.
   *  - Absolute https:// URLs point to Ready Player Me avatars.
   *    They load when models.readyplayer.me is reachable; fall back to procedural head if not.
   *
   *  To use your own RPM avatar:
   *  1. Go to https://readyplayer.me and create an avatar
   *  2. Copy the GLB link and append ?morphTargets=ARKit&textureAtlas=1024
   *  3. Replace the `url` field below with your link
   */
  url: string;
}

const RPM = "?morphTargets=ARKit&textureAtlas=1024";

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: "lisa",
    name: "Lisa",
    label: "Realistisch",
    emoji: "👩",
    url: "local:avatars/face.glb",
  },
  {
    id: "max",
    name: "Max",
    label: "Männlich · RPM",
    emoji: "👨",
    url: `https://models.readyplayer.me/65209e6de9cfc8bd9427e22e.glb${RPM}`,
  },
  {
    id: "anna",
    name: "Anna",
    label: "Weiblich · RPM",
    emoji: "👩‍🦱",
    url: `https://models.readyplayer.me/6516f7d48f8e5b4a7e2c9a1b.glb${RPM}`,
  },
  {
    id: "tom",
    name: "Tom",
    label: "Männlich · RPM",
    emoji: "👨‍🦲",
    url: `https://models.readyplayer.me/6409ac549c2dc33f5b9df99d.glb${RPM}`,
  },
];

export const DEFAULT_AVATAR_ID = "lisa";

export function getAvatarById(id: string): AvatarPreset {
  return AVATAR_PRESETS.find((a) => a.id === id) ?? AVATAR_PRESETS[0];
}

const LS_KEY = "slm_avatar_id";

export function loadSavedAvatarId(): string {
  try {
    return localStorage.getItem(LS_KEY) ?? DEFAULT_AVATAR_ID;
  } catch {
    return DEFAULT_AVATAR_ID;
  }
}

export function saveAvatarId(id: string): void {
  try {
    localStorage.setItem(LS_KEY, id);
  } catch {}
}
