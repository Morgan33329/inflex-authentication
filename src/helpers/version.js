import { authConfig } from './../authentication';

export function middleware (type, version) {
    version = version || 'default';

    return authConfig(version.replace('.', '_') + '.middleware.' + type);
}

export function action (type, version, action) {
    if (action)
        return action;

    let versionAction = authConfig((version ? version.replace('.', '_') + '.' : '') + 'actions.' + type);

    if (versionAction) {
        return versionAction;
    }

    let defaultAction = authConfig('default.actions.' + type);

    if (defaultAction) {
        return defaultAction;
    }

    console.log('ERROR: Invalid action for this route');
    process.exit();
}