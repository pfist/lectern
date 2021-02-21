import { Command } from 'discord-akairo'

class StartBreakfastCommand extends Command {
  constructor () {
    super('breakfast', {
      aliases: ['breakfast'],
      category: 'Moderator',
      description: {
        name: 'Start Breakfast',
        short: 'Open a Breakfast with Bret queue in the current channel',
        long: 'Open a Breakfast with Bret queue in the current channel. This will create a dashboard that displays the current speaker and the list of people waiting to speak.',
        usage: '?breakfast'
      },
      channel: 'guild',
      userPermissions: ['BAN_MEMBERS']
    })
  }

  async exec (message) {
    try {
      if (message.channel.id !== this.client.config.lectures.channels.lectureQueue) {
        const lectureQueue = await this.client.channels.cache.get(this.client.config.lectures.channels.lectureQueue)
        return message.channel.send(`This command only works in the ${lectureQueue} channel.`)
      }

      const lectureChat = await this.client.channels.cache.get(this.client.config.lectures.channels.lectureChat)
      const queue = this.client.util.embed()
        .setTitle('Breakfast with Bret')
        .addField(':speech_left: Current Speaker', '─')
        .addField(':point_up: Waiting to Speak', ['─'])
        .setFooter('Breakfast with Bret')
        .setTimestamp()

      await message.util.send({ embed: queue })
      return lectureChat.send(':white_check_mark: The queue for **Breakfast with Bret** is now open.')
    } catch (e) {
      this.client.log.error(e)
    }
  }
}

export default StartBreakfastCommand
