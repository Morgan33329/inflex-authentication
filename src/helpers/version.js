import { authConfig } from './../authentication';
import { settingsByUrl } from './settings'

export function middleware (type, req) {
    let middleware = settingsByUrl(req, authConfig('functions'))['middleware'];

    return middleware && middleware[type] || null;
}

export function action (type, req, action) {
    if (action)
        return action;

    let middleware = settingsByUrl(req, authConfig('functions'))['actions'];

    return middleware && middleware[type] || null;
}