import type { CourtScene } from './scene';
import type { Level } from './model';
type Tool = {
  name: string;
  description: string;
  inputSchema: object;
  annotations: { readOnlyHint: boolean };
  execute: (input: unknown) => unknown;
};
type Context = {
  registerTool: (
    tool: Tool,
    options: { signal: AbortSignal },
  ) => void | Promise<void>;
};
export function registerGameTools(
  game: CourtScene,
  setLevel: (level: Level) => void,
) {
  const context = (document as Document & { modelContext?: Context })
    .modelContext;
  if (!context?.registerTool) return () => {};
  const lifecycle = new AbortController();
  const read = () => ({
    phase: game.match.phase,
    score: [...game.match.score],
    difficulty: game.match.level,
    rally: game.match.rally,
  });
  const tools: Tool[] = [
    {
      name: 'read_badminton_match',
      description:
        'Read the current badminton match score, difficulty and state.',
      inputSchema: {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: () => read(),
    },
    {
      name: 'control_badminton_match',
      description:
        'Start a new 11-point match, pause or resume the current match. Starting resets scores.',
      inputSchema: {
        type: 'object',
        properties: {
          action: { type: 'string', enum: ['start', 'pause', 'resume'] },
          difficulty: { type: 'string', enum: ['easy', 'normal', 'hard'] },
        },
        required: ['action'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false },
      execute: (input) => {
        if (!input || typeof input !== 'object')
          throw new Error('Expected an action object');
        const value = input as Record<string, unknown>;
        if (
          Object.keys(value).some((k) => !['action', 'difficulty'].includes(k))
        )
          throw new Error('Unknown input field');
        if (
          typeof value.action !== 'string' ||
          !['start', 'pause', 'resume'].includes(value.action)
        )
          throw new Error('Invalid action');
        if (
          value.difficulty !== undefined &&
          (typeof value.difficulty !== 'string' ||
            !['easy', 'normal', 'hard'].includes(value.difficulty))
        )
          throw new Error('Invalid difficulty');
        if (value.action === 'start') {
          const level = (value.difficulty ?? game.match.level) as Level;
          setLevel(level);
          game.start(level);
        } else if (value.action === 'pause') game.blur();
        else {
          game.match.resume();
          game.send();
        }
        return read();
      },
    },
  ];
  for (const tool of tools) {
    try {
      void Promise.resolve(
        context.registerTool(tool, { signal: lifecycle.signal }),
      ).catch(() => {});
    } catch {
      /* Unsupported browser variants do not affect play. */
    }
  }
  return () => lifecycle.abort();
}
