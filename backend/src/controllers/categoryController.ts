import { Request, Response, NextFunction } from "express";
import prisma from "../config/database";

// GET /api/categories
export const getAllCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await prisma.categoryEvent.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { events: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: categories,
      total: categories.length,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/categories/:id
export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const category = await prisma.categoryEvent.findUnique({
      where: { id },
      include: {
        events: {
          include: { speaker: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/categories
export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name } = req.body as { name: string };

    if (!name || name.trim() === "") {
      res.status(400).json({
        success: false,
        message: "Nama kategori wajib diisi.",
      });
      return;
    }

    const category = await prisma.categoryEvent.create({
      data: { name: name.trim() },
    });

    res.status(201).json({
      success: true,
      message: "Kategori berhasil dibuat.",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/categories/:id
export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name } = req.body as { name: string };

    if (!name || name.trim() === "") {
      res.status(400).json({
        success: false,
        message: "Nama kategori wajib diisi.",
      });
      return;
    }

    const existing = await prisma.categoryEvent.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan.",
      });
      return;
    }

    const category = await prisma.categoryEvent.update({
      where: { id },
      data: { name: name.trim() },
    });

    res.status(200).json({
      success: true,
      message: "Kategori berhasil diperbarui.",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/categories/:id
export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.categoryEvent.findUnique({
      where: { id },
      include: { _count: { select: { events: true } } },
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Kategori tidak ditemukan.",
      });
      return;
    }

    if (existing._count.events > 0) {
      res.status(400).json({
        success: false,
        message: `Kategori tidak dapat dihapus karena masih digunakan oleh ${existing._count.events} event.`,
      });
      return;
    }

    await prisma.categoryEvent.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Kategori berhasil dihapus.",
    });
  } catch (error) {
    next(error);
  }
};
