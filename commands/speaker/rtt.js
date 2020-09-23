import { Command } from 'discord-akairo'

class RTTCommand extends Command {
  constructor () {
    super('rtt', {
      aliases: ['rtt'],
      category: 'Speaker',
      description: {
        name: 'Related To That',
        short: 'Related to that...',
        long: 'Request to make a point that\'s _tangentially_ related to the current topic',
        usage: '!rtt'
      }
    })
  }

  async exec (message) {
    const channel = await this.client.channels.cache.get(this.client.config.lectures.channels.lectureQueue)
    const messages = await channel.messages.fetch({ limit: 10 })

    if (messages.some(message => message.embeds)) {
      const queueMessage = await messages.filter(message => message.embeds.length !== 0).first()
      const oldEmbed = queueMessage.embeds[0]
      const rtt = queueMessage.embeds[0].fields[2].value.split('\n')

      if (rtt.includes(message.author.username)) {
        return message.reply('You are already in the RTT queue.')
      }

      if (rtt.includes('─')) {
        rtt.pop()
      }

      rtt.push(message.author.username)

      const newEmbed = this.client.util.embed(oldEmbed)
        .spliceFields(2, 1, {
          name: ':raised_hands: Related To That',
          value: rtt
        })

      queueMessage.edit(newEmbed)
      return message.reply('Your request was added to the queue.')
    } else {
      return message.util.send('There is no lecture happening right now.')
    }
  }
}

export default RTTCommand
