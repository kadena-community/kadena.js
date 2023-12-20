#!/usr/bin/env node
import { Command } from 'commander';
import { loadProgram } from './program.js';

loadProgram(new Command()).parse();
