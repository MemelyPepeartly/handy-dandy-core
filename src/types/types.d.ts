declare global {
  namespace foundry {
    interface Game {
      // Make sure the Game type has the 'ready' property
      ready: boolean;
    }
  }
}

declare module "#configuration" {
  namespace Hooks {
    interface HookConfig {
      getSceneControlButtons: (
        controls: SceneControls.Control[] | Record<string, SceneControls.Control>,
      ) => void;
    }
  }
}

// Instead of creating a ReadyGame interface that conflicts with existing types,
// we'll create our own interface for use with type assertions
interface AssumeGameReady {
  ready: true;
}

// This ensures this file is treated as a module
export { AssumeGameReady };