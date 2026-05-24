import { Request, Response, NextFunction } from "express";
import prisma from "../config/database";

// GET /api/speakers
export const getAllSpeakers = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const speakers = await prisma.speaker.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { events: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: speakers,
      total: speakers.length,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/speakers/:id
export const getSpeakerById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const speaker = await prisma.speaker.findUnique({
      where: { id },
      include: {
        events: {
          include: { category: true },
          orderBy: { date: "asc" },
        },
      },
    });

    if (!speaker) {
      res.status(404).json({
        success: false,
        message: "Pembicara tidak ditemukan.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: speaker,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/speakers
export const createSpeaker = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, expertise, email } = req.body as {
      name: string;
      expertise: string;
      email: string;
    };

    if (!name || name.trim() === "") {
      res.status(400).json({ success: false, message: "Nama wajib diisi." });
      return;
    }
    if (!expertise || expertise.trim() === "") {
      res
        .status(400)
        .json({ success: false, message: "Keahlian wajib diisi." });
      return;
    }
    if (!email || email.trim() === "") {
      res.status(400).json({ success: false, message: "Email wajib diisi." });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res
        .status(400)
        .json({ success: false, message: "Format email tidak valid." });
      return;
    }

    const speaker = await prisma.speaker.create({
      data: {
        name: name.trim(),
        expertise: expertise.trim(),
        email: email.trim().toLowerCase(),
      },
    });

    res.status(201).json({
      success: true,
      message: "Pembicara berhasil ditambahkan.",
      data: speaker,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/speakers/:id
export const updateSpeaker = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, expertise, email } = req.body as {
      name: string;
      expertise: string;
      email: string;
    };

    if (!name || name.trim() === "") {
      res.status(400).json({ success: false, message: "Nama wajib diisi." });
      return;
    }
    if (!expertise || expertise.trim() === "") {
      res
        .status(400)
        .json({ success: false, message: "Keahlian wajib diisi." });
      return;
    }
    if (!email || email.trim() === "") {
      res.status(400).json({ success: false, message: "Email wajib diisi." });
      return;
    }

    const existing = await prisma.speaker.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Pembicara tidak ditemukan.",
      });
      return;
    }

    const speaker = await prisma.speaker.update({
      where: { id },
      data: {
        name: name.trim(),
        expertise: expertise.trim(),
        email: email.trim().toLowerCase(),
      },
    });

    res.status(200).json({
      success: true,
      message: "Data pembicara berhasil diperbarui.",
      data: speaker,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/speakers/:id
export const deleteSpeaker = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.speaker.findUnique({
      where: { id },
      include: { _count: { select: { events: true } } },
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Pembicara tidak ditemukan.",
      });
      return;
    }

    if (existing._count.events > 0) {
      res.status(400).json({
        success: false,
        message: `Pembicara tidak dapat dihapus karena masih terdaftar di ${existing._count.events} event.`,
      });
      return;
    }

    await prisma.speaker.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Pembicara berhasil dihapus.",
    });
  } catch (error) {
    next(error);
  }
};
