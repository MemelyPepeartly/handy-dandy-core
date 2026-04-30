import {
  getRegisteredControlGroups,
  getRegisteredHandyTools,
  invokeHandyTool,
  type ControlCollection,
  type ControlWithToolCollection,
  type LegacyTool,
  type ToolCollection,
} from "../core/registry";


type HybridToolArray = LegacyTool[] & Record<string, LegacyTool>;
type HybridControlArray = SceneControls.Control[] & Record<string, ControlWithToolCollection>;

function getCurrentGame(): ReadyGame {
  return game as ReadyGame;
}

function getControlOrder(collection: ControlCollection): number {
  return Array.isArray(collection) ? collection.length : Object.keys(collection).length;
}

function getToolOrder(collection: ToolCollection): number {
  return Array.isArray(collection) ? collection.length : Object.keys(collection).length;
}

function useObjectToolCollections(): boolean {
  const currentGame = getCurrentGame();
  const releaseGeneration = Number(currentGame.release?.generation ?? 0);
  if (Number.isFinite(releaseGeneration) && releaseGeneration !== 0) {
    return releaseGeneration >= 13;
  }

  const versionMajor = Number(currentGame.version?.split(".")[0] ?? 0);
  if (Number.isFinite(versionMajor) && versionMajor !== 0) {
    return versionMajor >= 13;
  }

  return false;
}

function compatibilityAddControl(collection: ControlCollection, control: ControlWithToolCollection): void {
  if (Array.isArray(collection)) {
    collection.push(control as unknown as SceneControls.Control);
    (collection as HybridControlArray)[control.name] = control;
  } else {
    collection[control.name] = control;
  }
}

function compatibilityAddTool(collection: ToolCollection, tool: LegacyTool): void {
  if (Array.isArray(collection)) {
    collection.push(tool);
    (collection as HybridToolArray)[tool.name] = tool;
  } else {
    collection[tool.name] = tool;
  }
}

function resolveToggleActive(args: unknown[], fallback = false, toolName?: string): boolean {
  const second = args[1];
  if (typeof second === "boolean") {
    return second;
  }

  const first = args[0];
  if (typeof first === "boolean") {
    return first;
  }

  if (toolName) {
    const controlsState = ui.controls as { control?: { tools?: ToolCollection } } | null | undefined;
    const tools = controlsState?.control?.tools;
    if (Array.isArray(tools)) {
      const match = tools.find((candidate) => candidate?.name === toolName);
      if (typeof match?.active === "boolean") {
        return match.active;
      }
    } else if (tools && typeof tools === "object") {
      const record = tools as Record<string, SceneControls.Tool | undefined>;
      const match = record[toolName];
      if (typeof match?.active === "boolean") {
        return match.active;
      }
    }
  }

  return fallback;
}

function requireNamespace(): NonNullable<Game["handyDandy"]> {
  const namespace = (getCurrentGame() as ReadyGame & Game).handyDandy;
  if (!namespace) {
    ui.notifications?.error("Handy Dandy Core is not initialized.");
    throw new Error("Handy Dandy Core is not initialized.");
  }
  return namespace;
}

function cloneToolCollection(tools: ToolCollection): ToolCollection {
  return Array.isArray(tools) ? [...tools] : { ...tools };
}

function cloneControlGroup(control: ControlWithToolCollection): ControlWithToolCollection {
  return {
    ...control,
    tools: cloneToolCollection(control.tools),
  };
}

export function insertSidebarButtons(controls: ControlCollection): void {
  for (const registeredControl of getRegisteredControlGroups()) {
    compatibilityAddControl(controls, cloneControlGroup(registeredControl));
  }

  const handyGroupTools: ToolCollection = useObjectToolCollections() ? {} : [];
  const handyGroup: ControlWithToolCollection = {
    name: "handy-dandy",
    order: getControlOrder(controls),
    title: "Handy Dandy Tools",
    icon: "fa-solid fa-screwdriver-wrench",
    layer: "interface",
    visible: true,
    activeTool: "",
    onChange: () => {
      /* noop for legacy Foundry compatibility */
    },
    onToolChange: () => {
      /* noop for legacy Foundry compatibility */
    },
    tools: handyGroupTools,
  };

  compatibilityAddTool(handyGroup.tools, {
    name: "tool-guide",
    order: getToolOrder(handyGroup.tools),
    title: "Tool Guide",
    icon: "fa-solid fa-compass",
    toggle: true,
    onChange: (...args) => {
      const toggled = resolveToggleActive(args, false, "tool-guide");
      const handyDandy = requireNamespace();
      const toolOverview = handyDandy.applications.toolOverview;
      if (toggled) {
        toolOverview.render(true);
      } else {
        void toolOverview.close();
      }
    },
  });

  for (const tool of getRegisteredHandyTools()) {
    if (tool.showInHandyGroup === false || !tool.onClick) {
      continue;
    }

    compatibilityAddTool(handyGroup.tools, {
      name: tool.id,
      order: getToolOrder(handyGroup.tools),
      title: tool.title,
      icon: tool.icon,
      button: true,
      onChange: () => {
        void invokeHandyTool(tool.id);
      },
    });
  }

  compatibilityAddControl(controls, handyGroup);
}
