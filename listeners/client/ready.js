import { Listener } from 'discord-akairo'

class ReadyListener extends Listener {
  constructor () {
    super('ready', {
      emitter: 'client',
      event: 'ready'
    })
  }

  exec () {
    this.client.user.setActivity('to the discussion • !help', {
      type: 'LISTENING'
    })

    this.client.guilds.cache.each(guild => this.client.log.success(`${this.client.user.username} successfully connected to ${guild.name}.`))
  }
}

export default ReadyListener
