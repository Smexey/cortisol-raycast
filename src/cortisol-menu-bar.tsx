import { Color, Icon, LaunchProps, MenuBarExtra } from "@raycast/api";
import { useEffect } from "react";

import {
  CortisolLevel,
  LEVEL_DETAILS,
  formatLevel,
  getIncreasedLevel,
  getLoweredLevel,
  normalizeLevel,
  useCortisolLevel,
} from "./cortisol";

type CortisolMenuBarLaunchContext = {
  level?: CortisolLevel;
  refreshedAt?: number;
};

export default function Command({ launchContext }: LaunchProps<{ launchContext: CortisolMenuBarLaunchContext }>) {
  const { level, setLevel, refreshLevel, isLoading } = useCortisolLevel();
  const details = LEVEL_DETAILS[level];

  useEffect(() => {
    if (launchContext?.level) {
      void refreshLevel(normalizeLevel(launchContext.level));
    }
  }, [launchContext?.level, launchContext?.refreshedAt, refreshLevel]);

  async function updateLevel(nextLevel: CortisolLevel) {
    await setLevel(nextLevel);
  }

  return (
    <MenuBarExtra
      icon={{ source: details.menuBarIcon, tintColor: Color.PrimaryText }}
      isLoading={isLoading}
      tooltip={`Cortisol: ${formatLevel(level)}`}
    >
      <MenuBarExtra.Section title="Cortisol Meter">
        <MenuBarExtra.Item
          icon={{ source: Icon.CircleFilled, tintColor: details.color }}
          title={`Current: ${formatLevel(level)}`}
        />
      </MenuBarExtra.Section>
      <MenuBarExtra.Section>
        <MenuBarExtra.Item
          icon={Icon.ArrowUp}
          title="Increase Cortisol"
          onAction={() => updateLevel(getIncreasedLevel(level))}
        />
        <MenuBarExtra.Item
          icon={Icon.ArrowDown}
          title="Lower Cortisol"
          onAction={() => updateLevel(getLoweredLevel(level))}
        />
      </MenuBarExtra.Section>
    </MenuBarExtra>
  );
}
