import $ from 'jquery';
window.jQuery = $;
require('ms-signalr-client');

export default class WebSocketService {
  constructor(url) {
    this.connection = null;
    this.hub = null;
    this.setConnection(url)
    this.setHub('DashBoard')
  }

  setConnection(url) {
    this.connection = $.hubConnection(url);
  }

  setHub(hubProxy) {
    const { connection } = this
    this.hub = connection.createHubProxy(hubProxy);
  }

  static facade() {
    const { constructor } = this.prototype;
    return new constructor('http://smartsapp.homologacao.uds.com.br/Uds.Smarts.Api');
  }

  startConnection() {
    const { connection } = this;
    const { hub } = this;
    connection
      .start()
      .done(() => {
        hub.invoke('HandShake', '04376f21-c1cb-4ea2-ad6d-fbcad2ee10fa');
      });
  }
}
