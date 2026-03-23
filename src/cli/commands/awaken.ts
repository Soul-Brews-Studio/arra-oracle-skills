import type { Command } from 'commander';
import * as p from '@clack/prompts';

export function registerAwaken(program: Command, version: string) {
  program
    .command('awaken')
    .description('Start Oracle awakening ritual')
    .action(async () => {
      p.intro(`🔮 Oracle Awakening v${version}`);

      const mode = await p.select({
        message: 'Choose awakening mode:',
        options: [
          {
            value: '--soul-sync',
            label: '● Full Soul Sync (recommended)',
            hint: '~20 min — discover principles through exploration',
          },
          {
            value: '--fast',
            label: '○ Fast',
            hint: '~5 min — principles provided directly',
          },
          {
            value: '--reawaken',
            label: '↻ Reawaken',
            hint: 'refresh existing Oracle identity',
          },
        ],
      });

      if (p.isCancel(mode)) {
        p.log.info('Cancelled');
        return;
      }

      p.log.success(`Mode: ${mode}`);
      p.outro(`Run in your agent:\n\n  /awaken ${mode}\n`);
    });
}
