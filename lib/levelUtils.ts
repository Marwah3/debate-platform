// lib/levelUtils.ts

export interface LevelInfo {
  level: number;
  title: string;
  badgeColor: string;
  canSparingOffline: boolean;
  canLombaOffline: boolean;
}

export function getLevelInfo(level: number = 1): LevelInfo {
  if (level >= 10) {
    return {
      level,
      title: "Master Debater",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
      canSparingOffline: true,
      canLombaOffline: true,
    };
  } else if (level >= 5) {
    return {
      level,
      title: "Senior Debater",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
      canSparingOffline: true,
      canLombaOffline: false,
    };
  } else {
    return {
      level,
      title: "Junior Debater",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      canSparingOffline: false,
      canLombaOffline: false,
    };
  }
}