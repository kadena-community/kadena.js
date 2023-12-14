#!/usr/bin/env node
import { Command } from 'commander';
import { loadProgram } from './program.js';
import { clearCLI } from './utils/helpers.js';

clearCLI();

loadProgram(new Command()).parse();
