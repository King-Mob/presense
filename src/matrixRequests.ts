import { type MatrixUser } from "./types"

const { VITE_HOMESERVER, VITE_ROOM_ID, VITE_REGISTRATION_TOKEN } = import.meta.env;

export async function register() {
    const username = `presense.${Math.random()}`;
    const password = `${Math.random()}${Math.random()}${Math.random()}`;

    const sessionResponse = await fetch(`${VITE_HOMESERVER}/_matrix/client/v3/register?kind=user`, {
        method: "POST",
        body: JSON.stringify({}),
    });
    const sessionResult = await sessionResponse.json();

    await fetch(`${VITE_HOMESERVER}/_matrix/client/v3/register?kind=user`, {
        method: "POST",
        body: JSON.stringify({
            auth: {
                type: "m.login.registration_token",
                token: VITE_REGISTRATION_TOKEN,
                session: sessionResult.session,
            },
        }),
    });

    const dummyResponse = await fetch(`${VITE_HOMESERVER}/_matrix/client/v3/register?kind=user`, {
        method: "POST",
        body: JSON.stringify({
            device_id: "web-client" + Math.random(),
            initial_device_display_name: "Presense website",
            password: password,
            username: username,
            auth: {
                type: "m.login.dummy",
                session: sessionResult.session,
            },
        }),
    });
    const dummyResult = await dummyResponse.json();
    return dummyResult;
}

export async function joinRoom(user: MatrixUser) {
    await fetch(`${VITE_HOMESERVER}/_matrix/client/v3/join/${VITE_ROOM_ID}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${user.access_token}`,
        },
    });
}

export function sync(user: MatrixUser) {
    console.log(user)
}