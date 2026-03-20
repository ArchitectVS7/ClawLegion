/**
 * Cyberscape — Live spatial visualization of AI agent activity
 *
 * This is the main entry point. When Phase 1 features (F-01 through F-05)
 * are implemented, this will start the Cyberscape API server and terrain
 * generator.
 *
 * Default port: 4200
 */

const PORT = parseInt(process.env.CYBERSCAPE_PORT || "4200", 10);

console.log(`Cyberscape v0.1.0`);
console.log(`Ready for implementation — see docs/DESIGN-SPEC.md`);
console.log(`Server will run on port ${PORT}`);
