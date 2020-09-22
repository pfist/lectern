import { Command } from 'discord-akairo'

class OTPCommand extends Command {
  constructor () {
    super('otp', {
      aliases: ['otp'],
      category: 'Speaker',
      description: {
        name: 'On That Point',
        content: 'Request to share an idea that\'s directly related to the current topic',
        usage: '!otp'
      }
    })
  }

  async exec (message) {
    const channel = await this.client.channels.cache.get(this.client.config.lectures.channels.lectureQueue)
    const messages = await channel.messages.fetch({ limit: 10 })

    if (messages.some(message => message.embeds)) {
      const queueMessage = await messages.filter(message => message.embeds.length !== 0).first()
      const oldEmbed = queueMessage.embeds[0]
      const otp = queueMessage.embeds[0].fields[1].value.split('\n')

      if (otp.includes(message.author.username)) {
        return message.reply('You are already in the queue.')
      }

      if (otp.includes('─')) {
        otp.pop()
      }

      otp.push(message.author.username)

      const newEmbed = this.client.util.embed(oldEmbed)
        .spliceFields(1, 1, {
          name: 'On That Point',
          value: otp
        })

      queueMessage.edit(newEmbed)
      return message.reply('Your request was added to the queue.')
    } else {
      return message.util.send('There is no lecture happening right now.')
    }
  }
}

export default OTPCommand
