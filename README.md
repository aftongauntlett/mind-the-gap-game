# Synapse Sim

A neural network simulation game built with Phaser 3, TypeScript, and Matter.js physics.

## Features

- **Vite + TypeScript**: Fast development with strict type checking
- **Phaser 3**: Modern 2D game framework with WebGL/Canvas rendering
- **Matter.js**: 2D physics engine for realistic interactions
- **ECS Architecture**: Entity-Component-System for modular game logic
- **Comprehensive Tooling**: ESLint, Prettier, Vitest integration
- **Path Aliases**: Clean imports with @app, @core, @engine, @game, @ui## Quick Start

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Lint TypeScript files
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run typecheck` - Type check without emitting

## Project Structure

```
src/
├── app/           # Application entry point and config
├── core/          # Core systems (ECS, math, types)
├── engine/        # Game engine modules (rendering, physics, input, audio, fx)
├── game/          # Game-specific logic (data, levels, systems, components, scenes)
└── ui/            # User interface components and state
```

## Development Guidelines

### Code Style

- TypeScript strict mode enabled
- No implicit any or @ts-ignore without explanation
- Constants in UPPER_SNAKE_CASE
- Classes in PascalCase
- Functions/variables in camelCase
- Filenames in kebab-case.ts

### Architecture

- Prefer pure functions and small modules
- No singletons; pass dependencies explicitly
- Use maps/lookup tables over long if/else chains
- Keep files under 200 lines; split when larger
- Document exported types/functions with TSDoc
- Delete dead code immediately when refactoring

### Performance

- Never block main thread with heavy loops
- Use fixed-step updates with accumulators
- Deterministic systems with no hidden global state

### Quality Gates

- Lint must pass with zero warnings
- All tests must pass
- Type checking must pass
- Run quality checks manually before committing

## Git Workflow

This project follows standard Git practices with quality tooling:

- **Manual Quality Checks**: Run `npm run lint`, `npm run test:run`, and `npm run typecheck` before committing
- **Code Formatting**: Use `npm run format` to ensure consistent code style

## Contributing

1. Follow the code style guidelines above
2. Write tests for new functionality
3. Run quality checks before committing:
   - `npm run lint` (fix issues with `npm run lint:fix`)
   - `npm run test:run`
   - `npm run typecheck`
   - `npm run format`
4. Keep pull requests focused and atomic
