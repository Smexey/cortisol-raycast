import { Color, Icon, MenuBarExtra } from "@raycast/api";
import { useLocalStorage } from "@raycast/utils";

import {
  CortisolLevel,
  DEFAULT_LEVEL,
  LEVEL_DETAILS,
  STORAGE_KEY,
  formatLevel,
  getIncreasedLevel,
  getLoweredLevel,
  normalizeLevel,
} from "./cortisol";

export default function Command() {
  const { value, setValue, isLoading } = useLocalStorage<CortisolLevel>(STORAGE_KEY, DEFAULT_LEVEL);
  const level = normalizeLevel(value);
  const details = LEVEL_DETAILS[level];

  async function updateLevel(nextLevel: CortisolLevel) {
    await setValue(nextLevel);
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
        <MenuBarExtra.Item icon={Icon.RotateClockwise} title="Reset to Medium" onAction={() => updateLevel("medium")} />
      </MenuBarExtra.Section>
    </MenuBarExtra>
  );
}
