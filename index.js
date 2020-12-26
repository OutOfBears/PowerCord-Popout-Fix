const { Plugin } = require('powercord/entities')
const { getModule, FluxDispatcher } = require('powercord/webpack') 

class PopoutFix extends Plugin {
    onPopoutOpen(e) {
        const window = this.windowStore.getWindow(e.key);
        this.popouts.set(e.key, window);
    }

    onPopoutClose(e) {
        this.popouts.delete(e.key);
    }

    startPlugin() {
        this.windowStore = getModule([ 'getWindow', 'getWindowKeys' ], false);
        this.onPopoutOpen = this.onPopoutOpen.bind(this);
        this.onPopoutClose = this.onPopoutClose.bind(this);
        this.popouts = window.popouts || (function() { throw 'No window popouts' })();
        FluxDispatcher.subscribe('POPOUT_WINDOW_OPEN', this.onPopoutOpen);
        FluxDispatcher.subscribe('POPOUT_WINDOW_CLOSE', this.onPopoutClose);
    }

    pluginWillUnload() {
        FluxDispatcher.unsubscribe('POPOUT_WINDOW_OPEN', this.onPopoutOpen);
        FluxDispatcher.unsubscribe('POPOUT_WINDOW_CLOSE', this.onPopoutClose);
    }
}

module.exports = PopoutFix;
