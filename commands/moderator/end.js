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
        usage: '!end'
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

    const messages = await message.channel.messages.fetch({ limit: 10 })
    const filtered = await messages.filter(message => message.embeds.length !== 0)

    if (filtered.size >= 1) {
      return message.channel.bulkDelete(10)
    } else {
      return message.channel.send('There is no lecture happening right now.')
    }
  }
}

export default EndLectureCommand
