import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";
import { useLocalStorage } from "@raycast/utils";

import {
  CortisolLevel,
  DEFAULT_LEVEL,
  LEVEL_DETAILS,
  LEVELS,
  STORAGE_KEY,
  formatLevel,
  getIncreasedLevel,
  getLoweredLevel,
  normalizeLevel,
  refreshMenuBar,
} from "./cortisol";

export default function Command() {
  const { value, setValue, isLoading } = useLocalStorage<CortisolLevel>(STORAGE_KEY, DEFAULT_LEVEL);
  const currentLevel = normalizeLevel(value);

  async function updateLevel(nextLevel: CortisolLevel) {
    await setValue(nextLevel);
    await refreshMenuBar();
  }

  return (
    <List isLoading={isLoading} isShowingDetail searchBarPlaceholder="Select a cortisol bucket">
      {LEVELS.map((level) => {
        const details = LEVEL_DETAILS[level];
        const isCurrent = level === currentLevel;

        return (
          <List.Item
            key={level}
            title={details.title}
            subtitle={details.description}
            icon={{ source: Icon.CircleFilled, tintColor: details.color }}
            accessories={[{ tag: isCurrent ? { color: Color.Green, value: "Current" } : undefined }]}
            detail={
              <List.Item.Detail
                markdown={detailMarkdown(level, isCurrent)}
                metadata={
                  <List.Item.Detail.Metadata>
                    <List.Item.Detail.Metadata.Label title="Bucket" text={details.title} />
                    <List.Item.Detail.Metadata.Label
                      title="Status"
                      icon={isCurrent ? Icon.CheckCircle : Icon.Circle}
                      text={isCurrent ? "Current" : "Available"}
                    />
                  </List.Item.Detail.Metadata>
                }
              />
            }
            actions={
              <ActionPanel>
                <ActionPanel.Section>
                  <Action
                    icon={Icon.CheckCircle}
                    title={`Set to ${details.title}`}
                    onAction={() => updateLevel(level)}
                  />
                  <Action
                    icon={Icon.ArrowUp}
                    shortcut={{ modifiers: ["cmd"], key: "arrowUp" }}
                    title="Increase Cortisol"
                    onAction={() => updateLevel(getIncreasedLevel(currentLevel))}
                  />
                  <Action
                    icon={Icon.ArrowDown}
                    shortcut={{ modifiers: ["cmd"], key: "arrowDown" }}
                    title="Lower Cortisol"
                    onAction={() => updateLevel(getLoweredLevel(currentLevel))}
                  />
                  <Action
                    icon={Icon.RotateClockwise}
                    shortcut={{ modifiers: ["cmd"], key: "r" }}
                    title="Reset to Medium"
                    onAction={() => updateLevel("medium")}
                  />
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        );
      })}
    </List>
  );
}

function detailMarkdown(level: CortisolLevel, isCurrent: boolean) {
  const details = LEVEL_DETAILS[level];
  const status = isCurrent ? "This is your current cortisol bucket." : "Select this bucket to make it current.";

  return `![${details.title}](${details.icon}?raycast-width=360&raycast-height=259)

# ${formatLevel(level)}

${details.description}

${status}`;
}
