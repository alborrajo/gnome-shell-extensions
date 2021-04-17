// -*- mode: js2; indent-tabs-mode: nil; js2-basic-offset: 4 -*-
/* exported init buildPrefsWidget */

const { Gio, GObject, Gtk, Gdk, GdkPixbuf } = imports.gi;

const Gettext = imports.gettext.domain('gnome-shell-extensions');
const _ = Gettext.gettext;

const ExtensionUtils = imports.misc.extensionUtils;


function init() {
    ExtensionUtils.initTranslations();
}

const WindowListPrefsWidget = GObject.registerClass(
class WindowListPrefsWidget extends Gtk.Box {

    _init() {
        super._init({
            orientation: Gtk.Orientation.VERTICAL,
            spacing: 6,
            margin_top: 36,
            margin_bottom: 36,
            margin_start: 36,
            margin_end: 36,
            halign: Gtk.Align.CENTER,
        });

        this._settings = ExtensionUtils.getSettings();

        //Create a label & switch for `show-indicator`
        const iconBox = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 12,
            margin_bottom: 12,
        });
        this.append(iconBox);

        iconBox.append(new Gtk.Label({
            label: 'Show Icon:',
            halign: Gtk.Align.START,
            visible: true
        }));
        
        const iconSwitch = new Gtk.Switch({
            active: this._settings.get_boolean('show-icon'),
            halign: Gtk.Align.END,
            visible: true
        });
        iconBox.append(iconSwitch);

        // Bind the switch to the `show-icon` key
        this._settings.bind(
            'show-icon',
            iconSwitch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        // Icon selector
        const listStore = new Gtk.ListStore();
        listStore.set_column_types([GObject.TYPE_STRING, GdkPixbuf.Pixbuf])

        let cbox = new Gtk.ComboBox({model: listStore});
        let rendererPixbuf = new Gtk.CellRendererPixbuf();
        cbox.pack_start (rendererPixbuf, false);
        cbox.add_attribute (rendererPixbuf, "icon-name", 0);
        cbox.set_active(0);
        let rendererText = new Gtk.CellRendererText();
        cbox.pack_start (rendererText, false);
        cbox.add_attribute (rendererText, "text", 0);
        cbox.set_active(1);

        iconBox.append(cbox);

        const selectedIconName = this._settings.get_string('icon-path')
        const iconNames = [
            'address-book-new',
            'application-exit',
            'appointment-new',
            'call-start',
            'call-stop',
            'contact-new',
            'document-new',
            'document-open',
            'document-open-recent',
            'document-page-setup',
            'document-print',
            'document-print-preview',
            'document-properties',
            'document-revert',
            'document-save',
            'document-save-as',
            'document-send',
            'edit-clear',
            'edit-copy',
            'edit-cut',
            'edit-delete',
            'edit-find',
            'edit-find-replace',
            'edit-paste',
            'edit-redo',
            'edit-select-all',
            'edit-undo',
            'folder-new',
            'format-indent-less',
            'format-indent-more',
            'format-justify-center',
            'format-justify-fill',
            'format-justify-left',
            'format-justify-right',
            'format-text-direction-ltr',
            'format-text-direction-rtl',
            'format-text-bold',
            'format-text-italic',
            'format-text-underline',
            'format-text-strikethrough',
            'go-bottom',
            'go-down',
            'go-first',
            'go-home',
            'go-jump',
            'go-last',
            'go-next',
            'go-previous',
            'go-top',
            'go-up',
            'help-about',
            'help-contents',
            'help-faq',
            'insert-image',
            'insert-link',
            'insert-object',
            'insert-text',
            'list-add',
            'list-remove',
            'mail-forward',
            'mail-mark-important',
            'mail-mark-junk',
            'mail-mark-notjunk',
            'mail-mark-read',
            'mail-mark-unread',
            'mail-message-new',
            'mail-reply-all',
            'mail-reply-sender',
            'mail-send',
            'mail-send-receive',
            'media-eject',
            'media-playback-pause',
            'media-playback-start',
            'media-playback-stop',
            'media-record',
            'media-seek-backward',
            'media-seek-forward',
            'media-skip-backward',
            'media-skip-forward',
            'object-flip-horizontal',
            'object-flip-vertical',
            'object-rotate-left',
            'object-rotate-right',
            'process-stop',
            'system-lock-screen',
            'system-log-out',
            'system-run',
            'system-search',
            'system-reboot',
            'system-shutdown',
            'tools-check-spelling',
            'view-fullscreen',
            'view-refresh',
            'view-restore',
            'view-sort-ascending',
            'view-sort-descending',
            'window-close',
            'window-new',
            'zoom-fit-best',
            'zoom-in',
            'zoom-original',
            'zoom-out',

            'process-working',

            'accessories-calculator',
            'accessories-character-map',
            'accessories-dictionary',
            'accessories-text-editor',
            'help-browser',
            'multimedia-volume-control',
            'preferences-desktop-accessibility',
            'preferences-desktop-font',
            'preferences-desktop-keyboard',
            'preferences-desktop-locale',
            'preferences-desktop-multimedia',
            'preferences-desktop-screensaver',
            'preferences-desktop-theme',
            'preferences-desktop-wallpaper',
            'system-file-manager',
            'system-software-install',
            'system-software-update',
            'utilities-system-monitor',
            'utilities-terminal',

            'applications-accessories',
            'applications-development',
            'applications-engineering',
            'applications-games',
            'applications-graphics',
            'applications-internet',
            'applications-multimedia',
            'applications-office',
            'applications-other',
            'applications-science',
            'applications-system',
            'applications-utilities',
            'preferences-desktop',
            'preferences-desktop-peripherals',
            'preferences-desktop-personal',
            'preferences-other',
            'preferences-system',
            'preferences-system-network',
            'system-help',

            'audio-card',
            'audio-input-microphone',
            'battery',
            'camera-photo',
            'camera-video',
            'camera-web',
            'computer',
            'drive-harddisk',
            'drive-optical',
            'drive-removable-media',
            'input-gaming',
            'input-keyboard',
            'input-mouse',
            'input-tablet',
            'media-flash',
            'media-floppy',
            'media-optical',
            'media-tape',
            'modem',
            'multimedia-player',
            'network-wired',
            'network-wireless',
            'pda',
            'phone',
            'printer',
            'scanner',
            'video-display',

            'emblem-default',
            'emblem-documents',
            'emblem-downloads',
            'emblem-favorite',
            'emblem-important',
            'emblem-mail',
            'emblem-photos',
            'emblem-readonly',
            'emblem-shared',
            'emblem-symbolic-link',
            'emblem-synchronized',
            'emblem-system',
            'emblem-unreadable',

            'face-angel',
            'face-angry',
            'face-cool',
            'face-crying',
            'face-devilish',
            'face-embarrassed',
            'face-kiss',
            'face-laugh',
            'face-monkey',
            'face-plain',
            'face-raspberry',
            'face-sad',
            'face-sick',
            'face-smile',
            'face-smile-big',
            'face-smirk',
            'face-surprise',
            'face-tired',
            'face-uncertain',
            'face-wink',
            'face-worried',

            'flag-aa',

            'application-x-executable',
            'audio-x-generic',
            'font-x-generic',
            'image-x-generic',
            'package-x-generic',
            'text-html',
            'text-x-generic',
            'text-x-generic-template',
            'text-x-script',
            'video-x-generic',
            'x-office-address-book',
            'x-office-calendar',
            'x-office-document',
            'x-office-presentation',
            'x-office-spreadsheet',

            'folder',
            'folder-remote',
            'network-server',
            'network-workgroup',
            'start-here',
            'user-bookmarks',
            'user-desktop',
            'user-home',
            'user-trash',

            'appointment-missed',
            'appointment-soon',
            'audio-volume-high',
            'audio-volume-low',
            'audio-volume-medium',
            'audio-volume-muted',
            'battery-caution',
            'battery-low',
            'dialog-error',
            'dialog-information',
            'dialog-password',
            'dialog-question',
            'dialog-warning',
            'folder-drag-accept',
            'folder-open',
            'folder-visiting',
            'image-loading',
            'image-missing',
            'mail-attachment',
            'mail-unread',
            'mail-read',
            'mail-replied',
            'mail-signed',
            'mail-signed-verified',
            'media-playlist-repeat',
            'media-playlist-shuffle',
            'network-error',
            'network-idle',
            'network-offline',
            'network-receive',
            'network-transmit',
            'network-transmit-receive',
            'printer-error',
            'printer-printing',
            'security-high',
            'security-medium',
            'security-low',
            'software-update-available',
            'software-update-urgent',
            'sync-error',
            'sync-synchronizing',
            'task-due',
            'task-past-due',
            'user-available',
            'user-away',
            'user-idle',
            'user-offline',
            'user-trash-full',
            'weather-clear',
            'weather-clear-night',
            'weather-few-clouds',
            'weather-few-clouds-night',
            'weather-fog',
            'weather-overcast',
            'weather-severe-alert',
            'weather-showers',
            'weather-showers-scattered',
            'weather-snow',
            'weather-storm'
        ]
        //const iconNames = Gtk.IconTheme.get_for_display(Gdk.Display.get_default()).get_icon_names();
        for(const iconName of iconNames) {
            const iter = listStore.append();
            listStore.set(iter, [0], [iconName]);

            if(iconName === selectedIconName) {
                cbox.set_active_iter(iter);
            }
        }

        // Save settings when selecting an item
        cbox.connect ('changed', (entry) => {
            const [success, selectedIter] = cbox.get_active_iter()
            if(success)
                this._settings.set_string('icon-path', listStore.get_value(selectedIter, 0));
        });
        
        /*const iconEntryBuffer = new Gtk.EntryBuffer({
            text: this._settings.get_string('icon-path')
        })
        const iconEntry = new Gtk.Entry({
            buffer: iconEntryBuffer
        })
        iconBox.append(iconEntry);

        this._settings.bind(
            'icon-path',
            iconEntryBuffer,
            'text',
            Gio.SettingsBindFlags.DEFAULT
        );*/

        /*const iconButton = new Gtk.Button()
        iconButton.set_child(new Gtk.Image({
            gicon: Gio.icon_new_for_string(this._settings.get_string('icon-path'))
        }))
        iconBox.append(iconButton);*/

        /*this._settings.bind(
            'icon-path',
            iconButton,
            'buffer',
            Gio.SettingsBindFlags.DEFAULT
        );*/

        
        //Create a label & switch for `show-label`
        const labelBox = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            spacing: 12,
            margin_bottom: 12,
        });
        this.append(labelBox);

        labelBox.append(new Gtk.Label({
            label: 'Show Label:',
            halign: Gtk.Align.START,
            visible: true
        }));
        
        const labelSwitch = new Gtk.Switch({
            active: this._settings.get_boolean('show-label'),
            halign: Gtk.Align.END,
            visible: true
        });
        labelBox.append(labelSwitch);

        // Bind the switch to the `show-label` key
        this._settings.bind(
            'show-label',
            labelSwitch,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        const labelEntryBuffer = new Gtk.EntryBuffer({
            text: this._settings.get_string('label-text')
        })
        const labelEntry = new Gtk.Entry({
            buffer: labelEntryBuffer
        })
        labelBox.append(labelEntry);

        this._settings.bind(
            'label-text',
            labelEntryBuffer,
            'text',
            Gio.SettingsBindFlags.DEFAULT
        );

    }
});

function buildPrefsWidget() {
    return new WindowListPrefsWidget();
}