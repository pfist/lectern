import { Command } from 'discord-akairo'

class BretCommand extends Command {
  constructor () {
    super('bret', {
      aliases: ['bret'],
      category: 'Lecture',
      description: {
        name: 'Bret',
        short: 'Join the queue to ask Bret Weinstein a question.',
        long: 'Join the queue to ask Bret Weinstein a question.',
        usage: '?bret'
      },
      channel: 'guild',
      userPermissions: ['SEND_MESSAGES']
    })
  }

  async exec (message) {
    const channel = await this.client.channels.cache.get(this.client.config.lectures.channels.lectureQueue)
    const messages = await channel.messages.fetch()
    const messagesWithEmbeds = await messages.filter(message => message.embeds.length !== 0)
    this.client.log.debug(`${messagesWithEmbeds.size} messages with embeds found.`)
    messagesWithEmbeds.each(message => this.client.log.debug(message.embeds[0]))

    if (messagesWithEmbeds.size >= 1) {
      const messagesWithQueues = await messagesWithEmbeds.filter(message => message.embeds[0].footer.text === 'Breakfast with Bret')
      this.client.log.debug(`${messagesWithQueues.size} messages with queues found.`)

      if (messagesWithQueues.size >= 1) {
        const queueMessage = messagesWithQueues.first()
        const oldEmbed = queueMessage.embeds[0]
        const queue = queueMessage.embeds[0].fields[1].value.split('\n')

        if (queue.includes(message.member.displayName)) {
          return message.reply('You are already in the queue.')
        }

        if (queue.includes('─')) {
          queue.pop()
        }

        queue.push(message.member.displayName)

        const newEmbed = this.client.util.embed(oldEmbed)
          .spliceFields(1, 1, {
            name: ':point_up: Waiting to Speak',
            value: queue
          })

        queueMessage.edit(newEmbed)
        return message.reply('Your request was added to the queue.')
      } else {
        return message.util.send('Bret isn\'t here right now. :cry:')
      }
    } else {
      this.client.log.error('No messages with embeds found!')
    }
  }
}

export default BretCommand
