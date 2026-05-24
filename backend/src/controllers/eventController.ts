import { Request, Response, NextFunction } from "express";
import prisma from "../config/database";

// GET /api/events
export const getAllEvents = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
      include: {
        category: true,
        speaker: true,
      },
    });

    res.status(200).json({
      success: true,
      data: events,
      total: events.length,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/events/:id
export const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        category: true,
        speaker: true,
      },
    });

    if (!event) {
      res.status(404).json({
        success: false,
        message: "Event tidak ditemukan.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/events
export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, date, location, categoryId, speakerId } =
      req.body as {
        title: string;
        description: string;
        date: string;
        location: string;
        categoryId: string;
        speakerId: string;
      };

    if (!title || title.trim() === "") {
      res.status(400).json({ success: false, message: "Judul event wajib diisi." });
      return;
    }
    if (!description || description.trim() === "") {
      res.status(400).json({ success: false, message: "Deskripsi wajib diisi." });
      return;
    }
    if (!date) {
      res.status(400).json({ success: false, message: "Tanggal wajib diisi." });
      return;
    }
    if (!location || location.trim() === "") {
      res.status(400).json({ success: false, message: "Lokasi wajib diisi." });
      return;
    }
    if (!categoryId) {
      res.status(400).json({ success: false, message: "Kategori wajib dipilih." });
      return;
    }
    if (!speakerId) {
      res.status(400).json({ success: false, message: "Pembicara wajib dipilih." });
      return;
    }

    // Validate category exists
    const category = await prisma.categoryEvent.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      res.status(400).json({ success: false, message: "Kategori tidak valid." });
      return;
    }

    // Validate speaker exists
    const speaker = await prisma.speaker.findUnique({
      where: { id: speakerId },
    });
    if (!speaker) {
      res.status(400).json({ success: false, message: "Pembicara tidak valid." });
      return;
    }

    const event = await prisma.event.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        date: new Date(date),
        location: location.trim(),
        categoryId,
        speakerId,
      },
      include: {
        category: true,
        speaker: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Event berhasil dibuat.",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/events/:id
export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, date, location, categoryId, speakerId } =
      req.body as {
        title: string;
        description: string;
        date: string;
        location: string;
        categoryId: string;
        speakerId: string;
      };

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Event tidak ditemukan.",
      });
      return;
    }

    if (!title || title.trim() === "") {
      res.status(400).json({ success: false, message: "Judul event wajib diisi." });
      return;
    }
    if (!description || description.trim() === "") {
      res.status(400).json({ success: false, message: "Deskripsi wajib diisi." });
      return;
    }
    if (!date) {
      res.status(400).json({ success: false, message: "Tanggal wajib diisi." });
      return;
    }
    if (!location || location.trim() === "") {
      res.status(400).json({ success: false, message: "Lokasi wajib diisi." });
      return;
    }
    if (!categoryId) {
      res.status(400).json({ success: false, message: "Kategori wajib dipilih." });
      return;
    }
    if (!speakerId) {
      res.status(400).json({ success: false, message: "Pembicara wajib dipilih." });
      return;
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        title: title.trim(),
        description: description.trim(),
        date: new Date(date),
        location: location.trim(),
        categoryId,
        speakerId,
      },
      include: {
        category: true,
        speaker: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Event berhasil diperbarui.",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/events/:id
export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Event tidak ditemukan.",
      });
      return;
    }

    await prisma.event.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Event berhasil dihapus.",
    });
  } catch (error) {
    next(error);
  }
};
