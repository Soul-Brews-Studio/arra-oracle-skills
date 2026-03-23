import type { Command } from 'commander';
import * as p from '@clack/prompts';

interface Shortcut {
  name: string;
  command: string;
  description?: string;
}

async function getShortcutsPath(): Promise<string> {
  const { join } = await import('path');
  const { homedir } = await import('os');
  return join(homedir(), '.oracle-skills-shortcuts.json');
}

async function loadShortcuts(): Promise<Shortcut[]> {
  const { existsSync } = await import('fs');
  const path = await getShortcutsPath();
  if (!existsSync(path)) return [];
  try {
    return JSON.parse(await Bun.file(path).text());
  } catch {
    return [];
  }
}

async function saveShortcuts(shortcuts: Shortcut[]): Promise<void> {
  const path = await getShortcutsPath();
  await Bun.write(path, JSON.stringify(shortcuts, null, 2));
}

export function registerShortcut(program: Command) {
  const cmd = program
    .command('shortcut [action]')
    .description('Create, list, and delete command shortcuts')
    .argument('[name]', 'Shortcut name (for create)')
    .argument('[command...]', 'Command to run (for create)')
    .action(async (action?: string, name?: string, command?: string[]) => {
      const shortcuts = await loadShortcuts();

      // No args or 'list' → list
      if (!action || action === 'list' || action === 'ls') {
        if (shortcuts.length === 0) {
          console.log('\n  No shortcuts. Create one:\n');
          console.log('    oracle-skills shortcut create <name> <command...>\n');
          return;
        }

        console.log(`\n  ╔══════════════════════════════════════════╗`);
        console.log(`  ║  ⚡ Shortcuts                             ║`);
        console.log(`  ╚══════════════════════════════════════════╝\n`);

        for (let i = 0; i < shortcuts.length; i++) {
          const s = shortcuts[i];
          const desc = s.description ? `  # ${s.description}` : '';
          console.log(`    ${String(i + 1).padStart(2)}. ${s.name.padEnd(20)} → ${s.command}${desc}`);
        }
        console.log(`\n  Delete: oracle-skills shortcut delete <number>\n`);
        return;
      }

      // create
      if (action === 'create' || action === 'add' || action === 'new') {
        let shortcutName = name;
        let shortcutCmd = command?.join(' ') || '';

        if (!shortcutName) {
          const input = await p.text({
            message: 'Shortcut name:',
            placeholder: 'e.g., gs, deploy, sync',
          });
          if (p.isCancel(input)) return;
          shortcutName = input as string;
        }

        if (!shortcutCmd) {
          const input = await p.text({
            message: 'Command to run:',
            placeholder: 'e.g., oracle-skills install -g -y',
          });
          if (p.isCancel(input)) return;
          shortcutCmd = input as string;
        }

        const desc = await p.text({
          message: 'Description (optional):',
          placeholder: 'e.g., Install all skills globally',
        });

        // Check duplicate
        const existing = shortcuts.findIndex((s) => s.name === shortcutName);
        if (existing >= 0) {
          const overwrite = await p.confirm({
            message: `'${shortcutName}' already exists (→ ${shortcuts[existing].command}). Overwrite?`,
          });
          if (p.isCancel(overwrite) || !overwrite) return;
          shortcuts[existing] = {
            name: shortcutName!,
            command: shortcutCmd,
            description: p.isCancel(desc) ? undefined : (desc as string) || undefined,
          };
        } else {
          shortcuts.push({
            name: shortcutName!,
            command: shortcutCmd,
            description: p.isCancel(desc) ? undefined : (desc as string) || undefined,
          });
        }

        await saveShortcuts(shortcuts);
        p.log.success(`Created: ${shortcutName} → ${shortcutCmd}`);

        // Show shell alias hint
        console.log(`\n  Add to your shell (~/.zshrc or ~/.bashrc):\n`);
        console.log(`    alias ${shortcutName}='${shortcutCmd}'\n`);
        return;
      }

      // delete
      if (action === 'delete' || action === 'rm' || action === 'remove') {
        if (shortcuts.length === 0) {
          console.log('\n  No shortcuts to delete.\n');
          return;
        }

        let index: number;

        if (name && !isNaN(Number(name))) {
          index = Number(name) - 1;
        } else {
          // Show list and ask for number
          console.log('');
          for (let i = 0; i < shortcuts.length; i++) {
            const s = shortcuts[i];
            console.log(`    ${String(i + 1).padStart(2)}. ${s.name.padEnd(20)} → ${s.command}`);
          }

          const input = await p.text({
            message: 'Enter number to delete:',
            placeholder: '1',
          });
          if (p.isCancel(input)) return;
          index = Number(input) - 1;
        }

        if (index < 0 || index >= shortcuts.length) {
          p.log.error(`Invalid number. Must be 1-${shortcuts.length}`);
          return;
        }

        const removed = shortcuts[index];
        const confirmed = await p.confirm({
          message: `Delete '${removed.name}' (→ ${removed.command})?`,
        });
        if (p.isCancel(confirmed) || !confirmed) return;

        shortcuts.splice(index, 1);
        await saveShortcuts(shortcuts);
        p.log.success(`Deleted: ${removed.name}`);
        return;
      }

      // run shortcut by name
      const shortcut = shortcuts.find((s) => s.name === action);
      if (shortcut) {
        const { execSync } = await import('child_process');
        console.log(`  ⚡ ${shortcut.name} → ${shortcut.command}\n`);
        try {
          execSync(shortcut.command, { stdio: 'inherit' });
        } catch (e: any) {
          process.exit(e.status || 1);
        }
        return;
      }

      console.log(`\n  Unknown action: ${action}`);
      console.log('  Usage:');
      console.log('    oracle-skills shortcut                        # list');
      console.log('    oracle-skills shortcut create <name> <cmd>    # create');
      console.log('    oracle-skills shortcut delete <number>        # delete');
      console.log('    oracle-skills shortcut <name>                 # run\n');
    });
}
