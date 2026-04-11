import { CONSTANTS } from "../constants";
import { ToolOverview } from "../ui/tool-overview";

export function registerSettings(): void {
  game.settings?.registerMenu(CONSTANTS.MODULE_ID, "toolGuide", {
    name: "Handy Dandy Tool Guide",
    label: "Open Tool Guide",
    hint: "Open a quick reference that shows where to access each Handy Dandy tool inside Foundry.",
    icon: "fas fa-compass",
    type: ToolOverview,
    restricted: false,
  });
}
