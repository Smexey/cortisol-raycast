import { Action, ActionPanel, Color, Icon, List } from "@raycast/api";

import {
  CortisolLevel,
  LEVEL_DETAILS,
  LEVELS,
  formatLevel,
  getIncreasedLevel,
  getLoweredLevel,
  refreshMenuBar,
  useCortisolLevel,
} from "./cortisol";

export default function Command() {
  const { level: currentLevel, setLevel, isLoading } = useCortisolLevel();

  async function updateLevel(nextLevel: CortisolLevel) {
    await setLevel(nextLevel);
    await refreshMenuBar();
  }

  const currentDetails = LEVEL_DETAILS[currentLevel];

  return (
    <List isLoading={isLoading} isShowingDetail searchBarPlaceholder="Select a cortisol bucket">
      <List.Item
        title={`Current: ${formatLevel(currentLevel)}`}
        subtitle={currentDetails.description}
        icon="icon.png"
        accessories={[{ tag: { color: Color.Green, value: "Active" } }]}
        detail={
          <List.Item.Detail
            markdown={detailMarkdown(currentLevel, true)}
            metadata={
              <List.Item.Detail.Metadata>
                <List.Item.Detail.Metadata.Label
                  title="Current Bucket"
                  icon={{ source: currentDetails.menuBarIcon, tintColor: currentDetails.color }}
                  text={currentDetails.title}
                />
              </List.Item.Detail.Metadata>
            }
          />
        }
        actions={
          <ActionPanel>
            <ActionPanel.Section>
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
      {LEVELS.map((level) => {
        const details = LEVEL_DETAILS[level];
        const isCurrent = level === currentLevel;

        return (
          <List.Item
            key={level}
            title={details.title}
            subtitle={details.description}
            icon={
              isCurrent
                ? { source: details.menuBarIcon, tintColor: details.color }
                : { source: Icon.CircleFilled, tintColor: details.color }
            }
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

  return `![${details.title}](icon.png?raycast-width=256&raycast-height=256)

# ${formatLevel(level)}

${details.description}

${status}`;
}
