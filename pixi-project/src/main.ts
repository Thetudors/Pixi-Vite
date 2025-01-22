import { Engine } from "./core/engine";
import { GameManager } from "./managers/GameManager";

(async () => {
  // Create and initialize the engine
  const engine = await new Engine().init();

  // Initialize game manager
  const gameManager = new GameManager(engine);

  // Listen for spin button click
  // Listen for spacebar press
  window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      event.preventDefault(); // Prevent page scroll
      gameManager.spin();
    }
    if (event.code === 'KeyR') {
      gameManager.stop();
    }
  });

  // // Listen for animate update
  // engine.app.ticker.add((time) => {
  // });
})();
