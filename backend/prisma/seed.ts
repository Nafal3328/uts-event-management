import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Seed Categories
  const categories = await Promise.all([
    prisma.categoryEvent.upsert({
      where: { name: "Teknologi" },
      update: {},
      create: { name: "Teknologi" },
    }),
    prisma.categoryEvent.upsert({
      where: { name: "Bisnis" },
      update: {},
      create: { name: "Bisnis" },
    }),
    prisma.categoryEvent.upsert({
      where: { name: "Pendidikan" },
      update: {},
      create: { name: "Pendidikan" },
    }),
    prisma.categoryEvent.upsert({
      where: { name: "Kesehatan" },
      update: {},
      create: { name: "Kesehatan" },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Seed Speakers
  const speakers = await Promise.all([
    prisma.speaker.upsert({
      where: { email: "budi.santoso@example.com" },
      update: {},
      create: {
        name: "Budi Santoso",
        expertise: "Software Engineering & Cloud Architecture",
        email: "budi.santoso@example.com",
      },
    }),
    prisma.speaker.upsert({
      where: { email: "sari.dewi@example.com" },
      update: {},
      create: {
        name: "Sari Dewi",
        expertise: "UI/UX Design & Product Management",
        email: "sari.dewi@example.com",
      },
    }),
    prisma.speaker.upsert({
      where: { email: "ahmad.fauzi@example.com" },
      update: {},
      create: {
        name: "Ahmad Fauzi",
        expertise: "Data Science & Machine Learning",
        email: "ahmad.fauzi@example.com",
      },
    }),
  ]);

  console.log(`✅ Created ${speakers.length} speakers`);

  // Seed Events
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: "Workshop Web Development Modern 2025",
        description:
          "Workshop intensif membahas teknologi terbaru dalam pengembangan web, termasuk React, TypeScript, dan deployment modern menggunakan Vercel dan Docker.",
        date: new Date("2025-06-15T09:00:00Z"),
        location: "Aula Teknik Informatika, Lantai 3",
        categoryId: categories[0].id,
        speakerId: speakers[0].id,
      },
    }),
    prisma.event.create({
      data: {
        title: "Seminar Kewirausahaan Digital",
        description:
          "Seminar motivasi dan edukasi tentang membangun startup digital dari nol, strategi growth hacking, dan mencari investor untuk produk teknologi.",
        date: new Date("2025-07-20T13:00:00Z"),
        location: "Gedung Serbaguna Kampus Utama",
        categoryId: categories[1].id,
        speakerId: speakers[1].id,
      },
    }),
    prisma.event.create({
      data: {
        title: "Konferensi AI & Machine Learning Indonesia",
        description:
          "Konferensi tahunan yang membahas perkembangan kecerdasan buatan, machine learning, dan aplikasinya dalam industri di Indonesia.",
        date: new Date("2025-08-10T08:00:00Z"),
        location: "Jakarta Convention Center",
        categoryId: categories[0].id,
        speakerId: speakers[2].id,
      },
    }),
  ]);

  console.log(`✅ Created ${events.length} events`);
  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
