import { Command } from 'discord-akairo'
import ms from 'pretty-ms'

class UptimeCommand extends Command {
  constructor () {
    super('uptime', {
      aliases: ['uptime'],
      category: 'Developer',
      description: {
        name: 'Uptime',
        short: 'Get the elapsed time since the bot last logged in.',
        long: 'Get the elapsed time since the bot last logged in.',
        usage: '!uptime'
      },
      channel: 'guild',
      userPermissions: ['MANAGE_GUILD'],
      protected: true
    })
  }

  async exec (message) {
    const uptime = await ms(this.client.uptime, { secondsDecimalDigits: 0 })
    return message.util.send(`:stopwatch: Uptime: **${uptime}**`)
  }
}

export default UptimeCommand
