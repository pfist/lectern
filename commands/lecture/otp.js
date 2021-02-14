import { Command } from 'discord-akairo'

class OTPCommand extends Command {
  constructor () {
    super('otp', {
      aliases: ['otp'],
      category: 'Lecture',
      description: {
        name: 'On That Point',
        short: 'On that point...',
        long: 'Request to share an idea that\'s _directly_ related to the current topic',
        usage: '?otp'
      },
      channel: 'guild',
      userPermissions: ['SEND_MESSAGES']
    })
  }

  async exec (message) {
    const channel = await this.client.channels.cache.get(this.client.config.lectures.channels.lectureQueue)
    const messages = await channel.messages.fetch({ limit: 50 })
    const filtered = await messages.filter(message => message.embeds.length !== 0 && message.embeds[0].footer.text === 'Lecture Queue')

    if (filtered.size >= 1) {
      const queueMessage = filtered.first()
      const oldEmbed = queueMessage.embeds[0]
      const otp = queueMessage.embeds[0].fields[1].value.split('\n')

      if (otp.includes(message.member.displayName)) {
        return message.reply('You are already in the **On That Point** queue.')
      }

      if (otp.includes('─')) {
        otp.pop()
      }

      otp.push(message.member.displayName)

      const newEmbed = this.client.util.embed(oldEmbed)
        .spliceFields(1, 1, {
          name: ':point_up: On That Point',
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
