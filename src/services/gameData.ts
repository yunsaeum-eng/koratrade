import { supabase } from '@/lib/supabase'
import { UserProfile, ExtendedProfile } from '@/types'

export async function saveProfile(profile: UserProfile, ext?: ExtendedProfile) {
  const payload: Record<string, unknown> = {
    id: profile.uid,
    name: profile.name,
    avatar: profile.avatar,
    avatar_bg: profile.avatarBg,
    goal: profile.goal,
    level: profile.level,
    xp: profile.xp,
    ...(ext ? {
      english_level: ext.englishLevel,
      industry: ext.industry,
      motivation: ext.learningReason,
    } : {}),
  }
  console.log('[saveProfile] upserting uid:', profile.uid, 'payload:', payload)
  const { error } = await supabase.from('profiles').upsert(payload)
  if (error) {
    console.error('[saveProfile] Supabase error:', error.code, error.message, error.details, error.hint)
    throw error
  }
  console.log('[saveProfile] success for uid:', profile.uid)
}

export async function loadProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase.from('profiles').select('id, name, avatar, avatar_bg, goal, english_level, industry, motivation, xp, level, streak_days, last_login_date').eq('id', userId).maybeSingle()
  if (error || !data) return null
  return {
    uid: data.id,
    email: '',
    name: data.name ?? '',
    avatar: data.avatar ?? '🙋',
    avatarBg: data.avatar_bg ?? '#F5EEF8',
    avatarGender: 'female',
    goal: data.goal ?? 'work',
    level: data.level ?? 1,
    xp: data.xp ?? 0,
    title: 'Intern',
    createdAt: new Date(),
  }
}

export async function loadExtendedProfile(userId: string): Promise<ExtendedProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('english_level, industry, motivation')
    .eq('id', userId)
    .maybeSingle()
  if (error || !data) return null
  return {
    jobGoal: '',
    englishLevel: data.english_level ?? 'beginner',
    industry: data.industry ?? '',
    learningReason: data.motivation ?? '',
  }
}

export async function saveExtendedProfile(userId: string, ext: ExtendedProfile) {
  const { error } = await supabase.from('profiles').update({
    english_level: ext.englishLevel,
    industry: ext.industry,
    motivation: ext.learningReason,
  }).eq('id', userId)
  if (error) throw error
}

export async function updateProfileStats(userId: string, xp: number, level: number) {
  const { error } = await supabase.from('profiles')
    .update({ xp, level })
    .eq('id', userId)
  if (error) throw error
}

export async function saveGameState(userId: string, data: unknown) {
  const { error } = await supabase.from('game_state').upsert({
    id: userId,
    data,
    updated_at: new Date().toISOString(),
  })
  if (error) throw error
}

export async function loadGameState(userId: string): Promise<unknown | null> {
  const { data, error } = await supabase
    .from('game_state')
    .select('data')
    .eq('id', userId)
    .maybeSingle()
  if (error || !data) return null
  return data.data
}

export async function resetProgress(userId: string) {
  const { error } = await supabase.from('game_state').delete().eq('id', userId)
  if (error) throw error
}

export async function deleteUserData(userId: string) {
  await supabase.from('game_state').delete().eq('id', userId)
  await supabase.from('profiles').delete().eq('id', userId)
}
