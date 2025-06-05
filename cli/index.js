#!/usr/bin/env node
import { Command } from 'commander';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import passwordPrompt from '@inquirer/password';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import clipboard from 'clipboardy';
import { buildPrompt, injectPrompt } from '../sdk/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf8'));

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const openaiKey = process.env.OPENAI_API_KEY;
const defaultModel = process.env.OPENAI_MODEL || 'gpt-4o';
const openai = openaiKey ? new OpenAI({ apiKey: openaiKey }) : null;

const program = new Command();
program
  .name('pad')
  .description('Prompt or Die CLI')
  .version(pkg.version);

program
  .command('login')
  .description('Log in to your account')
  .action(async () => {
    if (!supabase) {
      console.error('Supabase environment variables are not configured.');
      return;
    }

    const rl = readline.createInterface({ input, output });
    const email = await rl.question('Email: ');
    rl.close();
    const password = await passwordPrompt({ message: 'Password:' });

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('Login failed:', error.message);
      process.exitCode = 1;
    } else {
      console.log(`Logged in as ${data.user?.email}`);
    }
  });

program
  .command('logout')
  .description('Log out of your account')
  .action(async () => {
    if (!supabase) {
      console.error('Supabase environment variables are not configured.');
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout failed:', error.message);
      process.exitCode = 1;
    } else {
      console.log('Logged out successfully');
    }
  });

program
  .command('whoami')
  .description('Show current user information')
  .action(async () => {
    if (!supabase) {
      console.error('Supabase environment variables are not configured.');
      return;
    }

    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      console.log(`Logged in as ${data.user.email} (${data.user.id})`);
    } else {
      console.log('Not logged in.');
    }
  });

program
  .command('generate')
  .description('Generate a prompt from blocks')
  .action(async () => {
    if (!openai) {
      console.error('OPENAI_API_KEY environment variable is not set.');
      return;
    }

    const rl = readline.createInterface({ input, output });
    const prompt = await rl.question('Enter prompt: ');
    rl.close();

    const model = defaultModel;
    try {
      const resp = await openai.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }]
      });
      console.log(resp.choices[0].message.content);
    } catch (err) {
      if (err?.status === 429) {
        console.error('Rate limit reached. Retrying in 10s...');
        await new Promise(r => setTimeout(r, 10000));
        try {
          const resp = await openai.chat.completions.create({
            model,
            messages: [{ role: 'user', content: prompt }]
          });
          console.log(resp.choices[0].message.content);
        } catch (e) {
          console.error('Generation failed after retry:', e.message || e);
        }
      } else if (/model/i.test(err?.message || '') && model !== 'gpt-3.5-turbo') {
        console.log(`Model ${model} not available, falling back to gpt-3.5-turbo`);
        try {
          const resp = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }]
          });
          console.log(resp.choices[0].message.content);
        } catch (e) {
          console.error('Generation failed:', e.message || e);
        }
      } else {
        console.error('Generation failed:', err.message || err);
      }
    }
  });

program
  .command('build <file>')
  .description('Build a prompt from a JSON file of blocks')
  .option('-o, --output <out>', 'Output file', 'prompt.txt')
  .action((file, options) => {
    try {
      const data = readFileSync(file, 'utf8');
      const blocks = JSON.parse(data);
      const prompt = buildPrompt(blocks);
      writeFileSync(options.output, prompt);
      console.log(`Prompt written to ${options.output}`);
    } catch (err) {
      console.error('Failed to build prompt:', err.message || err);
    }
  });

program
  .command('inject <file> <text>')
  .description('Inject text into an existing prompt file')
  .option('-m, --mode <mode>', 'prepend|append|replace', 'append')
  .action(async (file, text, options) => {
    try {
      const base = readFileSync(file, 'utf8');
      if (existsSync(file)) {
        const rl = readline.createInterface({ input, output });
        const ans = (await rl.question(`Overwrite ${file}? (y/N) `)).trim().toLowerCase();
        rl.close();
        if (ans !== 'y') {
          console.log('Aborted.');
          return;
        }
      }
      const finalText = injectPrompt(base, text, options.mode);
      writeFileSync(file, finalText);
      console.log(`File ${file} updated.`);
    } catch (err) {
      console.error('Failed to inject text:', err.message || err);
    }
  });

program
  .command('export')
  .description('Export current prompt')
  .action(() => {
    try {
      const prompt = readFileSync('prompt.txt', 'utf8');
      clipboard.writeSync(prompt);
      console.log('Prompt copied to clipboard.');
    } catch {
      console.log('No prompt.txt found to export.');
    }
  });

program
  .command('goto <page>')
  .description('Navigate to a page in the web app')
  .action(async page => {
    const base = process.env.WEB_APP_URL || 'http://localhost:5173';
    const url = page.startsWith('http') ? page : `${base}/${page.replace(/^\//, '')}`;
    console.log(`Opening ${url}`);
    try {
      const { default: open } = await import('open');
      await open(url);
    } catch {
      console.log('Unable to open browser automatically.');
    }
  });

program
  .command('create <resource>')
  .description('Create a new resource')
  .action(resource => {
    switch (resource.toLowerCase()) {
      case 'project':
        console.log('Creating new project...');
        console.log('Project created. Open the dashboard to edit.');
        break;
      case 'template':
        console.log('Creating new template...');
        console.log('Template creation not yet implemented.');
        break;
      case 'block':
        console.log('Block creation requires an active project.');
        break;
      default:
        console.log(`Unknown resource type: ${resource}`);
        console.log('Available types: project, template, block');
    }
  });

program
  .command('list <resource>')
  .description('List available resources')
  .action(resource => {
    switch (resource.toLowerCase()) {
      case 'projects':
        console.log('=== Your Projects ===');
        console.log('1. My First Project');
        console.log('2. Code Review Template');
        console.log('3. Marketing Prompts');
        break;
      case 'commands':
        program.outputHelp();
        break;
      case 'templates':
        console.log('=== Available Templates ===');
        console.log('1. Content Summarizer');
        console.log('2. Code Reviewer');
        console.log('3. Creative Writer');
        console.log('4. Data Analyst');
        console.log('5. Email Marketing');
        console.log('6. Technical Documentation');
        break;
      default:
        console.log(`Unknown resource type: ${resource}`);
        console.log('Available types: projects, commands, templates');
    }
    console.log(`Listing ${resource} (not implemented).`);
  });

program.parse(process.argv);

