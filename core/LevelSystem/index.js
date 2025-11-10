/**
 * Level System - Reusable Framework
 * Can be imported into ANY game project
 * 
 * Usage Examples:
 * 
 * // For Number Master (Grid-based)
 * import { createNumberMasterLevelManager } from './core/LevelSystem';
 * const levelManager = createNumberMasterLevelManager();
 * 
 * // For RPG (XP-based)
 * import { LevelFactory } from './core/LevelSystem';
 * const levelManager = LevelFactory.createXPLevelManager({ baseXP: 100 });
 * 
 * // For Racing (Time-based)
 * const levelManager = LevelFactory.createTimeLevelManager(levels);
 * 
 * // Custom implementation
 * import { LevelManager, LevelStrategy } from './core/LevelSystem';
 * class MyStrategy extends LevelStrategy { ... }
 * const levelManager = new LevelManager(new MyStrategy());
 */

export * from './LevelStrategy';
export * from './LevelManager';
export * from './NumberMasterLevelSystem';

// Default export for convenience
export { createNumberMasterLevelManager as default } from './NumberMasterLevelSystem';
