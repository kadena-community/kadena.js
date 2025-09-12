import { BrowserToolBase } from './base.js';
import { ToolContext, ToolResponse, createSuccessResponse, createErrorResponse } from '../common/types.js';
import * as path from 'path';

/**
 * Tool for saving page as PDF
 */
export class SaveAsPdfTool extends BrowserToolBase {
  /**
   * Execute the save as PDF tool
   */
  async execute(args: any, context: ToolContext): Promise<ToolResponse> {
    return this.safeExecute(context, async (page) => {
      const filename = args.filename || 'page.pdf';
      const options = {
        path: path.resolve(args.outputPath || '.', filename),
        format: args.format || 'A4',
        printBackground: args.printBackground !== false,
        margin: args.margin || {
          top: '1cm',
          right: '1cm',
          bottom: '1cm',
          left: '1cm'
        }
      };

      await page.pdf(options);
      return createSuccessResponse(`Saved page as PDF: ${options.path}`);
    });
  }
} 