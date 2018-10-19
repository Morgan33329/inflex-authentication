import _ from 'lodash';

export function defineSettings (version, settings, versionSettings, defaultSettings) {
    if (!versionSettings['default'])
        versionSettings['default'] = defaultSettings;

    if (versionSettings[version])
        return versionSettings;


    var thisSettings = _.assign({}, defaultSettings, settings);

    version = createKey(version);

    versionSettings[version] = thisSettings;

    return versionSettings;
}

export function settingsByUrl (req, settings) {
    var thisSettings = null;

    for (var version in settings) {
        if (version == 'default')
            continue;

        let v = version.replace('_', '.');

        if (req.path.toString().match(new RegExp(v)))
            thisSettings = settings[version];
    }

    return thisSettings || settings.default;
}

export function settingsByVersion (version, settings) {
    return settings[createKey(version)] || settings.default;
}

function createKey (version) {
    return version.replace('.', '_');
}