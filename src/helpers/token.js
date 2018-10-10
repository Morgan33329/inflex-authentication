
import jwtToken from './../services/token/jwt';

export default function (type) {
    switch (type.toLowerCase()) {
        case "jwt":
            return new jwtToken();
        break;
        default:
            console.error("ERROR: Token generator: " + type + " not supported");
    }

    return null;
}