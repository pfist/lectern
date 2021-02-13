import { Command } from 'discord-akairo'

class NextSpeakerCommand extends Command {
  constructor () {
    super('next', {
      aliases: ['next'],
      category: 'Moderator',
      description: {
        name: 'Next Speaker',
        short: 'Select the next speaker in the queue',
        long: 'Select the next speaker in the queue. This will move the next speaker in the queue up to the Current Speaker slot on the dashboard.',
        usage: '?next <queue>'
      },
      channel: 'guild',
      userPermissions: ['BAN_MEMBERS']
    })
  }

  * args () {
    const queue = yield {
      type: ['otp', 'rtt', 'cn'],
      prompt: {
        start: 'Enter the queue you want to pull from.',
        retry: 'Please choose one of the following: `otp`, `rtt`, or `cn`.'
      }
    }

    return { queue }
  }

  async exec (message, { queue }) {
    if (message.channel.id !== this.client.config.lectures.channels.lectureQueue) {
      const lectureQueue = await this.client.channels.cache.get(this.client.config.lectures.channels.lectureQueue)
      return message.channel.send(`This command only works in the ${lectureQueue} channel.`)
    }

    await message.delete()

    const messages = await message.channel.messages.fetch()
    const filtered = await messages.filter(message => message.embeds.length !== 0 && message.embeds[0].footer.text === 'Lecture Queue')

    if (filtered.size >= 1) {
      const queueMessage = filtered.first()
      const oldEmbed = queueMessage.embeds[0]
      const otp = queueMessage.embeds[0].fields[1].value.split('\n')
      const rtt = queueMessage.embeds[0].fields[2].value.split('\n')
      const cn = queueMessage.embeds[0].fields[3].value.split('\n')

      const lectureChat = await this.client.channels.cache.get(this.client.config.lectures.channels.lectureChat)
      const newEmbed = this.client.util.embed(oldEmbed)
      let nextSpeaker

      switch (queue) {
        // On That Point
        case 'otp':
          if (otp.includes('─')) {
            return message.channel.send('The **On That Point** queue is empty.')
          }

          nextSpeaker = this.client.util.resolveMember(otp[0], message.guild.members.cache)
          otp.shift()

          newEmbed
            .spliceFields(0, 1, {
              name: ':speech_left: Current Speaker',
              value: `**${nextSpeaker.displayName}**`
            })
            .spliceFields(1, 1, {
              name: ':point_up: On That Point',
              value: otp.length === 0 ? '─' : otp
            })

          lectureChat.send(`${nextSpeaker} is now speaking.`)
          break
        // Related To That
        case 'rtt':
          if (rtt.includes('─')) {
            return message.channel.send('The **Related To That** queue is empty.')
          }

          nextSpeaker = this.client.util.resolveMember(rtt[0], message.guild.members.cache)
          rtt.shift()

          newEmbed
            .spliceFields(0, 1, {
              name: ':speech_left: Current Speaker',
              value: `**${nextSpeaker.displayName}**`
            })
            .spliceFields(2, 1, {
              name: ':raised_hands: Related To That',
              value: rtt.length === 0 ? '─' : rtt
            })

          lectureChat.send(`${nextSpeaker} is now speaking.`)
          break
        // Clarification Needed
        case 'cn':
          if (cn.includes('─')) {
            return message.channel.send('The **Clarification Needed** queue is empty.')
          }

          nextSpeaker = this.client.util.resolveMember(cn[0], message.guild.members.cache)
          cn.shift()

          newEmbed
            .spliceFields(0, 1, {
              name: ':speech_left: Current Speaker',
              value: `**${nextSpeaker.displayName}**`
            })
            .spliceFields(3, 1, {
              name: ':thinking: Clarification Needed',
              value: cn.length === 0 ? '─' : cn
            })

          lectureChat.send(`${nextSpeaker} is now speaking.`)
          break
      }

      return queueMessage.edit(newEmbed)
    }
  }
}

export default NextSpeakerCommand
