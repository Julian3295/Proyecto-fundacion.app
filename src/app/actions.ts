'use server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

// --- FUNCIÓN DE ACTUALIZAR AVATAR (Simplificada para ahorrar tiempo) ---
export async function actualizarAvatar(pokemonNombre: string) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return { success: false, error: "No hay sesión activa" };
    }

    await prisma.usuario.update({
      where: { id: parseInt(userId) },
      data: { pokemonAvatar: pokemonNombre }
    });

    return { success: true };
  } catch (error) {
    console.error("Error al actualizar avatar:", error);
    return { success: false, error: "Error de servidor" };
  }
}

// --- FUNCIÓN DE REGISTRO ---
export async function registrarUsuario(formData: FormData) {
  const email = formData.get('email') as string;
  const nombre = formData.get('nombre') as string;
  const password = formData.get('password') as string;
  const edad = formData.get('edad') ? parseInt(formData.get('edad') as string) : null;
  const telefono = formData.get('telefono') as string;
  const ciudad = formData.get('ciudad') as string;

  try {
    const nuevoUsuario = await prisma.usuario.create({
      data: { 
        email, 
        nombre, 
        password,
        edad,
        telefono,
        ciudad,
        pokemonAvatar: "pendiente",
        rol: "user"
      }
    });

    const cookieStore = await cookies();
    cookieStore.set('userId', nuevoUsuario.id.toString(), { 
      path: '/',
      httpOnly: false, 
      maxAge: 60 * 60 * 24 * 7 
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al registrar" };
  }
}

// --- FUNCIÓN DE INICIO DE SESIÓN ---
export async function iniciarSesion(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario || usuario.password !== password) {
      return { success: false, error: "Credenciales incorrectas" };
    }

    const cookieStore = await cookies();
    cookieStore.set('userId', usuario.id.toString(), { 
      path: '/',
      httpOnly: false, 
      maxAge: 60 * 60 * 24 * 7 
    });

    return { success: true };
  } catch (error) {
    console.error("Error en iniciarSesion:", error);
    return { success: false, error: "Error al iniciar sesión" };
  }
}

// --- FUNCIÓN DE CERRAR SESIÓN ---
export async function cerrarSesion() {
  const cookieStore = await cookies();
  cookieStore.delete('userId');
  cookieStore.delete('userNombre');
  // Al borrar las cookies, el middleware o la página detectarán que no hay sesión
}