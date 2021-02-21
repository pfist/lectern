import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo'
import { Signale } from 'signale'
import ms from 'ms'

class BotClient extends AkairoClient {
  constructor (config) {
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

    this.config = config
    this.log = new Signale()

    this.commandHandler = new CommandHandler(this, {
      directory: 'commands',
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
      directory: 'listeners'
    })
  }

  init () {
    this.commandHandler.useListenerHandler(this.listenerHandler)

    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler
    })

    this.commandHandler.loadAll()
    this.log.info('Commands loaded')
    this.listenerHandler.loadAll()
    this.log.info('Listeners loaded')
  }

  async start () {
    try {
      await this.init()
      return this.login(process.env.BOT_TOKEN)
    } catch (err) {
      this.log.error(err)
    }
  }
}

export default BotClient
