import * as ChannelService from '@channel.io/channel-web-sdk-loader';

class ChannelTalkService {
  constructor() {
    this.loadScript();
  }

  loadScript() {
    ChannelService.loadScript();
  }

  boot(settings: any) {
    ChannelService.boot({
        "pluginKey" : import.meta.env.VITE_APP_CHANNELTALK_KEY,
        ...settings,
    });
  }

  shutdown() {
    ChannelService.shutdown();
  }
}

export default new ChannelTalkService();