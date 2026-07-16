"use client";

import Papa from "papaparse";

export type ParsedCSV = {
  rows: Record<string, string>[];
  columns: string[];
};

export function parseCSV(file: File): Promise<ParsedCSV> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value) => String(value ?? "").trim(),
      complete: (result) => {
        if (result.errors.length > 0) {
          reject(new Error(result.errors[0]?.message ?? "Could not parse CSV."));
          return;
        }

        const rows = result.data.filter((row) =>
          Object.values(row).some((value) => String(value ?? "").trim().length > 0),
        );
        const columns = result.meta.fields?.filter(Boolean) ?? [];

        resolve({ rows, columns });
      },
      error: (error: Error) => reject(error),
    });
  });
}

export function parseCSVString(csv: string): Promise<ParsedCSV> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(csv, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      transform: (value) => String(value ?? "").trim(),
      complete: (result) => {
        if (result.errors.length > 0) {
          reject(new Error(result.errors[0]?.message ?? "Could not parse sample CSV."));
          return;
        }

        resolve({
          rows: result.data,
          columns: result.meta.fields?.filter(Boolean) ?? [],
        });
      },
      error: (error: Error) => reject(error),
    });
  });
}
