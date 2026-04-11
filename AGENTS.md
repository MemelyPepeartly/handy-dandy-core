# Handy Dandy Core Agent Instructions

## Scope
- Applies to this repository only.
- Handy Dandy Core is the shared Foundry runtime for the Handy Dandy module family.

## Product Intent
- Core owns shared namespace, toolbar, tool-guide, and registration plumbing.
- Core should stay system-agnostic unless a truly generic cross-module integration requires more.
- Core is not the place for OpenRouter logic, PF2E generation pipelines, or feature-specific GM tools.

## Architecture
- Entry and lifecycle hooks: `src/scripts/module.ts`
- Shared registration API: `src/scripts/core/registry.ts`
- Scene controls shell: `src/scripts/setup/sidebarButtons.ts`
- Tool guide UI: `src/scripts/ui/tool-overview.ts`

## Guardrails
- Preserve `game.handyDandy` and `game.handyDandy.core.*` behavior.
- Prefer registration APIs over feature ownership.
- Keep duplicate control insertion protections intact.
- Do not pull in Conjur or Tools feature logic directly.

## Build and Verification
- `npm ci`
- `npx tsc --noEmit`
- `npm run build`

## Documentation
- Keep `README.md`, `docs/development.md`, and typings under `src/types` aligned with any public API changes.
