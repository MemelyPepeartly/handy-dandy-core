import { CONSTANTS } from "./constants";
import {
  registerControlGroup,
  registerHandyTool,
  invokeHandyTool,
  redrawSceneControls,
  type ControlCollection,
} from "./core/registry";
import { registerSettings } from "./setup/settings";
import { insertSidebarButtons } from "./setup/sidebarButtons";
import { ToolOverview } from "./ui/tool-overview";

declare global {
  interface Game {
    handyDandy?: {
      openRouterSdk: unknown | null;
      openRouterClient: unknown | null;
      refreshAIClient: () => void;
      generation: Record<string, unknown>;
      applications: {
        toolOverview: ToolOverview;
      };
      dev: Record<string, unknown>;
      flows: Record<string, unknown>;
      core: {
        registerTool: typeof registerHandyTool;
        registerControlGroup: typeof registerControlGroup;
        invokeTool: typeof invokeHandyTool;
      };
    };
  }
}

function initializeNamespace(): void {
  const currentGame = game as InitGame & Game;
  const existing = currentGame.handyDandy;
  currentGame.handyDandy = {
    openRouterSdk: existing?.openRouterSdk ?? null,
    openRouterClient: existing?.openRouterClient ?? null,
    refreshAIClient: existing?.refreshAIClient ?? (() => undefined),
    generation: existing?.generation ?? {},
    applications: {
      toolOverview: existing?.applications?.toolOverview ?? new ToolOverview(),
    },
    dev: existing?.dev ?? {},
    flows: existing?.flows ?? {},
    core: {
      registerTool: registerHandyTool,
      registerControlGroup,
      invokeTool: invokeHandyTool,
    },
  };
}

Hooks.once("init", async () => {
  console.log(`${CONSTANTS.MODULE_NAME} | init`);
  initializeNamespace();
  registerSettings();

  await loadTemplates({
    "tool-overview": `${CONSTANTS.TEMPLATE_PATH}/tool-overview.hbs`,
  });
});

Hooks.once("setup", () => {
  initializeNamespace();
});

Hooks.once("ready", () => {
  const currentGame = game as ReadyGame;
  if (!currentGame.user?.isGM) {
    return;
  }

  redrawSceneControls();
  ui.notifications?.info(
    "Handy Dandy tools live under the Scene Controls toolbar. Open the Tool Guide from Module Settings for quick access.",
  );
});

// Foundry V14 hook methods depend on their receiver for private hook state.
const registerSceneControlButtonsHook = Hooks.on.bind(Hooks) as (
  hook: string,
  fn: (controls: SceneControls.Control[] | Record<string, SceneControls.Control>) => void,
) => number;

registerSceneControlButtonsHook("getSceneControlButtons", (controls) => {
  const currentGame = game as ReadyGame;
  if (!currentGame.user?.isGM) {
    return;
  }

  const controlCollection = controls as ControlCollection;
  const alreadyPresent = Array.isArray(controlCollection)
    ? controlCollection.some((control) => control.name === "handy-dandy")
    : Object.prototype.hasOwnProperty.call(controlCollection, "handy-dandy");
  if (alreadyPresent) {
    return;
  }

  insertSidebarButtons(controlCollection);
});
