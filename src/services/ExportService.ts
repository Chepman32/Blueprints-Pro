/**
 * Export Service
 * Handles exporting blueprints to PDF, Markdown, and JSON formats
 */

import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import {Platform} from 'react-native';
import {Blueprint, Annotation, Layer} from '@database';

export type ExportFormat = 'pdf' | 'markdown' | 'json';

export interface ExportOptions {
  format: ExportFormat;
  includeAnnotations?: boolean;
  includeLayers?: boolean;
  includeMetadata?: boolean;
}

export class ExportService {
  private static instance: ExportService;

  private constructor() {}

  static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService();
    }
    return ExportService.instance;
  }

  async exportBlueprint(
    blueprint: Blueprint,
    options: ExportOptions
  ): Promise<string> {
    const {format} = options;

    switch (format) {
      case 'pdf':
        return this.exportToPDF(blueprint, options);
      case 'markdown':
        return this.exportToMarkdown(blueprint, options);
      case 'json':
        return this.exportToJSON(blueprint, options);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  private async exportToJSON(
    blueprint: Blueprint,
    options: ExportOptions
  ): Promise<string> {
    const data: any = {
      id: blueprint.id,
      title: blueprint.title,
      description: blueprint.description,
      width: blueprint.width,
      height: blueprint.height,
      createdAt: blueprint.createdAt.toISOString(),
      updatedAt: blueprint.updatedAt.toISOString(),
    };

    if (options.includeAnnotations) {
      const annotations = await blueprint.annotations.fetch();
      data.annotations = annotations.map((a: Annotation) => ({
        id: a.id,
        type: a.type,
        data: JSON.parse(a.data),
        position: {x: a.positionX, y: a.positionY},
        color: a.color,
        strokeWidth: a.strokeWidth,
        isVisible: a.isVisible,
      }));
    }

    if (options.includeLayers) {
      const layers = await blueprint.layers.fetch();
      data.layers = layers.map((l: Layer) => ({
        id: l.id,
        name: l.name,
        color: l.color,
        isVisible: l.isVisible,
        isLocked: l.isLocked,
        opacity: l.opacity,
        order: l.order,
      }));
    }

    const json = JSON.stringify(data, null, 2);
    const filename = `${this.sanitizeFilename(blueprint.title)}.json`;
    const path = `${RNFS.DocumentDirectoryPath}/${filename}`;

    await RNFS.writeFile(path, json, 'utf8');
    return path;
  }

  private async exportToMarkdown(
    blueprint: Blueprint,
    options: ExportOptions
  ): Promise<string> {
    let markdown = `# ${blueprint.title}\n\n`;

    if (blueprint.description) {
      markdown += `${blueprint.description}\n\n`;
    }

    markdown += `## Details\n\n`;
    markdown += `- **Size**: ${blueprint.width} x ${blueprint.height}\n`;
    markdown += `- **Created**: ${blueprint.createdAt.toLocaleDateString()}\n`;
    markdown += `- **Updated**: ${blueprint.updatedAt.toLocaleDateString()}\n\n`;

    if (options.includeAnnotations) {
      const annotations = await blueprint.annotations.fetch();
      if (annotations.length > 0) {
        markdown += `## Annotations\n\n`;
        annotations.forEach((a: Annotation, index: number) => {
          markdown += `${index + 1}. **${a.type}** at (${a.positionX}, ${a.positionY})\n`;
          markdown += `   - Color: ${a.color}\n`;
          if (a.strokeWidth) {
            markdown += `   - Stroke Width: ${a.strokeWidth}\n`;
          }
          markdown += `\n`;
        });
      }
    }

    if (options.includeLayers) {
      const layers = await blueprint.layers.fetch();
      if (layers.length > 0) {
        markdown += `## Layers\n\n`;
        layers.forEach((l: Layer, index: number) => {
          markdown += `${index + 1}. **${l.name}**\n`;
          markdown += `   - Color: ${l.color}\n`;
          markdown += `   - Opacity: ${(l.opacity * 100).toFixed(0)}%\n`;
          markdown += `   - Visible: ${l.isVisible ? 'Yes' : 'No'}\n`;
          markdown += `   - Locked: ${l.isLocked ? 'Yes' : 'No'}\n`;
          markdown += `\n`;
        });
      }
    }

    const filename = `${this.sanitizeFilename(blueprint.title)}.md`;
    const path = `${RNFS.DocumentDirectoryPath}/${filename}`;

    await RNFS.writeFile(path, markdown, 'utf8');
    return path;
  }

  private async exportToPDF(
    blueprint: Blueprint,
    options: ExportOptions
  ): Promise<string> {
    // For PDF export, we would need react-native-pdf or similar
    // For now, create a simplified HTML that can be converted to PDF
    let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${blueprint.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; }
    h1 { color: #007AFF; }
    .metadata { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .section { margin: 30px 0; }
  </style>
</head>
<body>
  <h1>${blueprint.title}</h1>
  ${blueprint.description ? `<p>${blueprint.description}</p>` : ''}

  <div class="metadata">
    <h2>Details</h2>
    <p><strong>Size:</strong> ${blueprint.width} x ${blueprint.height}</p>
    <p><strong>Created:</strong> ${blueprint.createdAt.toLocaleDateString()}</p>
    <p><strong>Updated:</strong> ${blueprint.updatedAt.toLocaleDateString()}</p>
  </div>
`;

    if (options.includeAnnotations) {
      const annotations = await blueprint.annotations.fetch();
      if (annotations.length > 0) {
        html += `<div class="section"><h2>Annotations</h2><ul>`;
        annotations.forEach((a: Annotation) => {
          html += `<li>${a.type} at (${a.positionX}, ${a.positionY}) - Color: ${a.color}</li>`;
        });
        html += `</ul></div>`;
      }
    }

    if (options.includeLayers) {
      const layers = await blueprint.layers.fetch();
      if (layers.length > 0) {
        html += `<div class="section"><h2>Layers</h2><ul>`;
        layers.forEach((l: Layer) => {
          html += `<li>${l.name} - ${l.isVisible ? 'Visible' : 'Hidden'}</li>`;
        });
        html += `</ul></div>`;
      }
    }

    html += `</body></html>`;

    const filename = `${this.sanitizeFilename(blueprint.title)}.html`;
    const path = `${RNFS.DocumentDirectoryPath}/${filename}`;

    await RNFS.writeFile(path, html, 'utf8');
    return path;
  }

  async shareExportedFile(filePath: string, mimeType?: string): Promise<void> {
    try {
      await Share.open({
        url: Platform.OS === 'ios' ? filePath : `file://${filePath}`,
        type: mimeType || 'text/plain',
      });
    } catch (error) {
      if (error && (error as any).message !== 'User did not share') {
        console.error('Share error:', error);
        throw error;
      }
    }
  }

  private sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
  }

  async getExportDirectory(): Promise<string> {
    const exportDir = `${RNFS.DocumentDirectoryPath}/exports`;

    const exists = await RNFS.exists(exportDir);
    if (!exists) {
      await RNFS.mkdir(exportDir);
    }

    return exportDir;
  }

  async listExportedFiles(): Promise<string[]> {
    const exportDir = await this.getExportDirectory();
    const files = await RNFS.readDir(exportDir);
    return files.map(f => f.path);
  }
}

export const exportService = ExportService.getInstance();
