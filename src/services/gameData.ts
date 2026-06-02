import { supabase } from '@/lib/supabase'
import { UserProfile, ExtendedProfile, Message } from '@/types'

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

// ─── game_state blob (phase, episode, expressions, badges, work notes) ─────────

export async function saveGameState(userId: string, data: unknown) {
  const { error } = await supabase.from('game_state').upsert({
    id: userId,
    data,
    updated_at: new Date().toISOString(),
  })
  if (error) console.error('[saveGameState]', error.code, error.message)
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

// ─── Chat history ──────────────────────────────────────────────────────────────

export async function saveChatMessage(userId: string, roomId: string, message: Message) {
  const { error } = await supabase.from('chat_history').upsert({
    user_id: userId,
    room_id: roomId,
    message_id: message.id,
    sender_id: message.senderId,
    content: message.content,
    type: message.type,
    triggers_hint: message.triggersHint ?? false,
    game_timestamp: message.gameTimestamp ?? null,
    is_read: message.isRead,
    attachment_type: message.attachmentType ?? null,
    attachment_name: message.attachmentName ?? null,
  }, { onConflict: 'user_id,message_id' })
  if (error) console.error('[saveChatMessage]', error.code, error.message)
}

export async function loadChatHistory(userId: string): Promise<Record<string, Message[]>> {
  const { data, error } = await supabase
    .from('chat_history')
    .select('room_id, message_id, sender_id, content, type, triggers_hint, game_timestamp, is_read, attachment_type, attachment_name, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
  if (error || !data) return {}
  const result: Record<string, Message[]> = {}
  for (const row of data) {
    if (!result[row.room_id]) result[row.room_id] = []
    result[row.room_id].push({
      id: row.message_id,
      roomId: row.room_id,
      senderId: row.sender_id,
      content: row.content,
      type: row.type as Message['type'],
      triggersHint: row.triggers_hint ?? undefined,
      gameTimestamp: row.game_timestamp ?? undefined,
      isRead: row.is_read,
      attachmentType: row.attachment_type ?? undefined,
      attachmentName: row.attachment_name ?? undefined,
      timestamp: new Date(row.created_at),
    })
  }
  return result
}

// ─── NPC Relationships ─────────────────────────────────────────────────────────

export async function saveRelationships(userId: string, relationships: Record<string, number>) {
  const rows = Object.entries(relationships).map(([npcId, score]) => ({
    user_id: userId,
    npc_id: npcId,
    score,
    updated_at: new Date().toISOString(),
  }))
  if (rows.length === 0) return
  const { error } = await supabase.from('relationships').upsert(rows, { onConflict: 'user_id,npc_id' })
  if (error) console.error('[saveRelationships]', error.code, error.message)
}

export async function loadRelationships(userId: string): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('relationships')
    .select('npc_id, score')
    .eq('user_id', userId)
  if (error || !data) return {}
  return Object.fromEntries(data.map(r => [r.npc_id, r.score]))
}

// ─── Completed missions ────────────────────────────────────────────────────────

export async function saveCompletedMission(userId: string, missionId: string) {
  const { error } = await supabase.from('completed_missions').upsert({
    user_id: userId,
    mission_id: missionId,
  }, { onConflict: 'user_id,mission_id' })
  if (error) console.error('[saveCompletedMission]', error.code, error.message)
}

export async function loadCompletedMissions(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('completed_missions')
    .select('mission_id')
    .eq('user_id', userId)
  if (error || !data) return []
  return data.map((r: { mission_id: string }) => r.mission_id)
}

// ─── Cleanup ───────────────────────────────────────────────────────────────────

export async function resetProgress(userId: string) {
  await Promise.all([
    supabase.from('game_state').delete().eq('id', userId),
    supabase.from('chat_history').delete().eq('user_id', userId),
    supabase.from('relationships').delete().eq('user_id', userId),
    supabase.from('completed_missions').delete().eq('user_id', userId),
  ])
}

export async function deleteUserData(userId: string) {
  await Promise.all([
    supabase.from('game_state').delete().eq('id', userId),
    supabase.from('chat_history').delete().eq('user_id', userId),
    supabase.from('relationships').delete().eq('user_id', userId),
    supabase.from('completed_missions').delete().eq('user_id', userId),
    supabase.from('profiles').delete().eq('id', userId),
  ])
}
