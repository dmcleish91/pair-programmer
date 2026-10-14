const path = require("path");

let raw = "";
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  const input = JSON.parse(raw);
  const target = input.tool_input?.file_path ?? input.tool_input?.notebook_path;
  const projectRoot = process.env.CLAUDE_PROJECT_DIR || input.cwd;
  const notesDir = path.join(projectRoot, "tmp");
  const relative = path.relative(notesDir, path.resolve(projectRoot, target ?? ""));
  const insideNotes = target && relative.split(path.sep)[0] !== ".." && !path.isAbsolute(relative);

  if (insideNotes) return;

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason:
          "Pair programming mode: the developer writes all project code. Guide them to the change instead, using the hint ladder. Only notes in the project's tmp/ folder can be written.",
      },
    })
  );
});
