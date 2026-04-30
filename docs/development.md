# Development Guide

Handy Dandy Core is the shared runtime repo. Changes here should stay generic and reusable.

## Add a new shared tool

1. Define the shared runtime behavior in `src/scripts/core/registry.ts`.
2. Register the scene-controls presentation in `src/scripts/setup/sidebarButtons.ts`.
3. If the tool should appear in the guide, expose enough metadata for `src/scripts/ui/tool-overview.ts`.
4. Keep feature-specific execution in the leaf module; Core should only host registration and shared UX shell.

## Add a new shared API surface

1. Extend the `game.handyDandy` namespace in `src/scripts/module.ts`.
2. Keep the new API generic enough to be shared by multiple leaf modules.
3. Update typings under `src/types` when the namespace contract changes.
4. Update the README and any affected leaf-module call sites in the same change.

## Guardrails

- Do not move OpenRouter clients, PF2E generators, or utility feature logic into Core.
- Prefer registration APIs and common Foundry plumbing over feature ownership.
- Keep Foundry V14 compatibility and avoid duplicate control insertion on repeated hooks.
