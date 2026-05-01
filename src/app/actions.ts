"use server";

import { prisma } from "../lib/db";
import { revalidatePath } from "next/cache";

export async function registrarMiembro(formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const rol = formData.get("rol") as string;

  if (!nombre || !rol) return;

  await prisma.miembro.create({
    data: {
      nombre,
      rol,
    },
  });

  // Esto refresca la página para mostrar el nuevo miembro
  revalidatePath("/");
}