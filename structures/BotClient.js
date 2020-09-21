import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo'
import { Signale } from 'signale'
import config from '../config'
import ms from 'ms'

class BotClient extends AkairoClient {
  constructor () {
    super({ ownerID: process.env.OWNER_ID }, {
      disableMentions: 'everyone',
      ws: {
        intents: [
          'GUILDS',
          'GUILD_MESSAGES',
          'DIRECT_MESSAGES'
        ]
      }
    })

    this.commandHandler = new CommandHandler(this, {
      directory: './commands',
      allowMention: true,
      commandUtil: true,
      handleEdits: true,
      prefix: config.commands.defaultPrefix,
      argumentDefaults: {
        prompt: {
          cancel: 'OK. The command was cancelled.',
          ended: 'Too many attempts. Please start again.',
          timeout: 'The timer expired. Please start again.',
          retries: 3,
          time: ms('5m')
        }
      }
    })

    this.listenerHandler = new ListenerHandler(this, {
      directory: './listeners'
    })

    this.log = new Signale()
  }

  init () {
    this.commandHandler.useListenerHandler(this.listenerHandler)

    this.commandHandler.loadAll()
    this.log.info('Commands loaded')
    this.listenerHandler.loadAll()
    this.log.info('Listeners loaded')
  }

  async start () {
    await this.init()
    return this.login(process.env.BOT_TOKEN)
  }
}

export default BotClient
