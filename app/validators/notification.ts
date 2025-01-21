import vine from '@vinejs/vine'

export const NotificationValidator = vine.compile(
  vine.object({
    type: vine.enum(['new_post', 'mention', 'like']),
    content: vine.string().trim().maxLength(255),
    userId: vine.number(),
    triggeredById: vine.number(),
  })
)
