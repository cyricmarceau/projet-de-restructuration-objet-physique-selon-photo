# CLAUDE.md

Guidance for AI assistants (and humans) working in this repository.

## ⚠️ Current state: greenfield / empty repository

As of this writing, this repository contains **no source code, no build
configuration, and no commit history** — only this document. Any description
below of "the codebase" is therefore forward-looking intent, not an
observed structure. **Do not assume files, languages, frameworks, or
directories exist until you have verified them on disk.**

When you add the first real code, **update this file in the same change** so
that it stops describing an empty repo and starts describing the actual one:
the real directory layout, the real build/test/lint commands, and the real
conventions. Treat the sections marked _"To be filled in"_ as a checklist.

## Project intent

The repository name — `projet-de-restructuration-objet-physique-selon-photo`
(French: _"project for restructuring a physical object from a photo"_) —
indicates the goal is to **reconstruct or restructure a physical object from
one or more photographs**. This is the problem domain of photogrammetry /
3D reconstruction / computer vision: taking 2D image input and producing a
structured representation of the object (measurements, a mesh, a point
cloud, a parametric model, or an editable description).

Nothing about the implementation is decided yet. Before choosing a stack,
confirm the direction with the repository owner rather than guessing.

## Getting oriented (do this first every session)

Because the repo is essentially empty, always start by checking what
actually exists rather than relying on this document:

```bash
git log --oneline -20      # what history exists yet?
git status                 # working tree state
ls -la                     # top-level contents
```

Then look for the usual signals of a chosen stack, and let what you find
drive everything else:

- `package.json` → Node/JS/TS project (`npm`/`pnpm`/`yarn`)
- `pyproject.toml` / `requirements.txt` → Python project
- `Cargo.toml` → Rust · `go.mod` → Go · `CMakeLists.txt` → C/C++
- `Dockerfile` / `docker-compose.yml` → containerized workflow

## Development workflow

### Branching

- **Work on the branch you were assigned** for the task. Do not push directly
  to the default branch.
- Create the branch from the latest default branch if it does not exist yet.

### Commits

- Write clear, imperative, descriptive commit messages
  (e.g. "Add image ingestion module", not "updates").
- Keep commits focused; one logical change per commit where practical.
- Commit or push only when the work is complete and, where possible, verified.

### Pull requests

- Open a **draft** PR for the pushed branch once changes are ready, unless one
  already exists for that branch.
- If a PR template appears under `.github/` later, follow its structure.

## Build, test, and lint commands

_To be filled in once a toolchain is chosen._ When you set up the project,
record the exact commands here so future sessions can run them without
guessing, for example:

```
# install    e.g. npm install  /  pip install -e .
# build      e.g. npm run build /  make
# test       e.g. npm test      /  pytest
# lint       e.g. npm run lint  /  ruff check .
```

Always prefer running the project's real test/lint commands to verify a
change instead of assuming it works.

## Codebase structure

_To be filled in._ Document the top-level directory layout here as it takes
shape — for a reconstruction-from-photo project this will likely include
image input handling, a processing/reconstruction pipeline, output/model
serialization, and possibly a UI or CLI entry point. Describe what each
directory is responsible for so an assistant can navigate quickly.

## Conventions

_To be filled in._ Capture project-specific conventions as they are
established, such as:

- Language and formatting standards (formatter, style guide).
- How images and large binary assets are stored (they usually should **not**
  be committed directly — consider Git LFS or an external store).
- Naming conventions for modules, tests, and pipeline stages.
- Where configuration and secrets live (never commit secrets or API keys).

## Notes for AI assistants

- This file is the source of truth for conventions — **keep it current**.
  When you learn or establish something durable about how this project
  works, add it here rather than leaving it in a single conversation.
- Verify before you assert: read files and run commands rather than assuming,
  especially while the repo is still nearly empty.
- Ask the owner before making large architectural decisions (language,
  framework, reconstruction approach) — none have been made yet.
