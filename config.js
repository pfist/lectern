const config = {
  commands: {
    defaultPrefix: '?'
  },
  lectures: {
    channels: {
      lectureQueue: process.env.LECTURE_QUEUE_CHANNEL, // Dev = 809221916228845569, Prod = 759095914886987816
      lectureChat: process.env.LECTURE_CHAT_CHANNEL // Dev = 809221933702971423, Prod = 739543683191406742
    }
  }
}

export default config
