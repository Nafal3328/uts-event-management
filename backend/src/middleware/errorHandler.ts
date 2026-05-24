import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("❌ Error:", err.message);

  // Prisma unique constraint violation
  if (err.code === "P2002") {
    res.status(409).json({
      success: false,
      message: "Data dengan nilai tersebut sudah ada (duplikat).",
    });
    return;
  }

  // Prisma record not found
  if (err.code === "P2025") {
    res.status(404).json({
      success: false,
      message: "Data tidak ditemukan.",
    });
    return;
  }

  // Prisma foreign key constraint
  if (err.code === "P2003") {
    res.status(400).json({
      success: false,
      message:
        "Data tidak dapat dihapus karena masih digunakan oleh data lain.",
    });
    return;
  }

  const statusCode = err.statusCode ?? 500;
  res.status(statusCode).json({
    success: false,
    message: err.message ?? "Terjadi kesalahan pada server.",
  });
};

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: "Endpoint tidak ditemukan.",
  });
};
