import { Command } from 'discord-akairo'

class EndLectureCommand extends Command {
  constructor () {
    super('end', {
      aliases: ['end', 'close'],
      category: 'Moderator',
      description: {
        name: 'End Lecture',
        short: 'Close the current lecture queue',
        long: 'Close the current lecture queue. Participants will no longer people to join the queue, and the queue dashboard will be removed.',
        usage: '?end'
      },
      channel: 'guild',
      userPermissions: ['BAN_MEMBERS']
    })
  }

  async exec (message) {
    if (message.channel.id !== this.client.config.lectures.channels.lectureQueue) {
      const lectureQueue = await this.client.channels.cache.get(this.client.config.lectures.channels.lectureQueue)
      return message.channel.send(`This command only works in the ${lectureQueue} channel.`)
    }

    await message.delete()

    const messages = await message.channel.messages.fetch({ limit: 50 })
    const embedMatch = /^Lecture Queue$|^Breakfast with Bret$/gm
    const filtered = await messages.filter(message => message.embeds.length !== 0 && message.embeds[0].footer.text.match(embedMatch))

    if (filtered.size >= 1) {
      const queueMessage = filtered.first()
      await queueMessage.delete()
      const lectureChat = await this.client.channels.cache.get(this.client.config.lectures.channels.lectureChat)

      if (queueMessage.embeds[0].footer.text === 'Lecture Queue') {
        const topic = queueMessage.embeds[0].title
        return lectureChat.send(`:no_entry_sign: The queue for **${topic}** is now closed.`)
      }

      if (queueMessage.embeds[0].footer.text === 'Breakfast with Bret') {
        return lectureChat.send(':no_entry_sign: The queue for **Breakfast with Bret** is now closed.')
      }
    } else {
      return message.channel.send('There is no lecture happening right now.')
    }
  }
}

export default EndLectureCommand
