import { Engine } from "./core/engine";
import { GameManager } from "./managers/GameManager";

(async () => {
  // Create and initialize the engine
  const engine = await new Engine().init();

  // Initialize game manager
  const gameManager = new GameManager(engine);

  // Listen for animate update
  engine.app.ticker.add((time) => {
  });
})();
