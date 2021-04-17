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
        const iconNames = ["folder-open", "compass", "folder"];
        const gabo = Gtk.IconTheme.get_for_display(Gdk.Display.get_default()).get_icon_names();
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