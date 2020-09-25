import { Command } from 'discord-akairo'

class PingCommand extends Command {
  constructor () {
    super('ping', {
      aliases: ['ping'],
      category: 'Developer',
      description: {
        name: 'Ping',
        short: 'Check the bot\'s latency',
        long: 'Check how long (in milliseconds) it takes for the bot to respond.',
        usage: '?ping'
      },
      channel: 'guild',
      userPermissions: ['MANAGE_GUILD'],
      protected: true
    })
  }

  async exec (message) {
    const reply = await message.util.send(':ping_pong: Pong!')
    const difference = (reply.editedAt || reply.createdAt) - (message.editedAt || message.createdAt)
    return message.util.send(`:ping_pong: Pong! Response Time: **${difference}ms**`)
  }
}

export default PingCommand
