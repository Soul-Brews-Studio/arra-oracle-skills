import type { Command } from 'commander';
import { agents, detectInstalledAgents } from '../agents.js';

export function registerList(program: Command) {
  program
    .command('list')
    .description('Show installed Oracle skills')
    .option('-g, --global', 'Show global (user-level) skills')
    .option('-a, --agent <agents...>', 'Show skills for specific agents')
    .action(async (options) => {
      const { readdirSync, existsSync, readFileSync } = await import('fs');
      const { join } = await import('path');

      let targetAgents: string[] = options.agent || [];

      if (targetAgents.length === 0) {
        targetAgents = detectInstalledAgents();
      }

      if (targetAgents.length === 0) {
        console.log('\nNo agents detected. Use --agent to specify.\n');
        return;
      }

      console.log('\nInstalled Oracle skills:\n');

      let totalSkills = 0;

      for (const agentName of targetAgents) {
        const agent = agents[agentName as keyof typeof agents];
        if (!agent) continue;

        const skillsDir = options.global
          ? agent.globalSkillsDir
          : join(process.cwd(), agent.skillsDir);

        const scope = options.global ? '(global)' : '(local)';

        if (!existsSync(skillsDir)) {
          console.log(`  ${agent.displayName} ${scope}: (no skills directory)`);
          continue;
        }

        const skillDirs = readdirSync(skillsDir, { withFileTypes: true })
          .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
          .map((d) => d.name);

        if (skillDirs.length === 0) {
          console.log(`  ${agent.displayName} ${scope}: (empty)`);
        } else {
          console.log(`  ${agent.displayName} ${scope}: ${skillDirs.length} skills`);
          for (const skill of skillDirs) {
            let version = '';
            let hidden = false;
            const skillMdPath = join(skillsDir, skill, 'SKILL.md');
            if (existsSync(skillMdPath)) {
              try {
                const content = readFileSync(skillMdPath, 'utf-8');
                const versionMatch = content.match(/v(\d+\.\d+\.\d+)/);
                if (versionMatch) {
                  version = ` (v${versionMatch[1]})`;
                }
                hidden = /hidden:\s*(true|yes)/i.test(content);
              } catch {}
            }
            const hiddenTag = hidden ? ' [hidden]' : '';
            console.log(`    - ${skill}${version}${hiddenTag}`);
          }
          totalSkills += skillDirs.length;
        }
        console.log('');
      }

      console.log(`Total: ${totalSkills} skills across ${targetAgents.length} agent(s)\n`);
    });
}
