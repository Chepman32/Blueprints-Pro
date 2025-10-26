import {ExportService} from '../ExportService';
import RNFS from 'react-native-fs';

jest.mock('react-native-fs');
jest.mock('react-native-share');

describe('ExportService', () => {
  let exportService: ExportService;

  beforeEach(() => {
    exportService = ExportService.getInstance();
    jest.clearAllMocks();
  });

  it('should be a singleton', () => {
    const instance1 = ExportService.getInstance();
    const instance2 = ExportService.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should sanitize filename correctly', () => {
    const sanitized = (exportService as any).sanitizeFilename('Test File! @#$%');
    expect(sanitized).toBe('test_file_______');
  });

  it('should create export directory if it does not exist', async () => {
    (RNFS.exists as jest.Mock).mockResolvedValue(false);
    (RNFS.mkdir as jest.Mock).mockResolvedValue(undefined);

    const dir = await exportService.getExportDirectory();

    expect(RNFS.exists).toHaveBeenCalled();
    expect(RNFS.mkdir).toHaveBeenCalled();
    expect(dir).toContain('exports');
  });

  it('should not create export directory if it already exists', async () => {
    (RNFS.exists as jest.Mock).mockResolvedValue(true);

    const dir = await exportService.getExportDirectory();

    expect(RNFS.exists).toHaveBeenCalled();
    expect(RNFS.mkdir).not.toHaveBeenCalled();
    expect(dir).toContain('exports');
  });

  it('should list exported files', async () => {
    const mockFiles = [
      {path: '/path/to/file1.json'},
      {path: '/path/to/file2.md'},
    ];
    (RNFS.exists as jest.Mock).mockResolvedValue(true);
    (RNFS.readDir as jest.Mock).mockResolvedValue(mockFiles);

    const files = await exportService.listExportedFiles();

    expect(files).toHaveLength(2);
    expect(files[0]).toBe('/path/to/file1.json');
    expect(files[1]).toBe('/path/to/file2.md');
  });
});
