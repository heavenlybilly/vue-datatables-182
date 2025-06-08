export class Logger {
  static log(conf: {
    text?: string
    type: string
    background:
      | 'orange'
      | 'green'
      | 'red'
      | 'yellow'
      | 'blue'
      | 'magenta'
      | 'cyan'
      | 'white'
      | 'gray'
      | 'transparent'
      | string
    color: 'white' | 'black'
    payload?: any
  }) {
    const type = `%c[${conf.type}]${conf.text ? ':' : ''}`
    const style = `background: ${conf.background}; color: ${conf.color}; padding: 2px 5px; border-radius: 3px;`

    if (conf.payload === undefined) {
      console.log(type, style, conf.text ?? '')

      return
    }

    console.log(type, style, conf.text, conf.payload)
  }

  static event(text: string, payload: any = undefined) {
    Logger.log({
      text,
      payload,
      type: 'event',
      color: 'black',
      background: 'orange',
    })
  }

  static info(info: string, payload: any = undefined) {
    Logger.log({
      payload,
      type: info,
      color: 'black',
      background: 'yellow',
    })
  }

  static trigger(target: string, text: string, payload: any = undefined) {
    Logger.log({
      text,
      payload,
      type: `trigger ${target}`,
      color: 'white',
      background: 'blue',
    })
  }

  static red(type: string, text: string, payload: any = undefined) {
    Logger.log({
      text,
      payload,
      type,
      color: 'white',
      background: 'red',
    })
  }

  static store(text: string, payload: any = undefined) {
    Logger.log({
      type: 'store',
      text,
      payload,
      color: 'white',
      background: 'gray',
    })
  }

  static start(type: string) {
    Logger.log({
      type,
      text: 'start... 🚀',
      color: 'black',
      background: 'lime',
    })
  }

  static end(type: string) {
    Logger.log({
      type,
      text: 'finish... 🎯',
      color: 'black',
      background: 'red',
    })
  }
}
