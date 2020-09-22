import { Listener } from 'discord-akairo'

class ReadyListener extends Listener {
  constructor () {
    super('ready', {
      emitter: 'client',
      event: 'ready'
    })
  }

  exec () {
    this.client.user.setActivity('the chat • !help', {
      type: 'WATCHING'
    })

    this.client.guilds.cache.each(guild => this.client.log.success(`${this.client.user.username} successfully connected to ${guild.name}.`))
  }
}

export default ReadyListener
