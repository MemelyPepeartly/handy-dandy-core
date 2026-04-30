export type LegacyTool = SceneControls.Tool & {
  onChange?: (...args: unknown[]) => void;
};

export type ToolCollection = LegacyTool[] | Record<string, LegacyTool>;

export type ControlWithToolCollection = Omit<SceneControls.Control, "tools"> & {
  layer?: string;
  tools: ToolCollection;
  onChange?: (...args: unknown[]) => void;
  onToolChange?: (...args: unknown[]) => void;
};

export type ControlCollection = SceneControls.Control[] | Record<string, ControlWithToolCollection>;

export interface HandyDandyToolRegistration {
  id: string;
  title: string;
  icon: string;
  description: string;
  location: string;
  onClick?: () => void | Promise<void>;
  buttonLabel?: string;
  buttonIcon?: string;
  showInHandyGroup?: boolean;
}

const handyTools = new Map<string, HandyDandyToolRegistration>();
const controlGroups = new Map<string, ControlWithToolCollection>();

function refreshSceneControls(): void {
  const controls = ui.controls as { render?: (options?: { reset?: boolean }) => unknown } | undefined;
  controls?.render?.({ reset: true });
}

export function registerHandyTool(tool: HandyDandyToolRegistration): void {
  handyTools.set(tool.id, tool);
  if (game.ready) {
    refreshSceneControls();
  }
}

export function getRegisteredHandyTools(): HandyDandyToolRegistration[] {
  return [...handyTools.values()];
}

export async function invokeHandyTool(toolId: string): Promise<void> {
  const tool = handyTools.get(toolId);
  if (!tool?.onClick) {
    return;
  }

  try {
    await tool.onClick();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    ui.notifications?.error(`Handy Dandy tool failed: ${message}`);
    console.error(`Handy Dandy tool failed: ${toolId}`, error);
  }
}

export function registerControlGroup(control: ControlWithToolCollection): void {
  controlGroups.set(control.name, control);
  if (game.ready) {
    refreshSceneControls();
  }
}

export function getRegisteredControlGroups(): ControlWithToolCollection[] {
  return [...controlGroups.values()];
}

export function redrawSceneControls(): void {
  refreshSceneControls();
}
