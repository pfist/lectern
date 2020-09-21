import BotClient from './structures/BotClient'
import * as Sentry from '@sentry/node'

const client = new BotClient()

client
  .on('warn', warning => client.log.warn(warning))
  .on('error', error => client.log.error(error))
  .on('disconnect', () => client.log.warn('Connection lost...'))
  .on('reconnect', () => client.log.info('Attempting to reconnect...'))

client.start()

if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN })
} else {
  client.log.warn('Sentry DSN not found. Skipping Sentry initialization.')
}

process.on('unhandledRejection', error => {
  client.log.error(`An unhandled promise rejection occured:\n${error}`)
})
