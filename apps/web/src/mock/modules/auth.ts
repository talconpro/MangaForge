const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms))

export async function login(account: string, _password: string) {
  await delay()
  return {
    token: 'mock-token',
    user: {
      id: 'u1',
      username: account.split('@')[0] || 'producer',
    },
  }
}
