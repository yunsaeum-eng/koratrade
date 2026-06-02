import { supabase } from '@/lib/supabase'
import { UserProfile, ExtendedProfile } from '@/types'

export async function saveProfile(profile: UserProfile, ext?: ExtendedProfile) {
  const payload = {
    id: profile.uid,
    email: profile.email,
    name: profile.name,
    avatar: profile.avatar,
    avatar_bg: profile.avatarBg,
    avatar_gender: profile.avatarGender,
    goal: profile.goal,
    level: profile.level,
    xp: profile.xp,
    title: profile.title,
    ...(ext ? {
      job_goal: ext.jobGoal,
      english_level: ext.englishLevel,
      industry: ext.industry,
      learning_reason: ext.learningReason,
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
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
  if (error || !data) return null
  return {
    uid: data.id,
    email: data.email ?? '',
    name: data.name ?? '',
    avatar: data.avatar ?? '🙋',
    avatarBg: data.avatar_bg ?? '#F5EEF8',
    avatarGender: data.avatar_gender ?? 'female',
    goal: data.goal ?? 'work',
    level: data.level ?? 1,
    xp: data.xp ?? 0,
    title: data.title ?? 'Intern',
    createdAt: new Date(data.created_at),
  }
}

export async function loadExtendedProfile(userId: string): Promise<ExtendedProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('job_goal, english_level, industry, learning_reason')
    .eq('id', userId)
    .maybeSingle()
  if (error || !data) return null
  return {
    jobGoal: data.job_goal ?? '',
    englishLevel: data.english_level ?? 'beginner',
    industry: data.industry ?? '',
    learningReason: data.learning_reason ?? '',
  }
}

export async function saveExtendedProfile(userId: string, ext: ExtendedProfile) {
  const { error } = await supabase.from('profiles').update({
    job_goal: ext.jobGoal,
    english_level: ext.englishLevel,
    industry: ext.industry,
    learning_reason: ext.learningReason,
  }).eq('id', userId)
  if (error) throw error
}

export async function updateProfileStats(userId: string, xp: number, level: number, title: string) {
  const { error } = await supabase.from('profiles')
    .update({ xp, level, title })
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
