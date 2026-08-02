import { RemoteKeyCode, RemoteDirection } from 'react-native-androidtv-remote';
import { AuthService } from './AuthService';

const DIGIT_KEY_CODES: number[] = [
  RemoteKeyCode.KEYCODE_0,
  RemoteKeyCode.KEYCODE_1,
  RemoteKeyCode.KEYCODE_2,
  RemoteKeyCode.KEYCODE_3,
  RemoteKeyCode.KEYCODE_4,
  RemoteKeyCode.KEYCODE_5,
  RemoteKeyCode.KEYCODE_6,
  RemoteKeyCode.KEYCODE_7,
  RemoteKeyCode.KEYCODE_8,
  RemoteKeyCode.KEYCODE_9,
];

// Délai entre deux chiffres d'un même nombre, pour laisser la TV les
// traiter comme une saisie de chaîne (ex: "1" puis "5" pour la chaîne 15).
const DIGIT_SEQUENCE_DELAY_MS = 150;

// La lib peut lever une exception synchrone (ex: "Socket is closed") si la
// connexion est en fait coupée alors que l'UI pense encore être connectée.
// On l'intercepte partout pour ne jamais faire planter l'app, et on remet
// l'état de connexion en phase avec la réalité.
function safeSend(send: () => void) {
  try {
    send();
  } catch (error) {
    console.warn('Remote command failed', error);
    AuthService.reportTransportFailure();
  }
}

function sendKey(keyCode: number) {
  safeSend(() => AuthService.getRemote()?.sendKey(keyCode, RemoteDirection.SHORT));
}

function sendDigit(digit: number) {
  sendKey(DIGIT_KEY_CODES[digit]);
}

function sendNumber(value: number) {
  String(value)
    .split('')
    .map(Number)
    .forEach((digit, index) => {
      setTimeout(() => sendDigit(digit), index * DIGIT_SEQUENCE_DELAY_MS);
    });
}

export const RemoteService = {
  power: () => safeSend(() => AuthService.getRemote()?.sendPower()),
  home: () => sendKey(RemoteKeyCode.KEYCODE_HOME),
  back: () => sendKey(RemoteKeyCode.KEYCODE_BACK),
  dpadUp: () => sendKey(RemoteKeyCode.KEYCODE_DPAD_UP),
  dpadDown: () => sendKey(RemoteKeyCode.KEYCODE_DPAD_DOWN),
  dpadLeft: () => sendKey(RemoteKeyCode.KEYCODE_DPAD_LEFT),
  dpadRight: () => sendKey(RemoteKeyCode.KEYCODE_DPAD_RIGHT),
  ok: () => sendKey(RemoteKeyCode.KEYCODE_DPAD_CENTER),
  volumeUp: () => sendKey(RemoteKeyCode.KEYCODE_VOLUME_UP),
  volumeDown: () => sendKey(RemoteKeyCode.KEYCODE_VOLUME_DOWN),
  mute: () => sendKey(RemoteKeyCode.KEYCODE_VOLUME_MUTE),
  playPause: () => sendKey(RemoteKeyCode.KEYCODE_MEDIA_PLAY_PAUSE),
  rewind: () => sendKey(RemoteKeyCode.KEYCODE_MEDIA_REWIND),
  fastForward: () => sendKey(RemoteKeyCode.KEYCODE_MEDIA_FAST_FORWARD),
  number: (n: number) => sendNumber(n),
  appLink: (uri: string) => safeSend(() => AuthService.getRemote()?.sendAppLink(uri)),
};
