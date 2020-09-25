import { Command } from 'discord-akairo'

class StartLectureCommand extends Command {
  constructor () {
    super('start', {
      aliases: ['start', 'open'],
      category: 'Moderator',
      description: {
        name: 'Start Lecture',
        short: 'Open a lecture queue in the current channel',
        long: 'Open a lecture queue in the current channel. This will create a dashboard that displays the current speaker and queues for OTP, RTT, and clarifications.',
        usage: '?start <topic>'
      },
      channel: 'guild',
      userPermissions: ['BAN_MEMBERS']
    })
  }

  * args () {
    const topic = yield {
      match: 'rest',
      prompt: {
        start: 'Enter the topic for this lecture.'
      }
    }

    return { topic }
  }

  async exec (message, { topic }) {
    if (message.channel.id !== this.client.config.lectures.channels.lectureQueue) {
      const lectureQueue = await this.client.channels.cache.get(this.client.config.lectures.channels.lectureQueue)
      return message.channel.send(`This command only works in the ${lectureQueue} channel.`)
    }

    await message.channel.bulkDelete(3)

    const lectureChat = await this.client.channels.cache.get(this.client.config.lectures.channels.lectureChat)
    const queue = this.client.util.embed()
      .setTitle(topic)
      .addField(':speech_left: Current Speaker', '─')
      .addField(':point_up: On That Point', ['─'])
      .addField(':raised_hands: Related To That', ['─'])
      .addField(':thinking: Clarification Needed', ['─'])
      .setTimestamp()

    await message.util.send({ embed: queue })
    return lectureChat.send(`:white_check_mark: The queue for **${topic}** is now open.`)
  }
}

export default StartLectureCommand
