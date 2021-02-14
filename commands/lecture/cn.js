import { Command } from 'discord-akairo'

class CNCommand extends Command {
  constructor () {
    super('cn', {
      aliases: ['cn', 'clarify', 'clarification'],
      category: 'Lecture',
      description: {
        name: 'Clarification Needed',
        short: 'Clarification needed...',
        long: 'Request a clarification of something that was just said',
        usage: '?cn, ?clarify, ?clarification'
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
      const cn = queueMessage.embeds[0].fields[3].value.split('\n')

      if (cn.includes(message.member.displayName)) {
        return message.reply('You are already in the **Clarification Needed** queue.')
      }

      if (cn.includes('─')) {
        cn.pop()
      }

      cn.push(message.member.displayName)

      const newEmbed = this.client.util.embed(oldEmbed)
        .spliceFields(3, 1, {
          name: ':thinking: Clarification Needed',
          value: cn
        })

      queueMessage.edit(newEmbed)
      return message.reply('Your request was added to the queue.')
    } else {
      return message.util.send('There is no lecture happening right now.')
    }
  }
}

export default CNCommand
