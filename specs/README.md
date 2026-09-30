# Specs

Skyline artifacts: `src/` verbatim sources, `brief/`, `spec/`, `design/`, `plan/`.

- Check: `node .skyline/skyline.mjs check` (`--tests`: every acceptance criterion has a test; `--branches`: no id clash with other branches).
- Approve (owner only, in your own terminal): `node .skyline/skyline.mjs approve SPEC-1 --by <name> --with-sources`.
