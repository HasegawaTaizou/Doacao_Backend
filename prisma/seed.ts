import { PrismaClient, STATUS } from "@prisma/client";
import { type } from "express/lib/response";
const prisma = new PrismaClient();

async function insertBloodTypeData() {
  const bloodTypes = ["NA", "O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

  Promise.all(
    bloodTypes.map((bloodType) =>
      prisma.bloodType.create({
        data: {
          type: bloodType,
        },
      })
    )
  )
    .then(() => console.info("[BLOOD TYPE] Succussfully create coffee records"))
    .catch((e) =>
      console.error("[BLOOD TYPE] Failed to create coffee records", e)
    );
}

async function insertSexData() {
  const sexs = ["MASCULINE", "FEMININE"];

  Promise.all(
    sexs.map((sexData) =>
      prisma.sex.create({
        data: {
          sex: sexData,
        },
      })
    )
  )
    .then(() => console.info("[SEX] Succussfully create coffee records"))
    .catch((e) => console.error("[SEX] Failed to create coffee records", e));
}

async function insertStarData() {
  const stars = [1, 2, 3, 4, 5];

  Promise.all(
    stars.map((star) =>
      prisma.star.create({
        data: {
          starNumber: star,
        },
      })
    )
  )
    .then(() => console.info("[STAR] Succussfully create coffee records"))
    .catch((e) => console.error("[STAR] Failed to create coffee records", e));
}

async function insertStatusData() {
  const statusData = [
    STATUS.SCHEDULED,
    STATUS.CONCLUDED,
    STATUS.RESCHEDULED,
    STATUS.PENDING,
  ];

  Promise.all(
    statusData.map((stat) =>
      prisma.status.create({
        data: {
          status: stat,
        },
      })
    )
  )
    .then(() => console.info("[STATUS] Succussfully create coffee records"))
    .catch((e) => console.error("[STATUS] Failed to create coffee records", e));
}

await insertBloodTypeData()
await insertSexData()
await insertStarData()
await insertStatusData()