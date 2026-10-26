const os = require("os");
const path = require("path");

const isInside = (dir, target) => {
  const relative = path.relative(dir, target);
  return relative.split(path.sep)[0] !== ".." && !path.isAbsolute(relative);
};

const isMemoryFile = (target) => {
  const configDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude");
  const projectsDir = path.join(configDir, "projects");
  return isInside(projectsDir, target) && path.relative(projectsDir, target).split(path.sep)[1] === "memory";
};

let raw = "";
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  const input = JSON.parse(raw);
  const target = input.tool_input?.file_path ?? input.tool_input?.notebook_path;
  const projectRoot = process.env.CLAUDE_PROJECT_DIR || input.cwd;

  if (target) {
    const resolved = path.resolve(projectRoot, target);
    if (isInside(path.join(projectRoot, "tmp"), resolved) || isMemoryFile(resolved)) return;
  }

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason:
          "Pair programming mode: the developer writes all project code. Guide them to the change instead, using the hint ladder. Only notes in the project's tmp/ folder and Claude's memory files can be written.",
      },
    })
  );
});
