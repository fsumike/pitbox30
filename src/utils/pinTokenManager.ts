import { supabase } from '../lib/supabase';

export async function updatePinToken(newRefreshToken: string): Promise<boolean> {
  try {
    const pinUserId = localStorage.getItem('pitbox_pin_user_id');
    if (!pinUserId) return false;

    const pinHashKey = `pitbox_pin_hash_${pinUserId}`;
    const encryptedTokenKey = `pitbox_pin_token_${pinUserId}`;

    const storedPinHash = localStorage.getItem(pinHashKey);
    if (!storedPinHash) return false;

    const pinCode = atob(storedPinHash);

    const encoder = new TextEncoder();
    const pinBytes = encoder.encode(pinCode.padEnd(16, '0').slice(0, 16));
    const tokenBytes = encoder.encode(newRefreshToken);
    const encrypted = new Uint8Array(tokenBytes.length);
    for (let i = 0; i < tokenBytes.length; i++) {
      encrypted[i] = tokenBytes[i] ^ pinBytes[i % pinBytes.length];
    }
    const newEncryptedToken = btoa(String.fromCharCode(...encrypted));

    localStorage.setItem(encryptedTokenKey, newEncryptedToken);

    await supabase
      .from('profiles')
      .update({ pin_refresh_token: newEncryptedToken })
      .eq('id', pinUserId);

    return true;
  } catch (err) {
    console.error('Error updating PIN token:', err);
    return false;
  }
}

export function hasPinEnabled(): boolean {
  const pinUserId = localStorage.getItem('pitbox_pin_user_id');
  if (!pinUserId) return false;
  return !!localStorage.getItem(`pitbox_pin_token_${pinUserId}`);
}

export async function getFreshTokenForPin(): Promise<string | null> {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error || !data.session?.refresh_token) {
      console.error('Failed to get fresh token for PIN:', error);
      return null;
    }
    return data.session.refresh_token;
  } catch (err) {
    console.error('Error getting fresh token:', err);
    return null;
  }
}
