import Pusher from 'pusher-js';
export const pusher = new Pusher('2bfc2087a04334d5cf49', {
  cluster: 'ap1',
  encrypted: true,
});