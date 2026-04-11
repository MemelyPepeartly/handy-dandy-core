# Handy Dandy Core

Handy Dandy Core is the shared Foundry VTT runtime for the Handy Dandy module family.
It owns the `game.handyDandy` namespace, the shared tool registry, the scene-controls shell,
and the tool guide used by leaf modules.

## Responsibilities

- Host `game.handyDandy` and the `game.handyDandy.core.*` registration API.
- Render the shared `Handy Dandy Tools` control group and tool guide.
- Provide generic runtime plumbing that leaf modules can register into.
- Stay free of OpenRouter, PF2E generation, and feature-specific utility logic.

## Module Relationship

- `handy-dandy-core`: required base runtime.
- `handy-dandy-conjur`: AI/OpenRouter/PF2E generation leaf module.
- `handy-dandy-tools`: non-AI utility leaf module.

## Development

```bash
npm ci
npx tsc --noEmit
npm run build
```

For local Foundry deployment:

```bash
npm run deploy:local
```

## Important Files

- `src/scripts/module.ts`: core lifecycle hooks and namespace bootstrap.
- `src/scripts/core/registry.ts`: shared tool/control registration.
- `src/scripts/setup/sidebarButtons.ts`: shared scene-controls rendering.
- `src/scripts/ui/tool-overview.ts`: tool guide application.
- `src/static/module.json`: Foundry manifest template.

## Notes

- Core should only expose generic APIs that multiple leaf modules can share.
- Do not move OpenRouter clients, generation pipelines, or feature-specific PF2E tools into Core
  unless they are truly cross-module infrastructure.

## Docs

- [Development Guide](docs/development.md)
