export const PCODE_EXTENSION = '.pcode';

export const serializePcodeFile = (code: string) => code;

export const parsePcodeFile = (contents: string) => contents;

export const isPcodeFileName = (fileName: string) =>
  fileName.toLowerCase().endsWith(PCODE_EXTENSION);

export const createPcodeDownloadName = (rawName: string) => {
  const safeBaseName = rawName
    .trim()
    .replace(/\.pcode$/i, '')
    .replace(/[^a-z0-9_-]+/gi, '-')
    .replace(/^-+|-+$/g, '');

  return `${safeBaseName || 'programa'}${PCODE_EXTENSION}`;
};
