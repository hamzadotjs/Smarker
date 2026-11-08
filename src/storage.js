import { exists, mkdir, readDir, readTextFile, writeTextFile, remove } from "@tauri-apps/plugin-fs";
import { homeDir, join } from "@tauri-apps/api/path";

async function dir() {
  return join(await homeDir(), "md");
}

export async function loadSmarks() {
  const d = await dir();
  if (!(await exists(d))) await mkdir(d, { recursive: true });
  const entries = await readDir(d);
  return Promise.all(
    entries
      .filter((e) => e.isFile && e.name.endsWith(".md"))
      .map(async (e) => ({
        id: e.name.slice(0, -3),
        text: await readTextFile(await join(d, e.name)),
      })),
  );
}

export const saveSmark = async (id, text) =>
  writeTextFile(await join(await dir(), `${id}.md`), text);

export const deleteSmark = async (id) =>
  remove(await join(await dir(), `${id}.md`));
