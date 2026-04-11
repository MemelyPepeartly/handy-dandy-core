import { CONSTANTS } from "../constants";
import { getRegisteredHandyTools, invokeHandyTool } from "../core/registry";

interface ToolCardData {
  id: string;
  title: string;
  icon: string;
  description: string;
  location: string;
  buttonAction?: string;
  buttonLabel?: string;
  buttonIcon?: string;
}

interface ToolOverviewData {
  tools: ToolCardData[];
}

export class ToolOverview extends FormApplication {
  constructor(options?: Partial<FormApplicationOptions>) {
    super(undefined, options);
  }

  static override get defaultOptions(): FormApplicationOptions {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "handy-dandy-tool-overview",
      title: "Handy Dandy Tool Guide",
      template: `${CONSTANTS.TEMPLATE_PATH}/tool-overview.hbs`,
      width: 600,
      height: "auto",
      classes: ["handy-dandy", "tool-overview"],
      submitOnChange: false,
      closeOnSubmit: true,
    });
  }

  override async getData(): Promise<ToolOverviewData> {
    return {
      tools: getRegisteredHandyTools().map((tool) => ({
        id: tool.id,
        title: tool.title,
        icon: tool.icon,
        description: tool.description,
        location: tool.location,
        ...(tool.onClick
          ? {
            buttonAction: tool.id,
            buttonLabel: tool.buttonLabel ?? `Open ${tool.title}`,
            buttonIcon: tool.buttonIcon ?? tool.icon,
          }
          : {}),
      })),
    } satisfies ToolOverviewData;
  }

  override activateListeners(html: JQuery): void {
    super.activateListeners(html);

    const buttons = html.find<HTMLButtonElement>("button[data-action]");
    buttons.on("click", (event) => {
      const action = (event.currentTarget as HTMLButtonElement).dataset["action"];
      if (!action) {
        return;
      }

      void invokeHandyTool(action);
    });
  }

  protected override async _updateObject(
    _event: Event,
    _formData: Record<string, unknown>,
  ): Promise<void> {
    // No form submission behaviour; the dialog is informational only.
  }
}
