import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function main() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL is not set");

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await prisma.admin.upsert({
        where: { email: "admin@bslctr.com" },
        update: {},
        create: {
            email: "admin@bslctr.com",
            password: hashedPassword,
        },
    });

    console.log("✅ Admin seeded:", admin.email);

    await prisma.$disconnect();
    await pool.end();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
