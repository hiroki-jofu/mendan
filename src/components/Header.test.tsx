import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  const mockOnSearchChange = jest.fn();
  const mockOnFontSizeChange = jest.fn();
  const mockOnExportCsv = jest.fn();
  const mockOnBackupToFile = jest.fn();
  const mockOnRestoreFromFile = jest.fn();
  const mockOnDeleteAll = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders header elements correctly', () => {
    render(
      <Header
        searchQuery=""
        onSearchChange={mockOnSearchChange}
        fontSize={16}
        onFontSizeChange={mockOnFontSizeChange}
        onExportCsv={mockOnExportCsv}
        onBackupToFile={mockOnBackupToFile}
        onRestoreFromFile={mockOnRestoreFromFile}
        onDeleteAll={mockOnDeleteAll}
      />
    );

    expect(screen.getByText('面談記録アプリ')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('氏名、学年、カテゴリ、本文で検索...')).toBeInTheDocument();
    expect(screen.getByText('メニュー')).toBeInTheDocument();
    expect(screen.getByText('文字サイズ:')).toBeInTheDocument();
  });

  test('calls onSearchChange when search input changes', () => {
    render(
      <Header
        searchQuery=""
        onSearchChange={mockOnSearchChange}
        fontSize={16}
        onFontSizeChange={mockOnFontSizeChange}
        onExportCsv={mockOnExportCsv}
        onBackupToFile={mockOnBackupToFile}
        onRestoreFromFile={mockOnRestoreFromFile}
        onDeleteAll={mockOnDeleteAll}
      />
    );

    const searchInput = screen.getByPlaceholderText('氏名、学年、カテゴリ、本文で検索...');
    fireEvent.change(searchInput, { target: { value: 'テスト' } });

    expect(mockOnSearchChange).toHaveBeenCalledTimes(1);
    expect(mockOnSearchChange).toHaveBeenCalledWith('テスト');
  });
});