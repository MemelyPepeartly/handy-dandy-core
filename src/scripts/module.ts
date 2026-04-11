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

Hooks.once("init", async () => {
  console.log(`${CONSTANTS.MODULE_NAME} | init`);
  registerSettings();

  await loadTemplates({
    "tool-overview": `${CONSTANTS.TEMPLATE_PATH}/tool-overview.hbs`,
  });
});

Hooks.once("setup", () => {
  const existing = game.handyDandy;
  game.handyDandy = {
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
});

Hooks.once("ready", () => {
  if (!game.user?.isGM) {
    return;
  }

  redrawSceneControls();
  ui.notifications?.info(
    "Handy Dandy tools live under the Scene Controls toolbar. Open the Tool Guide from Module Settings for quick access.",
  );
});

Hooks.on("getSceneControlButtons", (controls: ControlCollection) => {
  if (!game.user?.isGM) {
    return;
  }

  const alreadyPresent = Array.isArray(controls)
    ? controls.some((control) => control.name === "handy-dandy")
    : Object.prototype.hasOwnProperty.call(controls, "handy-dandy");
  if (alreadyPresent) {
    return;
  }

  insertSidebarButtons(controls);
});
