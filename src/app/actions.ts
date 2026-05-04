// src/app/actions.ts
'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Iniciar sesión
export async function iniciarSesion(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const cookieStore = await cookies();
  cookieStore.set('userId', '1', { httpOnly: true });
  cookieStore.set('userEmail', email, { httpOnly: true });
  cookieStore.set('userNombre', email?.split('@')[0] || 'Usuario', { httpOnly: true });
  
  return { success: true };
}

// Registrar usuario
export async function registrarUsuario(formData: FormData) {
  const email = formData.get('email') as string;
  const nombre = formData.get('nombre') as string;
  const password = formData.get('password') as string;

  const cookieStore = await cookies();
  cookieStore.set('userId', '1', { httpOnly: true });
  cookieStore.set('userEmail', email, { httpOnly: true });
  cookieStore.set('userNombre', nombre, { httpOnly: true });
  
  return { success: true };
}

// Cerrar sesión
export async function cerrarSesion() {
  const cookieStore = await cookies();
  cookieStore.delete('userId');
  cookieStore.delete('userEmail');
  cookieStore.delete('userNombre');
  redirect('/');
}

// Obtener usuario actual
export async function getUsuarioActual() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  const userEmail = cookieStore.get('userEmail')?.value;
  const userNombre = cookieStore.get('userNombre')?.value;
  
  if (!userId) return null;
  
  return {
    id: parseInt(userId),
    email: userEmail || '',
    nombre: userNombre || 'Usuario'
  };
}