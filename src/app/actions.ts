'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- FUNCIÓN DE REGISTRO ---
export async function registrarUsuario(formData: FormData) {
  const email = formData.get('email') as string;
  const nombre = formData.get('nombre') as string;
  const password = formData.get('password') as string;

  try {
    const nuevoUsuario = await prisma.usuario.create({
      data: { 
        email, 
        nombre, 
        password,
        pokemonAvatar: "pendiente",
        rol: "user"
      }
    });

    const cookieStore = await cookies();
    // CAMBIO CLAVE: httpOnly en false para que el Cliente la vea
    cookieStore.set('userId', nuevoUsuario.id.toString(), { 
      path: '/',
      httpOnly: false, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 
    });
    cookieStore.set('userNombre', nuevoUsuario.nombre, { 
      path: '/',
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7
    });
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Error al registrar el usuario" };
  }
}

// --- FUNCIÓN DE INICIO DE SESIÓN ---
export async function iniciarSesion(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario || usuario.password !== password) {
      return { success: false, error: "Credenciales incorrectas" };
    }

    const cookieStore = await cookies();
    // CAMBIO CLAVE: httpOnly en false
    cookieStore.set('userId', usuario.id.toString(), { 
      path: '/',
      httpOnly: false, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 
    });
    cookieStore.set('userNombre', usuario.nombre, { 
      path: '/',
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al iniciar sesión" };
  }
}

// --- FUNCIÓN DE CERRAR SESIÓN ---
export async function cerrarSesion() {
  const cookieStore = await cookies();
  cookieStore.delete('userId');
  cookieStore.delete('userNombre');
  // No necesitamos redirect aquí si el cliente recarga la página
}