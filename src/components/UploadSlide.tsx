"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, FileText, ImageIcon, File } from "lucide-react";
import { useDropzone } from "@uploadthing/react";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";
import { useUploadThing } from "~/lib/uploadthing";
import { type UploadedFile } from "~/lib/types";
import { Card } from "./ui/Card";

interface UploadSlideProps {
  uploads: UploadedFile[];
  onChange: (uploads: UploadedFile[]) => void;
}

const UPLOAD_TIMEOUT_MS = 60_000;

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) {
    return <ImageIcon className="h-4 w-4 text-brand-400" />;
  }
  if (ext === "pdf") {
    return <FileText className="h-4 w-4 text-red-400" />;
  }
  return <File className="h-4 w-4 text-gray-400" />;
}

export function UploadSlide({ uploads, onChange }: UploadSlideProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const { startUpload, routeConfig } = useUploadThing("fileUploader");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      setIsUploading(true);
      setUploadError(null);

      // Timeout fallback
      timeoutRef.current = setTimeout(() => {
        setUploadError("Upload timed out. Please try again.");
        setIsUploading(false);
      }, UPLOAD_TIMEOUT_MS);

      void startUpload(acceptedFiles)
        .then((res) => {
          clearTimeout(timeoutRef.current);
          if (res) {
            const newFiles: UploadedFile[] = res.map((file) => ({
              name: file.name,
              url: file.ufsUrl ?? file.url,
              size: file.size,
            }));
            onChange([...uploads, ...newFiles]);
          }
        })
        .catch((err: unknown) => {
          clearTimeout(timeoutRef.current);
          setUploadError(
            err instanceof Error ? err.message : "Upload failed",
          );
        })
        .finally(() => {
          setIsUploading(false);
        });
    },
    [startUpload, uploads, onChange],
  );

  const { fileTypes } = generatePermittedFileTypes(routeConfig);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: fileTypes.length
      ? generateClientDropzoneAccept(fileTypes)
      : undefined,
  });

  const removeFile = (index: number) => {
    onChange(uploads.filter((_, i) => i !== index));
  };

  return (
    <Card className="min-h-[360px] md:p-16 lg:p-20">
      <p className="mb-4 text-base text-gray-400">
        Upload any images you&apos;d like to share — logos, brand assets,
        screenshots, etc.
      </p>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors ${
          isDragActive
            ? "border-brand-400 bg-brand-500/10"
            : "border-gray-700 bg-gray-800/40 hover:border-gray-600 hover:bg-gray-800/60"
        }`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <>
            <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-brand-500/30 border-t-brand-400" />
            <p className="text-base font-medium text-gray-300">Uploading...</p>
          </>
        ) : (
          <>
            <Upload
              className={`mb-3 h-8 w-8 ${isDragActive ? "text-brand-400" : "text-gray-500"}`}
            />
            <p className="text-base font-medium text-gray-300">
              {isDragActive ? "Drop images here" : "Drag & drop images here"}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              or click to browse (max 16 MB per file)
            </p>
          </>
        )}
      </div>

      {uploadError && (
        <p className="mt-3 text-sm text-red-400">{uploadError}</p>
      )}

      {/* Uploaded files list */}
      {uploads.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-gray-500">
            {uploads.length} file{uploads.length !== 1 ? "s" : ""} uploaded
          </p>
          {uploads.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="flex items-center gap-3 rounded-lg border border-gray-700/50 bg-gray-800/40 px-3 py-2"
            >
              {getFileIcon(file.name)}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-200">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="shrink-0 cursor-pointer rounded p-1 text-gray-500 transition-colors hover:bg-gray-700 hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
