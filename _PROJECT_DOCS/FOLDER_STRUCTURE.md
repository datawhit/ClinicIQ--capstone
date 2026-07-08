# Folder Structure

## Repository layout
- [README.md](../README.md): product overview and runtime guidance
- [server.js](../server.js): Express backend and API routes
- [db.js](../db.js): PostgreSQL connection and schema initialization
- [package.json](../package.json): Node dependencies and scripts
- [vite.config.js](../vite.config.js): Vite configuration
- [src/](../src): frontend source files
  - [src/App.jsx](../src/App.jsx): main UI and app logic
  - [src/main.jsx](../src/main.jsx): React entry point
- [attached_assets/](../attached_assets): screenshot assets and pasted implementation notes
- [main.py](../main.py) and [pyproject.toml](../pyproject.toml): lightweight Python scaffolding; not part of the primary runtime path

## Documentation output
- [_PROJECT_DOCS/](.) contains the reverse-engineered documentation set generated from the current codebase.

## Notes
The current repository is organized around a small number of central files, especially server.js and src/App.jsx, rather than a highly modular folder tree.
